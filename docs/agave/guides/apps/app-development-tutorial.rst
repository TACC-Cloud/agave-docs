.. role:: raw-html-m2r(raw)
   :format: html


We will now go through the process of building and deploying a Tapis application to provide 'samtools sort' functionality on TACC's Stampede system. The following tutorial assumes you have properly installed and configured the iPlant SDK on Stampede. They assume you have defined an environment variable IPLANTUSERNAME as your iPlant username (e.g. IPLANTUSERNAME=youriplantusername).

Tapis application packaging
---------------------------

Tapis API apps have a generalized structure that allows them to carry dependencies around with them. In the case below, :raw-html-m2r:`<em>package-name-version.dot.dot</em>` is a folder that you build on your local system, then store in the iPlant Data Store in a designated location (we recommend IPLANTUSERNAME/applications/APPFOLDER). It contains binaries, support scripts, test data, etc. all in one package. Tapis basically uses a very rough form of containerized applications (more on this later). We suggest you set your apps up to look something like the following:

[code lang=text]
package-name-version.dot.dot
|--system_name
|----bin.tgz (optional)
|----lib.tgz (optional)
|----include.tgz (optional)
|----test.sh
|----script.template
|----test_data (optional)
|----app.json

.. code-block::


   Tapis runs a job by first transferring a copy of this directory into temporary directory on the target executionSystem. Then, the input data files (we'll show you how to specify those are later) are staged into place automatically. Next, Tapis writes a scheduler submit script (using a template you provide i.e. script.template) and puts it in the queue on the target system. The Tapis service then monitors progress of the job and, assuming it completes, copies all newly-created files to the location specified when the job was submitted. Along the way, critical milestones and metadata are recorded in the job's history.

   <em>Tapis app development proceeds via the following steps:</em>

   <ol>
   <li>Build the application locally on the executionSystem</li>
   <li>Ensure that you are able to run it directly on the executionSystem</li>
   <li>Describe the application using a Tapis app description</li>
   <li>Create a shell template for running the app</li>
   <li>Upload the application directory to a storageSystem</li>
   <li>Post the app description to the Tapis apps service</li>
   <li>Debug your app by running jobs and updating the app until it works as intended</li>
   <li>(Optional) Share the app with some friends to let them test it</li>
   </ol>

   ### Build a samtools application bundle  

   ```shell
   #!/bin/bash

   # Log into Stampede 
   ssh stampede.tacc.utexas.edu

   # Unload system&#039;s samtools module if it happens to be loaded by default
   module unload samtools

   # All TACC systems have a directory than can be accessed as $WORK
   cd $WORK

   # Set up a project directory
   mkdir iPlant
   mkdir iPlant/src
   mkdir -p iPlant/samtools-0.1.19/stampede/bin
   mkdir -p iPlant/samtools-0.1.19/stampede/test

   # Build samtools using the Intel C Compiler
   # If you don&#039;t have icc, gcc will work but icc usually gives more efficient binaries
   cd iPlant/src
   wget "http://downloads.sourceforge.net/project/samtools/samtools/0.1.19/samtools-0.1.19.tar.bz2"
   tar -jxvf samtools-0.1.19.tar.bz2
   cd samtools-0.1.19
   make CC=icc

   # Copy the samtools binary and support scripts to the project bin directory
   cp -R samtools bcftools misc ../../samtools-0.1.19/stampede/bin/
   cd ../../samtools-0.1.19/stampede

   # Test that samtools will launch
   bin/samtools

       Program: samtools (Tools for alignments in the SAM format)
       Version: 0.1.19-44428cd

       Usage:   samtools &lt;command&gt; [options]

       Command: view        SAM&lt;-&gt;BAM conversion
                sort        sort alignment file
                mpileup     multi-way pileup...

   # Package up the bin directory as an compressed archive 
   # and remove the original. This preserves the execute bit
   # and other permissions and consolidates movement of all
   # bundled dependencies in bin to a single operation. You
   # can adopt a similar approach with lib and include.
   tar -czf bin.tgz bin &amp;&amp; rm -rf bin

Run samtools sort locally
^^^^^^^^^^^^^^^^^^^^^^^^^

Your first objective is to create a script that you know will run to completion under the Stampede scheduler and environment (or whatever executionSystem you're working on). It will serve as a model for the template file you create later. In our case, we need to write a script that can be submitted to the Slurm scheduler. The standard is to use Bash for such scripts. You have five main objectives in your script:


.. raw:: html

   <ul>
   <li>Unpack binaries from bin.tgz</li>
   <li>Extend your PATH to contain bin</li>
   <li>Craft some option-handling logic to accept parameters from Tapis</li>
   <li>Craft a command line invocation of the application you will run</li>
   <li>Clean up when you're done</li>
   </ul>


First, you will need some test data in your current directory (i.e., $WORK/iPlant/samtools-0.1.19/stampede/ ). You can use this test file

.. code-block:: shell

   files-get -S data.agaveapi.co /shared/iplantcollaborative/example_data/Samtools_mpileup/ex1.bam

or you can any other BAM file for your testing purposes. Make sure if you use another file to change the filename in your test script accordingly!

Now, author your script. You can paste the following code into a file called :raw-html-m2r:`<em>test-sort.sh</em>` or you can copy it from $IPLANT_SDK_HOME/examples/samtools-0.1.19/stampede/test-sort.sh

.. code-block:: shell

   #!/bin/bash

   # Tapis automatically writes these scheduler
   # directives when you submit a job but we have to
   # do it by hand when writing our test

   #SBATCH -p development
   #SBATCH -t 00:30:00
   #SBATCH -n 16
   #SBATCH -A iPlant-Collabs 
   #SBATCH -J test-samtools
   #SBATCH -o test-samtools.o%j

   # Set up inputs and parameters
   # We&#039;re emulating passing these in from Tapis
   # inputBam is the name of the file to be sorted
   inputBam="ex1.bam"
   # outputPrefix is a parameter that establishes
   # the prefix for the final sorted file
   outputPrefix="sorted"
   # Parameter for memory used in sort operation, in bytes
   maxMemSort=500000000
   # Boolean: Sort by name instead of coordinate
   nameSort=0

   # Unpack the bin.tgz file containing samtools binaries
   # If you are relying entirely on system-supplied binaries 
   # you don&#039;t need this bit
   tar -xvf bin.tgz
   # Extend PATH to include binaries in bin
   # If you need to extend lib, include, etc 
   # the same approach is applicable
   export PATH=$PATH:"$PWD/bin"

   # Dynamically construct a command line
   # by building an ARGS string then
   # adding the command, file specifications, etc
   #
   # We&#039;re doing this in a way familar to Tapis V1 users
   # first. Later, we&#039;ll illustrate how to make use of
   # Tapis V2&#039;s new parameter passing functions
   #
   # Start with empty ARGS...
   ARGS=""
   # Add -m flag if maxMemSort was specified
   # You might want to add a constraint for how large maxMemSort
   # can be based on the available memory on your executionSystem
   if [ ${maxMemSort} -gt 0 ]; then ARGS="${ARGS} -m $maxMemSort"; fi

   # Boolean handler for -named sort
   if [ ${nameSort} -eq 1 ]; then ARGS="${ARGS} -n "; fi

   # Run the actual program
   samtools sort ${ARGS} ${inputBam} ${outputPrefix}

   # Now, delete the bin/ directory
   rm -rf bin

Submit the job to the queue on Stampede...
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   chmod 700 test-sort.sh 
   sbatch test-sort.sh

You can monitor your jobs in the queue using

.. code-block:: shell

   showq -u your_tacc_username

Assuming all goes according to plan, you'll end up with a sorted BAM called :raw-html-m2r:`<em>sorted.bam</em>`\ , and your bin directory (but not the bin.tgz file) should be erased. Congratulations, you're in the home stretch: it's time to turn the test script into a Tapis app.

Craft a Tapis app description
------------------------------

In order for Tapis to know how to run an instance of the application, we need to provide quite a bit of metadata about the application. This includes a unique name and version, the location of the application bundle, the identities of the execution system and destination system for results, whether its an HPC or other kind of job, the default number of processors and memory it needs to run, and of course, all the inputs and parameters for the actual program. It seems a bit over-complicated, but only because you're comfortable with the command line already. Your goal here is to allow your applications to be portable across systems and present a web-enabled, rationalized interface for your code to consumers.

Rather than have you write a description for "samtools sort" from scratch, let's systematically dissect an existing file provided with the SDK. Go ahead and copy the file into place and open it in your text editor of choice. If you don't have the SDK installed, you can :raw-html-m2r:`<a href="../examples/samtools-0.1.19/stampede/samtools-sort.json">grab it here</a>`.

.. code-block:: shell

   cd $WORK/iPlant/samtools-0.1.19/stampede/
   cp $IPLANT_SDK_HOME/examples/samtools-0.1.19/stampede/samtools-sort.json .

Open up samtools-sort.json in a text editor or :raw-html-m2r:`<a href="../examples/samtools-0.1.19/stampede/samtools-sort.json">in your web browser</a>` and follow along below.

Craft a shell script template
-----------------------------

Create sort.template using your test-sort.sh script as the starting point.

.. code-block:: shell

   cp test-sort.sh sort.template

Now, open sort.template in the text editor of your choice. Delete the bash shebang line and the SLURM pragmas. Replace the hard-coded values for inputs and parameters with variables defined by your app description.

.. code-block:: shell

   # Set up inputs...
   # Since we don&#039;t check these when constructing the
   # command line later, these will be marked as required
   inputBam=${inputBam}
   # and parameters
   outputPrefix=${outputPrefix}
   # Maximum memory for sort, in bytes
   # Be careful, Neither Tapis nor scheduler will
   # check that this is a reasonable value. In production
   # you might want to code min/max for this value
   maxMemSort=${maxMemSort}
   # Boolean: Sort by name instead of coordinate
   nameSort=${nameSort}

   # Unpack the bin.tgz file containing samtools binaries
   tar -xvf bin.tgz
   # Set the PATH to include binaries in bin
   export PATH=$PATH:"$PWD/bin"

   # Build up an ARGS string for the program
   # Start with empty ARGS...
   ARGS=""
   # Add -m flag if maxMemSort was specified
   if [ ${maxMemSort} -gt 0 ]; then ARGS="${ARGS} -m $maxMemSort"; fi

   # Boolean handler for -named sort
   if [ ${nameSort} -eq 1 ]; then ARGS="${ARGS} -n "; fi

   # Run the actual program
   samtools sort ${ARGS} $inputBam ${outputPrefix}

   # Now, delete the bin/ directory
   rm -rf bin

### Storing an app bundle on a storageSystem
--------------------------------------------

Each time you (or another user) requests an instance of samtools sort, Tapis copies data from a "deploymentPath" on a "storageSystem" as part of creating the temporary working directory on an "executionSystem". Now that you've crafted the application bundle's dependencies and script template, it's time to store it somewhere accessible by Tapis.


.. raw:: html

   <aside class="notice">If you've never deployed a Tapis-based app, you may not have an applications directory in your home folder. Since this is where we recommend you store the apps, create one.</aside>


.. code-block:: shell

   # Check to see if you have an applications directory
   curl -sk -H "Authorization: Bearer api-access-token" https://api.example.com/files/v2/listings/data.agaveapi.co/$API_USERNAME/applications

   # If you see: File/folder does not exist
   # then you need to create an applications directory
   curl -sk -H "Authorization: Bearer de32225c235cf47b9965997270a1496c" -X POST -d "action=mkdir&amp;path=applications" https://api.example.com/files/v2/listings/data.agaveapi.co/$API_USERNAME

[oldy]

.. code-block:: shell

   # Check to see if you have an applications directory
   files-list -S data.agaveapi.co $IPLANTUSERNAME/applications
   # If you see: File/folder does not exist
   # then you need to create an applications directory
   files-mkdir -S data.agaveapi.co -N "applications" $IPLANTUSERNAME/

[/tabgroup]

Now, go ahead with the upload:

.. code-block:: shell

   # cd out of the bundle
   cd $WORK/iPlant
   # Upload using files-upload
   files-upload -S data.agaveapi.co -F samtools-0.1.19 $IPLANTUSERNAME/applications

Post the app description to Tapis
---------------------------------

As mentioned in the overview, several personalizations to samtools-sort.json are required.  Specifically, edit the samtools-sort.json file to change:


.. raw:: html

   <ul>
   <li>the <em>executionSystem</em> to your private Stampede system, </li>
   <li>the <em>deploymentPath</em> to your own iPlant applications directory for samtools</li>
   <li>the <em>name</em> to <em>$IPLANTUSERNAME-samtools-sort</em></li>
   </ul>


Post the JSON file to Tapis's app service.

.. code-block:: shell

   apps-addupdate -F samtools-0.1.19/stampede/samtools-sort.json


.. raw:: html

   <aside class="notice">If you see this error "Permission denied. An application with this unique id already exists and you do not have permission to update this application. Please either change your application name or update the version number", you forgot to change the name or the name you chose conflicts with another Tapis application. Change it again in the JSON file and resubmit.</aside>


Updating your application metadata or bundle
--------------------------------------------

Any time you need to update the metadata description of your non-public application, you can just make the changes locally to the JSON file and and re-post it. The next time Tapis creates a job using this application, it will use the new description.

.. code-block:: shell

   apps-addupdate -F samtools-0.1.19/stampede/samtools-sort.json $IPLANTUSERNAME-samtools-sort-0.1.19

The field :raw-html-m2r:`<em>$IPLANTUSERNAME-samtools-sort-0.1.19</em>` at the end is the appid you're updating. Tapis tries to guess from the JSON file but to remove uncertainty, we recommend always specifying it explicitly.

Any time you need to update the binaries, libraries, templates, etc. in your non-public application, you can just make the changes locally and re-upload the bundle. The next time Tapis creates a job using this application, it will stage the updated version of the application bundle into place on the executionSystem and it to complete your task. It's a little more complicated to deal with fully public apps, and so we'll cover that in a separate document.

Verify your new app description
-------------------------------

First, you may check to see if your new application shows up in the bulk listing:

.. code-block:: shell

   # Shows all apps that are public, private to you, or shared with you
   apps-list 
   # Show all apps on a specific system that are public, private to you, or shared with you
   apps-list -S stampede.tacc.utexas.edu
   # Show only your private apps
   apps-list --privateonly

You should see :raw-html-m2r:`<em>your new app ID</em>` in "apps-list" and "apps-list --privateonly" but not "apps-list -S stampede.tacc.utexas.edu". Why do you think this is the case? Give up? It's because your new app is not registered to the public iPlant-maintained executionSystem called "stampede.tacc.utexas.edu" and so is filtered from display.

You can print a detailed view, in JSON format, of any app description to your screen:

.. code-block:: shell

   apps-list -v APP_ID

Take some time to review how the app description looks when printed from app-list relative to how it looked as a JSON file in your text editor. There are likely some additional fields present (generated by the Tapis service) and the presentation may differ from your expectation. Understanding the relationship between what the service returns and the input data structure is crucial for being able to debug effectively.
