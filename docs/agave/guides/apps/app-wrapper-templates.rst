.. role:: raw-html-m2r(raw)
   :format: html


Wrapper Templates
=================

In order to run your application, you will need to create a wrapper template that calls your executable code. The wrapper template is a simple script that Tapis (Agave) will filter and execute to start your app. The filtering Agave applies to your wrapper script is to inject runtime values from a job request into the script to replace the template variables representing the inputs and parameters of your app.

The order in which wrapper templates are processed in HPC and Condor apps is as follows.


#. ``environment`` variables injected.
#. ``startupScript`` run.
#. Scheduler directives prepended to the wrapper template.
#. ``additionalDirectives`` concatenated after the scheduler directives.
#. Custom ``modules`` concatenated after the additionalDirectives.
#. ``inputs`` and ``parameters`` template variables replaced with values from the job request.
#. Blacklist commands, if present, are disabled in the scripts.
#. Resulting script is written to the remote job execution folder and executed.

The order in which wrapper templates are processed in CLI apps is as follows.


#. Shell environment sourced
#. ``environment`` variables injected
#. ``startupScript`` run
#. Custom ``modules`` prepended to the top of the wrapper
#. ``inputs`` and ``parameters`` template variables replaced with values from the  job request
#. Blacklist commands, if present, are disabled in the scripts.
#. Resulting script is forked into the background immediately.

Environment
-----------

Comes from the system definition. Handle in your script if you cannot change the system definition to suit your needs. Ship whatever you need with your app's assets.

Modules
-------

See more about :raw-html-m2r:`<a href="http://modules.sourceforge.net/" title="The Environment Modules Project" target="_blank">Modules</a>` and :raw-html-m2r:`<a href="https://github.com/TACC/Lmod" title="Lmod: An Environment Module System based on Lua" target="_blank">Lmod</a>`. Can be used to customize your environment, locate your application, and improve portability between systems. Tapis (Agave) does not install or manage the module installation on a particular system, however it does know how to interact with it. Specifying the modules needed to run your app either in your wrapper template or in your system definition can greatly help you during the development process.

Default job macros
------------------

Tapis (Agave) provides information about the job, system, and user as predefined macros you can use in your wrapper templates. The full list of  runtime job macros are give in the following table.


.. raw:: html

   <table border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>AGAVE_JOB_APP_ID</td>
   <td>The appId for which the job was requested.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ARCHIVE</td>
   <td>Binary boolean value indicating whether the current job will be archived after the wrapper template exits.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ARCHIVE_SYSTEM</td>
   <td>The system to which the job will be archived after the wrapper template exits.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ARCHIVE_URL
   </td>
   <td>The fully qualified URL to the archive folder where the job output will be copied if archiving is enabled, or the URL of the output listing </td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ARCHIVE_PATH</td>
   <td>The path on the <span class="code">archiveSystem</span> where the job output will be copied if archiving is enabled.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_BATCH_QUEUE</td>
   <td>The batch queue on the <span class="code">AGAVE_JOB_EXECUTION_SYSTEM</span> to which the job was submitted.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_EXECUTION_SYSTEM</td>
   <td>The Tapis (Agave) execution system id where this job is running.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ID</td>
   <td>The unique identifier of the job.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_MEMORY_PER_NODE</td>
   <td>The amount of memory per node requested at submit time.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_NAME</td>
   <td>The slugified version of the name of the job. See the section on <a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/introduction/conventions.html?highlight=special%20characters">Special Characters</a> for more information about slugs.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_NAME_RAW</td>
   <td>The name of the job as given at submit time.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_NODE_COUNT</td>
   <td>The number of nodes requested at submit time.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_OWNER</td>
   <td>The username of the job owner.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_PROCESSORS_PER_NODE</td>
   <td>The number of cores requested at submit time.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_SUBMIT_TIME</td>
   <td>The time at which the job was submitted in ISO-8601 format.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_TENANT</td>
   <td>The id of the tenant to which the job was submitted.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ARCHIVE_URL</td>
   <td>The Tapis (Agave) url to which the job will be archived after the job completes.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_CALLBACK_RUNNING</td>
   <td>Represents a call back to the API stating the job has started.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_CALLBACK_CLEANING_UP</td>
   <td>Represents a call back to the API stating the job is cleaning up.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_CALLBACK_ALIVE</td>
   <td>Represents a call back to the API stating the job is still alive. This will essentially update the timestamp on the job and add an entry to the job's history record.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_CALLBACK_NOTIFICATION</td>
   <td>Represents a call back to the API telling it to forward a notification to the registered endpoint for that job. If no notification is registered, this will be ignored.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_CALLBACK_FAILURE</td>
   <td>Represents a call back to the API stating the job failed. Use this with caution as it will tell the API the job failed even if it has not yet completed. Upon receiving this callback, Tapis (Agave) will abandon the job and skip any archiving that may have been requested. Think of this as <span class="code">kill -9</span> for the job lifecycle.</td>
   </tr>
   </tbody>
   </table>
|

Input data
----------

Tapis (Agave) will stage the files and folders you specify as inputs to your app. These will be available in the top level of your job directory at runtime. Additionally, the names of each of the inputs will be injected into your wrapper template for you to use in your application logic. Please be aware that Agave will not attempt to resolve namespace conflicts between your app inputs. That means that if a job specifies two inputs with the same name, one will overwrite the other during the input staging phase of the job and, though the variable names will be correctly injected to the wrapper script, your job will most likely fail due to missing data.

See the table below for fields that must be defined for an app's inputs:


.. raw:: html

   <table border="1px" cellpadding="5">
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
   <td>List of Tapis (Agave) file types accepted. Always use "raw-0" for the time being</td>
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
   <td>Include the argument in the substitution done by Tapis (Agave) when a run script is generated</td>
   </tr>
   </tbody>
   </table>
|

Variable injection
------------------

If you refer back to the app definition we used in the App Management Tutorial, you will see there are multiple inputs and parameters defined for that app. Each input and parameter object had an ``id`` attribute. That ``id`` value is the attribute name you use to associate runtime values with app inputs and parameters. When a job is submitted to Tapis (Agave), prior to physically running the wrapper template, all instances of that ``id`` are replaced with the actual value from the job request. The example below shows our app description, a job request, and the resulting wrapper template at run time.

Type declarations
-----------------

During the jobs submission process, Tapis (Agave) will store your inputs and parameters as serialized JSON. At the point that variable injection occurs, Agave will replace all occurrences of your input and parameter with their value provided in the job request. In order for Agave to properly identify your input and parameter ids, wrap them in brackets and prepend a dollar sign. For example, if you have a parameter with id ``param1``\ , you would include it in your wrapper script as ``${param1}``. Case sensitivity is honored at all times.

Boolean values
--------------

Boolean values are passed in as truthy values. true = 1, false is empty.

Cardinality
-----------

Cardinality is not used in resolving wrapper template variables.

Parameter Flags
---------------

If your parameter was of type "flag", Tapis (Agave) will replace all occurences of the template variable with the value you provided for the ``argument`` field.

App packaging
-------------

Tapis (Agave) API apps have a generalized structure that allows them to carry dependencies around with them. In the case below, ``package-name-version.dot.dot</em>`` is a folder that you build on your local system, then store in your Agave Cloud Storage in a designated location (we recommend ``/home/username/applications/app_folder_name``\ ). It contains binaries, support scripts, test data, etc. all in one package. Agave basically uses a very rough form of containerized applications (more on this later). We suggest you set your apps up to look something like the following:

.. code-block::

   package-name-version.dot.dot
   |--system_name
   |----bin.tgz (optional)
   |----lib.tgz (optional)
   |----include.tgz (optional)
   |----test.sh
   |----script.template
   |----test_data (optional)
   |----app.json

Tapis (Agave) runs a job by first transferring a copy of this directory into temporary directory on the target ``executionSystem``. Then, the input data files (we'll show you how to specify those are later) are staged into place automatically. Next, Agave writes a scheduler submit script (using a template you provide i.e. script.template) and puts it in the queue on the target system. The Agave service then monitors progress of the job and, assuming it completes, copies all newly-created files to the location specified when the job was submitted. Along the way, critical milestones and metadata are recorded in the job's history.

:raw-html-m2r:`<em>Tapis (Agave) app development proceeds via the following steps:</em>`


#. Build the application locally on the ``executionSystem``
#. Ensure that you are able to run it directly on the ``executionSystem``
#. Describe the application using an Tapis (Agave) app description
#. Create a shell template for running the app
#. Upload the application directory to a ``storageSystem``
#. Post the app description to the Tapis (Agave) apps service
#. Debug your app by running jobs and updating the app until it works as intended
#. (Optional) Share the app with some friends to let them test it

Application metadata
--------------------


.. raw:: html

   <table border="1px" cellpadding="5">
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
     <td>The Tapis (Agave)-registered STORAGE system upon which you have write permissions where the app bundle resides</td>
   </tr>
   <tr>
     <td>executionSystem</td>
     <td>X</td>
     <td>string</td>
     <td>An Tapis (Agave)-registered EXECUTION system upon which you have execute and app registration permissions where jobs will run</td>
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
     <td>The Tapis (Agave)-registered STORAGE system upon which you have write permissions. Default source of and destination for data consumed and emitted by the app</td>
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
|

..

   :warning: The combination of :raw-html-m2r:`<em>name</em>` and :raw-html-m2r:`<em>version</em>` must be unique the entire iPlant API namespace.


Parameter metadata
------------------


.. raw:: html

   <table border="1px" cellpadding="5">
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
     <td>Include the argument in the substitution done by Tapis (Agave) when a run script is generated</td>
   </tr>
   </tbody>
   </table>
|

Output metadata
---------------


.. raw:: html

   <table border="1px" cellpadding="5">
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
     <td>List of Tapis (Agave) file types that may apply to the output. Always use "raw-0" for the time being</td>
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
     <td>Include the argument in the substitution done by Tapis (Agave) when a run script is generated (not currently used)</td>
   </tr>
   </tbody>
   </table>
|

..

   :information_source: Note: If the app you are working on doesn't natively produce output with a predictable name, one thing you can do is add extra logic to your script to take the existing output and rename it to something you can control or predict.


Tools and Utilities
-------------------


#. Stumped for ontology terms to apply to your Tapis (Agave) app inputs, outputs, and parameters? You can search EMBL-EBI for :raw-html-m2r:`<a href="https://www.ebi.ac.uk/ols/index">ontology terms</a>`\ , and BioPortal can provide links to :raw-html-m2r:`<a href="http://bioportal.bioontology.org/ontologies/EDAM">EDAM</a>`.
#. Need to validate JSON files? Try :raw-html-m2r:`<a href="http://jsonlint.com/">JSONlint</a>` or :raw-html-m2r:`<a href="http://json.parser.online.fr/">JSONparser</a>`
