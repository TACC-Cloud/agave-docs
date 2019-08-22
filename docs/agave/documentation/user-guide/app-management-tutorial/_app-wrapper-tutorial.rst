.. role:: raw-html-m2r(raw)
   :format: html


Wrapper Templates
^^^^^^^^^^^^^^^^^

In order to run your application, you will need to create a wrapper template that calls your executable code. The wrapper template is a simple script that Tapis will filter and execute to start your app. The filtering Tapis applies to your wrapper script is to inject runtime values from a job request into the script to replace the template variables representing the inputs and parameters of your app.

The order in which wrapper templates are processed in HPC and CLI apps is as follows.

.. code-block:: shell


       1. <span class="code">environment</span> variables injected.
       2. <span class="code">startupScript</span> run.
       3. Scheduler directives prepended to the wrapper template.
       4. <span class="code">additionalDirectives</span> concatenated after the scheduler directives.
       5. Custom <span class="code">modules</span> concatenated after the <span class="code">additionalDirectives</span>.
       6. <span class="code">inputs</span> and <span class="code">parameters</span> template variables replaced with values from the job request.
       7. Blacklist commands, if present, are disabled in the scripts.
       8. >Resulting script is written to the remote job execution folder and executed.



   [tab title="CLI Wrappers"]
   &nbsp; &nbsp;  

       1. Shell environment sourced
       2. <span class="code">environment</span> variables injected
       3. <span class="code">startupScript</span> run
       4. Custom <span class="code">modules</span> prepended to the top of the wrapper
       5. <span class="code">inputs</span> and <span class="code">parameters</span> template variables replaced with values from the  job request
       6. Blacklist commands, if present, are disabled in the scripts.
       7. Resulting script is forked into the background immediately.



   [/tabgroup]

   #### Environment  

   Comes from the system definition. Handle in your script if you cannot change the system definition to suite your needs. Ship whatever you need with your app's assets.

   #### Modules  

   See more about <a href="http://modules.sourceforge.net/" title="The Environment Modules Project" target="_blank">Modules</a> and <a href="https://github.com/TACC/Lmod" title="Lmod: An Environment Module System based on Lua" target="_blank">Lmod</a>. Can be used to customize your environment, locate your application, and improve portability between systems. Tapis does not install or manage the module installation on a particular system, however it does know how to interact with it. Specifying the modules needed to run your app either in your wrapper template or in your system definition can greatly help you during the development process.

   #### Input data  

   Tapis will stage the files and folders you specify as inputs to your app. These will be available in the top level of your job directory at runtime. Additionally, the names of each of the inputs will be injected into your wrapper template for you to use in your application logic. Please be aware that Tapis will not attempt to resolve namespace conflicts between your app inputs. That means that if a job specifies two inputs with the same name, one will overwrite the other during the input staging phase of the job and, though the variable names will be correctly injected to the wrapper script, your job will most likely fail due to missing data.

   #### Variable injection  

   If you refer back to the app definition we used in the App Management Tutorial, you will see there are multiple inputs and parameters defined for that app. Each input and parameter object had an `id` attribute. That `id` value is the attribute name you use to associate runtime values with app inputs and parameters. When a job is submitted to Tapis, prior to physically running the wrapper template, all instances of that `id` are replaced with the actual value from the job request. For example, the following example shows our app description, a job request, and the resulting wrapper template at run time.

   #### Type declarations  

   During the jobs submission process, Tapis will store your inputs and parameters as serialized JSON. At the point that variable injection occurs, Tapis will

   #### Boolean values  

   #### Cardinality  

   #### Validation  

   #### Parameter Flags  

   ### App packaging  

   Tapis API apps have a generalized structure that allows them to carry dependencies around with them. In the case below, <em>package-name-version.dot.dot</em> is a folder that you build on your local system, then store in the iPlant Data Store in a designated location (we recommend /iplant/home/IPLANTUSERNAME/applications/APPFOLDER). It contains binaries, support scripts, test data, etc. all in one package. Tapis basically uses a very rough form of containerized applications (more on this later). We suggest you set your apps up to look something like the following:

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

   1. Build the application locally on the executionSystem
   2. Ensure that you are able to run it directly on the executionSystem
   3. Describe the application using a Tapis app description
   4. Create a shell template for running the app
   5. Upload the application directory to a storageSystem
   6. Post the app description to the Tapis apps service
   7. Debug your app by running jobs and updating the app until it works as intended
   8. (Optional) Share the app with some friends to let them test it

   ### Build a samtools application bundle  

   ```shell
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


* Unpack binaries from bin.tgz
* Extend your PATH to contain bin
* Craft some option-handling logic to accept parameters from Tapis
* Craft a command line invocation of the application you will run
* Clean up when you're done

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
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order for Tapis to know how to run an instance of the application, we need to provide quite a bit of metadata about the application. This includes a unique name and version, the location of the application bundle, the identities of the execution system and destination system for results, whether its an HPC or other kind of job, the default number of processors and memory it needs to run, and of course, all the inputs and parameters for the actual program. It seems a bit over-complicated, but only because you're comfortable with the command line already. Your goal here is to allow your applications to be portable across systems and present a web-enabled, rationalized interface for your code to consumers.

Rather than have you write a description for "samtools sort" from scratch, let's systematically dissect an existing file provided with the SDK. Go ahead and copy the file into place and open it in your text editor of choice. If you don't have the SDK installed, you can :raw-html-m2r:`<a href="../examples/samtools-0.1.19/stampede/samtools-sort.json">grab it here</a>`.

.. code-block:: shell

   cd $WORK/iPlant/samtools-0.1.19/stampede/
   cp $IPLANT_SDK_HOME/examples/samtools-0.1.19/stampede/samtools-sort.json .

Open up samtools-sort.json in a text editor or :raw-html-m2r:`<a href="../examples/samtools-0.1.19/stampede/samtools-sort.json">in your web browser</a>` and follow along below.

Overview
^^^^^^^^

Your file :raw-html-m2r:`<em>samtools-sort.json</em>` is written in :raw-html-m2r:`<a href="http://www.json.org/">JSON</a>`\ , and conforms to a Tapis-specific data model. You can find fully fleshed out details about all fields under :raw-html-m2r:`<em>Parameters -> Data Type -> Model</em>` at the :raw-html-m2r:`<a href="http://agaveapi.co/live-docs/#!/apps/add_post_1">Tapis API live docs on the /apps service</a>`. We will dive into key elements here:

To make this file work for you, you will be, at a minimum, editting:


#. Its :raw-html-m2r:`<em>executionSystem</em>` to match your private instance of Stampede.
#. Its :raw-html-m2r:`<em>deploymentPath</em>` to match your iPlant applications path
#. The :raw-html-m2r:`<em>name</em>` of the app to something besides "samtools-sort". We recommend "$IPLANTUSERNAME-samtools-sort".

Instructions for making these changes will follow.

All Tapis application descriptions have the following structure:

.. code-block:: javascript

   {   "application_metadata":"value",
     "inputs":[],
     "parameters":[],
     "outputs":[]
   }

There is a defined list of application metadata fields, some of which are mandatory. Inputs, parameters, and outputs are specified as an array of simple data structures, which will be described below.

Application metadata
^^^^^^^^^^^^^^^^^^^^


.. raw:: html

   <table>
   <thead>
   <tr>
     <th>Field</th>
     <th>Mandatory</th>
     <th>Type</th>
     <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
     <td>checkpointable</td>
     <td>X</td>
     <td>boolean</td>
     <td>Application supports checkpointing</td>
   </tr>
   <tr>
     <td>defaultMemoryPerNode</td>
     <td></td>
     <td>integer</td>
     <td>Default RAM (GB) to request per compute node</td>
   </tr>
   <tr>
     <td>defaultProcessorsPerNode</td>
     <td></td>
     <td>integer</td>
     <td>Default processor count to request per compute node</td>
   </tr>
   <tr>
     <td>defaultMaxRunTime</td>
     <td></td>
     <td>integer</td>
     <td>Default maximum run time (hours:minutes:seconds) to request per compute node</td>
   </tr>
   <tr>
     <td>defaultNodeCount</td>
     <td></td>
     <td>integer</td>
     <td>Default number of compute nodes per job</td>
   </tr>
   <tr>
     <td>defaultQueue</td>
     <td></td>
     <td>string</td>
     <td>On HPC systems, default batch queue for jobs</td>
   </tr>
   <tr>
     <td>deploymentPath</td>
     <td>X</td>
     <td>string</td>
     <td>Path relative to homeDir on deploymentSystem where application bundle will reside</td>
   </tr>
   <tr>
     <td>deployementSystem</td>
     <td>X</td>
     <td>string</td>
     <td>The Tapis-registered STORAGE system upon which you have write permissions where the app bundle resides</td>
   </tr>
   <tr>
     <td>executionSystem</td>
     <td>X</td>
     <td>string</td>
     <td>a Tapis-registered EXECUTION system upon which you have execute and app registration permissions where jobs will run</td>
   </tr>
   <tr>
     <td>helpURI</td>
     <td>X</td>
     <td>string</td>
     <td>A URL pointing to help or description for the app you are deploying</td>
   </tr>
   <tr>
     <td>label</td>
     <td>X</td>
     <td>string</td>
     <td>Human-readable title for the app</td>
   </tr>
   <tr>
     <td>longDescription</td>
     <td></td>
     <td>string</td>
     <td>A short paragraph describing the functionality of the app</td>
   </tr>
   <tr>
     <td>modules</td>
     <td></td>
     <td>array[string]</td>
     <td>Ordered list of modules on systems that use lmod or modules</td>
   </tr>
   <tr>
     <td>name</td>
     <td>X</td>
     <td>string</td>
     <td>unique, URL-compatible (no special chars or spaces) name for the app</td>
   </tr>
   <tr>
     <td>ontology</td>
     <td>X</td>
     <td>array[string]</td>
     <td>List of ontology terms (or URIs pointing to ontology terms) associated with the app</td>
   </tr>
   <tr>
     <td>parallelism</td>
     <td>X</td>
     <td>string</td>
     <td>Is your application capable of using more than a single compute node? (SERIAL or PARALLEL)</td>
   </tr>
   <tr>
     <td>shortDescription</td>
     <td>X</td>
     <td>string</td>
     <td>Brief description of the app</td>
   </tr>
   <tr>
     <td>storageSystem</td>
     <td>X</td>
     <td>string</td>
     <td>The Tapis-registered STORAGE system upon which you have write permissions. Default source of and destination for data consumed and emitted by the app</td>
   </tr>
   <tr>
     <td>tags</td>
     <td></td>
     <td>array[string]</td>
     <td>List of human-readable tags for the app</td>
   </tr>
   <tr>
     <td>templatePath</td>
     <td>X</td>
     <td>string</td>
     <td>Path to the shell template file, relative to deploymentPath</td>
   </tr>
   <tr>
     <td>testPath</td>
     <td>X</td>
     <td>string</td>
     <td>Path to the shell test file, relative to deploymentPath</td>
   </tr>
   <tr>
     <td>version</td>
     <td>X</td>
     <td>string</td>
     <td>Preferred format: Major.minor.point integer values for app</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <aside class="alert">Note *: The combination of <em>name</em> and <em>version</em> must be unique the entire iPlant API namespace.</aside>


Inputs
^^^^^^

To tell Tapis what files to stage into place before job execution, you need to define the app's inputs in a JSON array. To implement the SAMtools sort app, you need to tell Tapis that a BAM file is needed to act as the subject of our sort:

.. code-block:: javascript

   {  
     "id":"inputBam",
     "value":{  
       "default":"",
       "order":0,
       "required":true,
       "validator":"",
       "visible":true
     },
     "semantics":{  
       "ontology":[  
         "http://sswapmeet.sswap.info/mime/application/X-bam"
       ],
       "minCardinality":1,
       "fileTypes":[  
         "raw-0"
       ]
     },
     "details":{  
       "description":"",
       "label":"The BAM file to sort",
       "argument":null,
       "showArgument":false
     }
   }

Here's a walkthrough of what these fields mean:


.. raw:: html

   <table>
   <thead>
   <tr>
     <th>Field</th>
     <th>Mandatory</th>
     <th>Type</th>
     <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
     <td>id</td>
     <td>X</td>
     <td>string</td>
     <td>This is the "name" of the file. You will use this in your wrapper script later whenever you need to refer to the BAM file being sorted</td>
   </tr>
   <tr>
     <td>value.default</td>
     <td></td>
     <td>string</td>
     <td>The path, relative to X, of the default value for the input</td>
   </tr>
   <tr>
     <td>value.order</td>
     <td></td>
     <td>integer</td>
     <td>Ignore for now</td>
   </tr>
   <tr>
     <td>value.required</td>
     <td>X</td>
     <td>boolean</td>
     <td>Is specification of this input mandatory to run a job?</td>
   </tr>
   <tr>
     <td>value.validator</td>
     <td></td>
     <td>string</td>
     <td><a href="https://www.cs.tut.fi/~jkorpela/perl/regexp.html">Perl-format regular expression</a> to restrict valid values</td>
   </tr>
   <tr>
     <td>value.visible</td>
     <td></td>
     <td>boolean</td>
     <td>When automatically generated a UI, should this field be visible to end users?</td>
   </tr>
   <tr>
     <td>semantics.ontology</td>
     <td></td>
     <td>array[string]</td>
     <td>List of ontology terms (or URIs pointing to ontology terms) applicable to the input format</td>
   </tr>
   <tr>
     <td>semantics.minCardinality</td>
     <td></td>
     <td>integer</td>
     <td>Minimum number of values accepted for this input</td>
   </tr>
   <tr>
     <td>semantics.maxCardinality</td>
     <td></td>
     <td>integer</td>
     <td>Maximum number of values accepted for this input</td>
   </tr>
   <tr>
     <td>semantics.fileTypes</td>
     <td>X</td>
     <td>array[string]</td>
     <td>List of Tapis file types accepted. Always use "raw-0" for the time being</td>
   </tr>
   <tr>
     <td>details.description</td>
     <td></td>
     <td>string</td>
     <td>Human-readable description of the input. Often implemented as contextual help in automatically generated UI</td>
   </tr>
   <tr>
     <td>details.label</td>
     <td></td>
     <td>string</td>
     <td>Human-readable label for the input. Often implemented as text label next to the field in automatically generated UI</td>
   </tr>
   <tr>
     <td>details.argument</td>
     <td></td>
     <td>string</td>
     <td>The command-line argument associated with specifying this input at run time</td>
   </tr>
   <tr>
     <td>details.showArgument</td>
     <td></td>
     <td>boolean</td>
     <td>Include the argument in the substitution done by Tapis when a run script is generated</td>
   </tr>
   </tbody>
   </table>


*A note on paths*\ : In this iPlant-oriented tutorial, we assume you will stage data to and from "data.agaveapi.co", the default storage system for iPlant users. In this case, you can use relative paths relative to homeDir on that system (i.e. vaughn/analyses/foobar). To add portability, marshal data from other storageSystems, or import from public servers, you can also specify fully qualified URIs as follows:


* storageSystem namespace: agave://storage-system-name/path/to/file
* public URI namespace: https://www.cnn.com/index.html

Parameters
^^^^^^^^^^

Parameters are specified in a JSON array, and are broadly similar to inputs. Here's an example of the parameter we will define allowing users to specify how much RAM to use in a "samtools sort" operation.

.. code-block:: javascript

   {  
     "id":"maxMemSort",
     "value":{  
       "default":"500000000",
       "order":1,
       "required":true,
       "type":"number",
       "validator":"",
       "visible":true
     },
     "semantics":{  
       "ontology":[  
         "xs:integer"
       ]
     },
     "details":{  
       "description":null,
       "label":"Maxiumum memory in bytes, used for sorting",
       "argument":"-m",
       "showArgument":false
     }
   }


.. raw:: html

   <table>
   <thead>
   <tr>
     <th>Field</th>
     <th>Mandatory</th>
     <th>Type</th>
     <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
     <td>id</td>
     <td>X</td>
     <td>string</td>
     <td>This is the "name" of the parameter. At runtime, it will be replaced in your script template based on the value passed as part of the job specification</td>
   </tr>
   <tr>
     <td>value.default</td>
     <td></td>
     <td>string</td>
     <td>If your app has a fixed-name output, specify it here</td>
   </tr>
   <tr>
     <td>value.order</td>
     <td></td>
     <td>integer</td>
     <td>Ignore for now. Supports automatic generation of command lines.</td>
   </tr>
   <tr>
     <td>value.required</td>
     <td></td>
     <td>boolean</td>
     <td>Is specification of this parameter mandatory to run a job?</td>
   </tr>
   <tr>
     <td>value.type</td>
     <td></td>
     <td>string</td>
     <td>JSON type for this parameter (used to generate and validate UI). Valid values: "string", "number", "enumeration", "bool", "flag"</td>
   </tr>
   <tr>
     <td>value.validator</td>
     <td></td>
     <td>string</td>
     <td><a href="https://www.cs.tut.fi/~jkorpela/perl/regexp.html">Perl-formatted regular expression</a> to restrict valid values</td>
   </tr>
   <tr>
     <td>value.visible</td>
     <td></td>
     <td>boolean</td>
     <td>When automatically generated a UI, should this field be visible to end users?</td>
   </tr>
   <tr>
     <td>semantics.ontology</td>
     <td></td>
     <td>array[string]</td>
     <td>List of ontology terms (or URIs pointing to ontology terms) applicable to the parameter. We recommend at least specifying an <a href="http://www.schemacentral.com/sc/xsd/s-datatypes.xsd.html">XSL Schema Simple Type</a>.</td>
   </tr>
   <tr>
     <td>details.description</td>
     <td></td>
     <td>string</td>
     <td>Human-readable description of the parameter. Often used to create contextual help in automatically generated UI</td>
   </tr>
   <tr>
     <td>details.label</td>
     <td></td>
     <td>string</td>
     <td>Human-readable label for the parameter. Often implemented as text label next to the field in automatically generated UI</td>
   </tr>
   <tr>
     <td>details.argument</td>
     <td></td>
     <td>string</td>
     <td>The command-line argument associated with specifying this parameter at run time</td>
   </tr>
   <tr>
     <td>details.showArgument</td>
     <td></td>
     <td>boolean</td>
     <td>Include the argument in the substitution done by Tapis when a run script is generated</td>
   </tr>
   </tbody>
   </table>


Outputs
^^^^^^^

While we don't support outputs 100% yet, Tapis apps are designed to participate in workflows. Thus, just as we define the list of valid and required inputs to an app, we also must (when we know them) define a list of its outputs. This allows it to "advertise" to consumers of Tapis services what it expects to emit, allowing apps to be chained together. Note that unlike inputs and parameters, output "id"s are NOT passed to the template file.  If you must specify an output filename in the application json, do it as a parameter!  Outputs are defined basically the same way as inputs:

.. code-block:: javascript

   {  
     "id":"bam",
     "value":{  
       "default":"sorted.bam",
       "order":0,
       "required":false,
       "validator":"",
       "visible":true
     },
     "semantics":{  
       "ontology":[  
         "http://sswapmeet.sswap.info/mime/application/X-bam"
       ],
       "minCardinality":1,
       "fileTypes":[  
         "raw-0"
       ]
     },
     "details":{  
       "description":"",
       "label":"Sorted BAM file",
       "argument":null,
       "showArgument":false
     }
   }

Obligatory field walk-through:


.. raw:: html

   <table>
   <thead>
   <tr>
     <th>Field</th>
     <th>Mandatory</th>
     <th>Type</th>
     <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
     <td>id</td>
     <td>X</td>
     <td>string</td>
     <td>This is the "name" of the output. It is not currently used by the wrapper script but may be in the future</td>
   </tr>
   <tr>
     <td>value.default</td>
     <td></td>
     <td>string</td>
     <td>If your app has a fixed-name output, specify it here</td>
   </tr>
   <tr>
     <td>value.order</td>
     <td></td>
     <td>integer</td>
     <td>Ignore for now</td>
   </tr>
   <tr>
     <td>value.required</td>
     <td>X</td>
     <td>boolean</td>
     <td>Is specification of this input mandatory to run a job?</td>
   </tr>
   <tr>
     <td>value.validator</td>
     <td></td>
     <td>string</td>
     <td><a href="https://www.cs.tut.fi/~jkorpela/perl/regexp.html">Perl-format regular expression</a> used to match output files</td>
   </tr>
   <tr>
     <td>value.visible</td>
     <td></td>
     <td>boolean</td>
     <td>When automatically generated a UI, should this field be visible to end users?</td>
   </tr>
   <tr>
     <td>semantics.ontology</td>
     <td></td>
     <td>array[string]</td>
     <td>List of ontology terms (or URIs pointing to ontology terms) applicable to the output format</td>
   </tr>
   <tr>
     <td>semantics.minCardinality</td>
     <td></td>
     <td>integer</td>
     <td>Minimum number of values expected for this output</td>
   </tr>
   <tr>
     <td>semantics.maxCardinality</td>
     <td></td>
     <td>integer</td>
     <td>Maximum number of values expected for this output</td>
   </tr>
   <tr>
     <td>semantics.fileTypes</td>
     <td>X</td>
     <td>array[string]</td>
     <td>List of Tapis file types that may apply to the output. Always use "raw-0" for the time being</td>
   </tr>
   <tr>
     <td>details.description</td>
     <td></td>
     <td>string</td>
     <td>Human-readable description of the output</td>
   </tr>
   <tr>
     <td>details.label</td>
     <td></td>
     <td>string</td>
     <td>Human-readable label for the output</td>
   </tr>
   <tr>
     <td>details.argument</td>
     <td></td>
     <td>string</td>
     <td>The command-line argument associated with specifying this output at run time (not currently used)</td>
   </tr>
   <tr>
     <td>details.showArgument</td>
     <td></td>
     <td>boolean</td>
     <td>Include the argument in the substitution done by Tapis when a run script is generated (not currently used)</td>
   </tr>
   </tbody>
   </table>


:raw-html-m2r:`<em>Note</em>`\ : If the app you are working on doesn't natively produce output with a predictable name, one thing you can do is add extra logic to your script to take the existing output and rename it to something you can control or predict.

Tools and Utilities
^^^^^^^^^^^^^^^^^^^


.. raw:: html

   <ol>
   <li>Stumped for ontology terms to apply to your Tapis app inputs, outputs, and parameters? SSWAPmeet has many URI-format terms for <a href="http://sswapmeet.sswap.info/mime/">MIME</a> types, and BioPortal can provide links to <a href="http://bioportal.bioontology.org/ontologies/EDAM">EDAM</a>.
   <li>Need to validate JSON files? Try <a href="http://jsonlint.com/">JSONlint</a> or <a href="http://json.parser.online.fr/">JSONparser</a>
   </ol>


Craft a shell script template
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
