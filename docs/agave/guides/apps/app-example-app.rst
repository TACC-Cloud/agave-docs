.. role:: raw-html-m2r(raw)
   :format: html


Build a samtools application bundle
-----------------------------------

.. code-block:: shell

   # Log into Stampede
   ssh stampede2.tacc.utexas.edu

   # Unload system's samtools module if it happens to be loaded by default
   module unload samtools

   # All TACC systems have a directory than can be accessed as $WORK
   cd $WORK

   # Set up a project directory
   mkdir iPlant
   mkdir iPlant/src
   mkdir -p iPlant/samtools-0.1.19/stampede2/bin
   mkdir -p iPlant/samtools-0.1.19/stampede2/test

   # Build samtools using the Intel C Compiler
   # If you don't have icc, gcc will work but icc usually gives more efficient binaries
   cd iPlant/src
   wget "http://downloads.sourceforge.net/project/samtools/samtools/0.1.19/samtools-0.1.19.tar.bz2"
   tar -jxvf samtools-0.1.19.tar.bz2
   cd samtools-0.1.19
   make CC=icc CFLAGS='-xCORE-AVX2 -axCORE-AVX512,MIC-AVX512 -O3'

   # Copy the samtools binary and support scripts to the project bin directory
   cp -R samtools bcftools misc ../../samtools-0.1.19/stampede2/bin/
   cd ../../samtools-0.1.19/stampede2

   # Test that samtools will launch
   bin/samtools

     Program: samtools (Tools for alignments in the SAM format)
     Version: 0.1.19-44428cd

     Usage:   samtools <command> [options]

     Command: view        SAM <-> BAM conversion
              sort        sort alignment file
              mpileup     multi-way pileup...

   # Package up the bin directory as an compressed archive
   # and remove the original. This preserves the execute bit
   # and other permissions and consolidates movement of all
   # bundled dependencies in bin to a single operation. You
   # can adopt a similar approach with lib and include.
   tar -czf bin.tgz bin && rm -rf bin

Run samtools sort locally
-------------------------

Your first objective is to create a script that you know will run to completion under the Stampede scheduler and environment (or whatever executionSystem you're working on). It will serve as a model for the template file you create later. In our case, we need to write a script that can be submitted to the Slurm scheduler. The standard is to use Bash for such scripts. You have five main objectives in your script:


* Unpack binaries from bin.tgz
* Extend your PATH to contain bin
* Craft some option-handling logic to accept parameters from Tapis (Agave)
* Craft a command line invocation of the application you will run
* Clean up when you're done

First, you will need some test data in your current directory (i.e., $WORK/iPlant/samtools-0.1.19/stampede2/ ). You can use this test file

.. code-block:: shell

   files-get -S data.iplantcollaborative.org /shared/iplantcollaborative/example_data/Samtools_mpileup/ex1.bam

or you can any other BAM file for your testing purposes. Make sure if you use another file to change the filename in your test script accordingly!

Now, author your script. You can paste the following code into a file called :raw-html-m2r:`<em>test-sort.sh</em>` or you can copy it from `here <test-sort.sh>`_.

.. code-block:: shell

   #!/bin/bash

   # Tapis (Agave) automatically writes these scheduler
   # directives when you submit a job but we have to
   # do it by hand when writing our test

   #SBATCH -p development
   #SBATCH -t 00:30:00
   #SBATCH -n 16
   #SBATCH -A iPlant-Collabs
   #SBATCH -J test-samtools
   #SBATCH -o test-samtools.o%j

   # Set up inputs and parameters
   # We're emulating passing these in from Tapis (Agave)
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
   # you don't need this bit
   tar -xvf bin.tgz
   # Extend PATH to include binaries in bin
   # If you need to extend lib, include, etc
   # the same approach is applicable
   export PATH=$PATH:"$PWD/bin"

   # Dynamically construct a command line
   # by building an ARGS string then
   # adding the command, file specifications, etc
   #
   # We're doing this in a way familar to Tapis (Agave) V1 users
   # first. Later, we'll illustrate how to make use of
   # Tapis (Agave) V2's new parameter passing functions
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
------------------------------------------

.. code-block:: shell

   chmod 700 test-sort.sh
   sbatch test-sort.sh

You can monitor your jobs in the queue using

.. code-block:: shell

   showq -u your_tacc_username

Assuming all goes according to plan, you'll end up with a sorted BAM called :raw-html-m2r:`<em>sorted.bam</em>`\ , and your bin directory (but not the bin.tgz file) should be erased. Congratulations, you're in the home stretch: it's time to turn the test script into an Tapis (Agave) app.

Craft an Tapis (Agave) app description
------------------------------

In order for Tapis (Agave) to know how to run an instance of the application, we need to provide quite a bit of metadata about the application. This includes a unique name and version, the location of the application bundle, the identities of the execution system and destination system for results, whether its an HPC or other kind of job, the default number of processors and memory it needs to run, and of course, all the inputs and parameters for the actual program. It seems a bit over-complicated, but only because you're comfortable with the command line already. Your goal here is to allow your applications to be portable across systems and present a web-enabled, rationalized interface for your code to consumers.

Rather than have you write a description for "samtools sort" from scratch, let's systematically dissect an existing file provided with the SDK. Go ahead and copy the file into place and open it in your text editor of choice. If you don't have the SDK installed, you can `download the JSON descriptions :raw-html-m2r:`<a href="https://github.com/TACC-Cloud/agave-docs/blob/doc_changes/docs/agave/guides/apps/samtools-sort.json" title="samtools-sort.json">here</a>`_.

.. code-block:: shell

   cd $WORK/iPlant/samtools-0.1.19/stampede2/
   wget 'https://tacc.github.io/developer.tacc.cloud/docs/guides/apps/samtools-sort.json'

Open up samtools-sort.json in a text editor or in your web browser and follow along below.

Overview
--------

Your file *samtools-sort.json* is written in `JSON <http://www.json.org/>`_\ , and conforms to an Tapis (Agave)-specific data model. We will dive into key elements here:

To make this file work for you, you will be, at a minimum, editing:


#. Its ``executionSystem`` to match your private instance of Stampede.
#. Its ``deploymentPath`` to match your iPlant applications path
#. The ``name`` of the app to something besides "samtools-sort". We recommend "$your_cyverse_username-samtools-sort".

Instructions for making these changes will follow.

All Tapis (Agave) application descriptions have the following structure:

.. code-block:: json

   {   "application_metadata":"value",
     "inputs":[],
     "parameters":[],
     "outputs":[]
   }

There is a defined list of application metadata fields, some of which are mandatory. Inputs, parameters, and outputs are specified as an array of simple data structures, which are described earlier in the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/apps/app-inputs-and-parameters-tutorial.html" title="Params and Inputs">Application metadata section</a>`.

Inputs
------

To tell Tapis (Agave) what files to stage into place before job execution, you need to define the app's inputs in a JSON array. To implement the SAMtools sort app, you need to tell Agave that a BAM file is needed to act as the subject of our sort:

.. code-block:: json

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

For information on what these fields mean, see the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/apps/app-inputs-and-parameters-tutorial.html" title="Params and Inputs">input metadata table</a>`.


..

   :information_source: A note on paths: In this CyVerse-oriented tutorial, we assume you will stage data to and from "data.iplantcollaborative.org", the default storage system for CyVerse users. In this case, you can use relative paths relative to homeDir on that system (i.e. vaughn/analyses/foobar). To add portability, marshal data from other storageSystems, or import from public servers, you can also specify fully qualified URIs as follows:


   * storageSystem namespace: agave://storage-system-name/path/to/file
   * public URI namespace: https://www.cnn.com/index.html


Parameters
----------

Parameters are specified in a JSON array, and are broadly similar to inputs. Here's an example of the parameter we will define allowing users to specify how much RAM to use in a "samtools sort" operation.

.. code-block:: json

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

For information on what these fields mean, see the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/apps/app-inputs-and-parameters-tutorial.html" title="Params and Inputs">parameters metadata table</a>`.

Outputs
-------

While we don't support outputs 100% yet, Tapis (Agave) apps are designed to participate in workflows. Thus, just as we define the list of valid and required inputs to an app, we also must (when we know them) define a list of its outputs. This allows it to "advertise" to consumers of Agave services what it expects to emit, allowing apps to be chained together. Note that unlike inputs and parameters, output "id"s are NOT passed to the template file.  If you must specify an output filename in the application json, do it as a parameter!  Outputs are defined basically the same way as inputs:

.. code-block:: json

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

For more info on these fields, see `Output metadata table <app-wrapper-templates>`_.

Craft a shell script template
-----------------------------

Create sort.template using your test-sort.sh script as the starting point.

.. code-block:: shell

   cp test-sort.sh sort.template

Now, open sort.template in the text editor of your choice. Delete the bash shebang line and the SLURM pragmas. Replace the hard-coded values for inputs and parameters with variables defined by your app description.

.. code-block:: shell

   # Set up inputs...
   # Since we don't check these when constructing the
   # command line later, these will be marked as required
   inputBam=${inputBam}
   # and parameters
   outputPrefix=${outputPrefix}
   # Maximum memory for sort, in bytes
   # Be careful, Neither Tapis (Agave) nor scheduler will
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
