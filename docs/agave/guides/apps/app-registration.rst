.. role:: raw-html-m2r(raw)
   :format: html


Registering an app
^^^^^^^^^^^^^^^^^^

Registering an app with the Apps service is conceptually simple. Just describe your app as a JSON document and POST it to the Apps service. Historically, this has actually been the hardest part for new users to figure out. To ease the process, we have added an app creation wizard into :raw-html-m2r:`<a href="http://togo.agaveapi.co/" title="Tapis ToGo">Tapis ToGo</a>`. Using that wizard you can define your app using a form-driven user interface, edit the JSON raw app definition, or swap back and forth in realtime. Once created, you can submit your app in ToGo, or manually POST the JSON directly to the Apps service. If you are new to app registration, this is a great place to start because it shrinks the learning curve involved in defining your app.

The second tool is the :raw-html-m2r:`<a href="https://bitbucket.org/agaveapi/science-api-samples" title="Tapis Samples" target="_blank">Tapis Samples</a>` project. The Tapis Samples project is a set of sample data used throughout these tutorials. The project contains several app definitions ranging in complexity from a trivial no-parameter, no-argument hello world, to a complex multi-input application with multiple parameter types. The Tapis Samples project is a great place to start when building your app by hand because it draws on the experiences of many successful application publishers. You can check out the Tapis Samples project from Bitbucket by cloning the Git repository:

..

   git clone https://bitbucket.org/agaveapi/science-api-samples.git agave-samples


Choosing an execution system
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The first step in registering your app is knowing where you want Tapis to run it. Any execution system on which you have PUBLISH permissions is a valid execution target, however, it is important to keep in mind the ``executionType`` and ``scheduler`` of the target system. If you need fast turnaround times, submitting to an execution system that uses a batch scheduler may not be the ideal target for your application as your jobs may have to wait their turn in a queue for quite a while before they run. Alternatively, if your app is a parallel code, you probably *need* a batch scheduler to allocate the nodes you successfully run.

Choosing a deployment system
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once you know where you want your application to run, you need to specify where your app's assets are stored. In terms of the JSON description of your app, this is the system on which the deploymentPath resides. In terms of the Boilerplate project, this is the system where your project folder resides. The deployment system can be the same as the execution system, or it can be a completely different system. The choice is entirely up to you. Wherever you choose to store your apps's assets, it is your responsibility to place them there prior to registration because the Apps service will verify that they exist and that you have permission to access them prior when validating your app description.

Several other things to consider when picking execution and deployment systems are:

.. code-block::

   * **Throughput:** if the app is stored remotely, it will have to be staged into the execution system prior to your job running. This can impact throughput and it can also potentially eat up disc space depending on your execution system configuration and policies.
   * **Bandwidth:** if your execution systems are in the cloud, large applications can eat up a significant amount of bandwidth moving to your execution systems. This can result in unnecessary bandwidth charges.
   * **Reusability:** if you have an application that can run on multiple systems, storing it remotely can be advantageous. If a single execution system goes down, you are still able to run your app on other systems.
   * **Reliability:** if you store your app on a system you don't own or on which you don't have long-term access, you may lose access to your app and its assets if your account is removed, the system is decommissioned, or the system is deleted from Tapis.


In this tutorial, we will store our application assets on our private storage system, ``demo.storage.example.com`` and run it on our private execution system, ``condor.opensciencegrid.org``.

Packaging your app
~~~~~~~~~~~~~~~~~~

Now that you know where your app will live and where it will execute, its time to organize it in a way that Tapis can properly invoke it. At the very least, your application folder should have the following in it:


* An execution script that creates and executes an instance of the application. We refer to this as the :raw-html-m2r:`<em>wrapper template</em>` throughout the documentation. For the sake of maintainability, it should be named something simple and intuitive like ``wrapper.sh``. More on this in the next section.
* A library subdirectory: This contains all scripts, non-standard dependencies, binaries needed to execute an instance of the application.
* A test directory containing a script named something simple and intuitive like ``test.sh``\ , along with any sample data needed to evaluating whether the application can be executed in a current command-line environment. It should exit with a status of 0 on success when executed on the command line. A simple way to create your test script is to create a script that sets some sensible default values for your app's inputs and parameters and then call your wrapper template.

The resulting minimal app bundle would look something like the following:

.. code-block:: json

   pyplot-0.1.0
   |- app.json
   |+ lib
    |- main.py
   |+ test
    |- test.sh
   |- wrapper.sh

For other examples of more complicated app bundles, consult the :raw-html-m2r:`<a title="Tapis Samples project" href="https://bitbucket.org/agaveapi/science-api-samples">Tapis Samples</a>` repository.

Creating a wrapper template
~~~~~~~~~~~~~~~~~~~~~~~~~~~

When you submit a job request to run your app, Tapis will execute the file you define in the ``templatePath`` parameter of your app description. This file serves as a template script that contains all the information needed to execute your app. Any inputs or parameters you define in the app description will be injected into the template file at run time using a simple string replacement where ``${input_or_parameter_key}`` will be replaced by the value of the variable.

Consider the following example template script of for an app that takes .csv files as input and produces graph outputs.

.. code-block:: json

   WRAPPERDIR=$( cd "$( dirname "$0" )" && pwd )

   ## Set the x and y labels. Since we need to quote the values, we check for existence first
   ## rather than prefixing with an argument defined and passed in from the app description.
   if [[ -n "${xlabel}" ]]; then
       X_LABEL="--x-label=${xlabel}"
   else
       X_LABEL="--x-label="
   fi

   if [[ -n "${ylabel}" ]]; then
       Y_LABEL="--y-label=${ylabel}"
   else
       Y_LABEL="--y-label="
   fi

   ## The application bundle is already here. We check to see if we need to unpack
   ## it using the boolean parameter `unpackInputs` passed in.
   if [ -n "${unpackInputs}" ]; then

       # multiple datasets could be passed in, unpack each one as needed
       for i in ${dataset}; do

           dataset_extension="${i##*.}"

           if [ "$dataset_extension" == 'zip' ]; then
               unzip "$i"
           elif [ "$dataset_extension" == 'tar' ]; then
               tar xf "$i"
           elif [ "$dataset_extension" == 'gz' ] || [ "$dataset_extension" == 'tgz' ]; then
               tar xzf "$i"
           elif [ "$dataset_extension" == 'bz2' ]; then
               bunzip "$i"
           elif [ "$dataset_extension" == 'rar' ]; then
               unrar "$i"
           else
               echo "Unable to unpack dataset due to unrecognized file extension, ${dataset_extension}. Terminating job ${AGAVE_JOB_ID}" >&2
               ${AGAVE_JOB_CALLBACK_FAILURE}
               exit
           fi

       done

   fi

   ## Run the script with the runtime values passed in from the job request

   ## iterate over every input file/folder given
   for i in `find $WRAPPERDIR -name "*.csv"`; do

       # iterate over every chart type supplied
       for j in ${chartType}; do

           inputfile=$(basename $i)
           outdir="$WRAPPERDIR/output/${inputfile%.*}"
           mkdir -p "$outdir"

           python $WRAPPERDIR/lib/main.py ${showYLabel} "${Y_LABEL}" ${showXLabel} "${X_LABEL}" ${showLegend} ${height} ${width} ${background} ${format} ${separateCharts} -v --output-location=$outdir --chart-type=$j $i

           # send a callback notification for subscribers to receive alerts after every chart is generated
           ${AGAVE_JOB_CALLBACK_NOTIFICATION}

       done
   done

..

   The corresponding app description is given below


.. code-block:: json

   {
     "id":"wc-1.00",
     "available":true,
     "name":"wc",
     "parallelism":"SERIAL",
     "version":"1.00",
     "helpURI":"http://www.gnu.org/s/coreutils/manual/html_node/wc-invocation.html",
     "label":"wc condor",
     "shortDescription":"Count words in a file",
     "longDescription":"",
     "author":"Steve Terry",
     "datePublished":"",
     "publiclyAvailable":"false",
     "tags":[
       "textutils",
       "gnu"
     ],
     "ontology":[
       "http://sswapmeet.sswap.info/algorithms/wc"
     ],
     "executionSystem":"condor.opensciencegrid.org",
     "executionType":"CONDOR",
     "defaultQueue":"default",
     "defaultNodes":1,
     "defaultProcessorsPerNode":1,
     "defaultMemoryPerNode":"2GB",
     "defaultMaxRunTime":"01:00:00",
     "deploymentSystem":"demo.storage.example.com",
     "deploymentPath":"/api_sample_user/applications/private/wc-1.00",
     "templatePath":"/wrapper.sh",
     "testPath":"library/test.sh",
     "checkpointable":"true",
     "modules":[
       "purge",
       "load TACC"
     ],
     "parameters":[
       {
         "id":"printLongestLine",
         "value":{
           "default":false,
           "type":"string",
           "validator":"",
           "order":0,
           "visible":true,
           "required":true,
           "enquote":false
         },
         "details":{
           "label":"Print the length of the longest line",
           "description":"Command option -L",
           "repeatArgument":false,
           "showArgument":false
         },
         "semantics":{
           "minCardinality":1,
           "maxCardinality":1,
           "ontology":[
             "xs:boolean"
           ]
         }
       }
     ],
     "inputs":[
       {
         "id":"query1",
         "value":{
           "default":"read1.fq",
           "validator":"",
           "required":false,
           "order":0,
           "visible":true,
           "enquote":false
         },
         "details":{
           "label":"File to count words in: ",
           "description":"",
           "repeatArgument":false,
           "showArgument":false
         },
         "semantics":{
           "ontology":[
             "http://sswapmeet.sswap.info/util/TextDocument"
           ],
           "minCardinality":1,
           "maxCardinality":1,
           "fileTypes":[
             "text-0"
           ]
         }
       }
     ],
     "outputs":[]
   }


.. raw:: html

   <aside class="notice">Pro Tip: During job execution, Tapis will create a .agave.archive file in your job's work directory. The files and folders listed in this file will be excluded when archiving the output. If you have data such as intermediate files or cache directories that you do not want to be archived, concatenate those paths to the end of this file in your template script.</aside>


In addition to the inputs and parameters you define when registering your app, the keyword variables shown in the following table are available to optionally include job-specific information in your script and embed callbacks to communicate with Tapis.

<%= partial "includes/tables/64" %>

Describing your app
~~~~~~~~~~~~~~~~~~~


.. raw:: html

   <aside class="notice">App description authoring has historically been challenging for new users. To help you with the process, we created the <a title="Tapis ToGo App Wizard" href="https://togo.agaveapi.co/app/#/apps/new/">Tapis ToGo App Wizard</a> which gives you a dynamic form you can fill out to create a JSON description can publish to the API.</aside>


Now that you have your app bundled up and ready to go, it is time to register it with the Apps service. App registration is done by POSTing a JSON description of your app to the service. This section describes the structure of an app description and walks you through authoring an app description for the pyplot app used in the rest of the tutorials.

<%= partial "includes/tables/75" %>


.. raw:: html

   <p class="table-caption">Table 1. Attributes of a JSON app description.</p>


Table 1 lists the top level attributes of a Tapis app descxription. App descriptions are conceptually broken into three section: details, arguments, and outputs. App details  include generic information common to all apps such as the name, description, label, etc. Note that the name and version are combined and used to uniquely identify your app globally. One implication of this is that there is no concept of enforced application taxonomy in the API. Historically users have used a naming convention to imply a logical grouping and the version field with a :raw-html-m2r:`<a href="http://semver.org/" title="Semantic Versioning" target="_blank">Semantic Versioning</a>` value of x.y.z to denote changes over time.


.. raw:: html

   <aside class="notice">Note that the name and version are combined and used to uniquely identify your app globally. </aside>


App environment and assets
^^^^^^^^^^^^^^^^^^^^^^^^^^

App inputs and parameters
^^^^^^^^^^^^^^^^^^^^^^^^^

In addition to basic info describing the purpose and identity of the app, we need to describe how to interact with the software the app represents. App inputs and parameters define the data and command-line arguments (flags, arguments, etc.) needed by your wrapper script in order to properly run your application code. The word choice here is intentional. In the section on :raw-html-m2r:`<a name="creating-a-wrapper-template">Creating a wrapper template</a>` we saw that Tapis will inject the runtime values of the inputs and parameters given in a job request to the wrapper template. The wrapper template is just a shell script that you provide to invoke your app on the target ``exectionSystem``. You can define whatever ``inputs`` and ``parameters`` you need to provide the information your wrapper template needs to deliver the behavior you need. Thus, there does :raw-html-m2r:`<strong>not</strong>` necessarily need to be a relationship between the naming, number, or existence of app inputs and parameters and the arguments needed to run your application code.

In the following sections we cover each argument type in detail.

App inputs
~~~~~~~~~~

App inputs describe data inputs supported by your app. Each input can represent one or more files or folders. Inptus can be optional or required and may physically reside anywhere accessible using any of the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/data-management-tutorial/" title="Data Management Tutorial">data protocols</a>` supported by Tapis. Table 2 lists the attributes of a JSON app input description.

<%= partial "includes/tables/66" %>


.. raw:: html

   <p class="table-caption">Table 2. Attributes of a JSON app input description.</p>


Inputs have an id attribute and three distinct sections: details, semantics, and values. The input id must be unique among all inputs, output, and parameters for this app. The details section contains descriptions and labels used to describe the input field in forms and help other users understand the purpose of the input with respect to the application's usage. These are optional.

The semantics section contains fields to specify the number of minimum number of files this field must contain, the ontological term for this input, and a known file type that this input should be interpreted as. The file type is an optional value, but can be useful when applying file transformations on your data after a job completes.

The value section contains fields to specify the default value for this input, whether it is required, whether it is visible, and a regular expression to validate the file name. The default value is optional unless the field is marked as hidden.


.. raw:: html

   <aside class="notice">For a deeper dive into app inputs, please see the <a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/app-inputs-and-parameters-tutorial/" title="App Inputs and Parameters Tutorial">App Inputs and Parameters Tutorial</a></aside>


App parameters :raw-html-m2r:`<a name="app-parameters">&nbsp;</a>`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

App parameters define the command-line arguments (flags, arguments, etc.) needed by your wrapper script in order to properly run your application code. Table 3 shows the attributes of a JSON app parameter description.

<%= partial "includes/tables/67" %>


.. raw:: html

   <p class="table-caption">Table 3. Attributes of a JSON app parameter description.</p>


Like inputs, parameters have an id attribute and three distinct sections: details, semantics, and values. The parameter id must be unique among all inputs, output, and parameters for this app. The details section contains descriptions and labels used to describe the parameter field in forms and help other users understand the purpose of the parameter with respect to the application's usage. These are optional.

The semantics section contains a single optional field to specify the ontological term for this parameter.

The value section contains fields to specify the default value for this parameter, the type of the variable, whether it is required, whether it is visible, and a regular expression to validate the parameter. The parameter type can be one of number, string, boolean, or enumeration. Enumeration parameters can specify an enum_values array that contains all the possible enumerated values for that parameter. The default value is optional unless the field is marked as hidden. When specifying a validation regex, all default, and enumerated values must validate against the regex.


.. raw:: html

   <aside class="notice">For a deeper dive into app inputs, please see the <a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/app-inputs-and-parameters-tutorial/" title="App Inputs and Parameters Tutorial">App Inputs and Parameters Tutorial</a></aside>


App outputs :raw-html-m2r:`<a name="app-outputs">&nbsp;</a>`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In addition to describing the inputs and parameters that your wrapper script requires, it is often helpful to provide the expected outputs when running your app. This is the purpose of the ``outputs`` attribute. App ``outputs`` specify an array of JSON objects describing the data that should be present when your app completes. It is entirely optional and provided, at this point in time, for reference purpose only.

The structure of a JSON app output description is identical to a JSON app input description as shown in Table 4.

<%= partial "includes/tables/76" %>


.. raw:: html

   <p class="table-caption">Table 4. Attributes of a JSON app output description.</p>



.. raw:: html

   <aside class="notice">App outputs are not operationally used in the API, but are there as a placeholder for functionality coming in a future release.</aside>


Submitting an app description
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "fileToUpload=@app.json" https://public.tenants.agaveapi.co/apps/v2/?pretty=true

.. code-block:: plaintext

   tapis apps create -v app.json

.. code-block:: json

   {
     "status" : "success",
     "message" : null,
     "version" : "2.1.0-rc424a",
     "result" : {
       "id" : "demo-pyplot-demo-advanced-0.1.0",
       "name" : "demo-pyplot-demo-advanced",
       "icon" : null,
       "uuid" : "0001414144637043-5056a550b8-0001-005",
       "parallelism" : "SERIAL",
       "defaultProcessorsPerNode" : 1,
       "defaultMemoryPerNode" : 1,
       "defaultNodeCount" : 1,
       "defaultMaxRunTime" : null,
       "defaultQueue" : "debug",
       "version" : "0.1.0",
       "revision" : 1,
       "isPublic" : true,
       "helpURI" : null,
       "label" : "PyPlot Demo Advanced",
       "shortDescription" : "Advanced demo plotting app",
       "longDescription" : "Advanced demo app to create a graph using Python",
       "tags" : [ "python", "demo", "plotting", "tutorial" ],
       "ontology" : [ "" ],
       "executionType" : "CLI",
       "executionSystem" : "demo.execute.example.com",
       "deploymentPath" : "/api/v2/apps/demo-pyplot-demo-advanced-0.1.0u1.zip",
       "deploymentSystem" : "demo.storage.example.com",
       "templatePath" : "wrapper.sh",
       "testPath" : "test/test.sh",
       "checkpointable" : false,
       "lastModified" : "2014-10-24T04:57:17.000-05:00",
       "modules" : [ ],
       "available" : true,
       "inputs" : [ {
         "id" : "dataset",
         "value" : {
           "validator" : "([^s]+(.(?i)(zip|gz|tgz|tar.gz|bz2|rar|csv))$)",
           "visible" : true,
           "required" : true,
           "order" : 0,
           "enquote" : false,
           "default" : [ "agave://demo.storage.example.com/api_sample_user/inputs/pyplot/testdata.csv" ]
         },
         "details" : {
           "label" : "Dataset",
           "description" : "The dataset to plot",
           "argument" : null,
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 1,
           "maxCardinality" : -1,
           "ontology" : [ "http://sswapmeet.sswap.info/mime/text/Csv", "http://sswapmeet.sswap.info/mime/text/Zip", "http://sswapmeet.sswap.info/mime/text/Tar", "http://sswapmeet.sswap.info/mime/text/Bzip", "http://sswapmeet.sswap.info/mime/text/Rar" ],
           "fileTypes" : [ "csv-0", "zip-0", "tar-0", "tgz-0", "bz-2", "rar-0" ]
         }
       } ],
       "parameters" : [ {
         "id" : "showYLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show y-axis label?",
           "description" : "Select whether a label will be shown on the y axis",
           "argument" : "--show-y-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "unpackInputs",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : null
         },
         "details" : {
           "label" : "Unpack input(s)",
           "description" : "If true, any compressed input files will be expanded prior to execution on the remote system.",
           "argument" : "1",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "showLegend",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--show-legend",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "width",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 1024,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart width",
           "description" : "The width in pixels of each chart",
           "argument" : "--width=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "chartType",
         "value" : {
           "visible" : true,
           "required" : true,
           "type" : "enumeration",
           "order" : 0,
           "enquote" : false,
           "default" : "line",
           "enum_values" : [ {
             "bar" : "Bar Chart"
           }, {
             "line" : "Line Chart"
           } ]
         },
         "details" : {
           "label" : "Chart types",
           "description" : "Select one or more chart types to generate for each dataset",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:enumeration", "xs:string" ]
         }
       }, {
         "id" : "showXLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show x-axis label?",
           "description" : "Select whether a label will be shown on the x axis",
           "argument" : "--show-x-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "xlabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Time",
           "validator" : ""
         },
         "details" : {
           "label" : "X-axis label",
           "description" : "Label to display below the x-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "ylabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Magnitude",
           "validator" : ""
         },
         "details" : {
           "label" : "Y-axis label",
           "description" : "Label to display below the y-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "background",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "#FFFFFF",
           "validator" : "^#(?:[0-9a-fA-F]{6}){1}$"
         },
         "details" : {
           "label" : "Background color",
           "description" : "The hexadecimal background color of the charts. White by default",
           "argument" : "--background=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "height",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 512,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart height",
           "description" : "The height in pixels of each chart",
           "argument" : "--height=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "separateCharts",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--file-per-series",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       } ],
       "outputs" : [ ],
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0"
         },
         "executionSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com"
         },
         "storageSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.storage.example.com"
         },
         "owner" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/api_sample_user"
         },
         "permissions" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u1/pems"
         },
         "metadata" : {
           "href" : "https://public.tenants.agaveapi.co/meta/v2/data/?q={"associationIds":"0001414144637043-5056a550b8-0001-005"}"
         }
       }
     }
   }

Now that we understand what goes into an app and how to describe it, let's register it with Tapis by issuing a POST request to the Apps service. The following tabs show how to do this using the unix ``curl`` command as well as with the Tapis CLI. For reference, we will be using the app description from our :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/advanced-app-example/" title="Advanced App Example">PyPlot example</a>`.

Updating assets
~~~~~~~~~~~~~~~

Tapis does not store your app bundle along with the description, thus it is possible to update your app's assets directly through the files system or the Files service without updating the app description. This is both by design and unavoidable. Tapis does not have exclusive control over the storage systems you register with it, thus it cannot prevent the file from being editing directly on the file system. It also does not archive every app registered with it for several reasons, but primarily to make developing and debugging easier. As a result, the version number for a registered app does not necessarily reflect any release version on the underlying executable codes. It is left up to the developer to enforce the relationship through best practices relevant to their needs.

Updating a registered app
^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -F "fileToUpload=@app.json" https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0?pretty=true

.. code-block:: plaintext

   tapis apps create -v app.json demo-pyplot-demo-advanced-0.1.0

.. code-block:: json

   {
     "status" : "success",
     "message" : null,
     "version" : "2.1.0-rc424a",
     "result" : {
       "id" : "demo-pyplot-demo-advanced-0.1.0",
       "name" : "demo-pyplot-demo-advanced",
       "icon" : null,
       "uuid" : "0001414144637043-5056a550b8-0001-005",
       "parallelism" : "SERIAL",
       "defaultProcessorsPerNode" : 1,
       "defaultMemoryPerNode" : 1,
       "defaultNodeCount" : 1,
       "defaultMaxRunTime" : null,
       "defaultQueue" : "debug",
       "version" : "0.1.0",
       "revision" : 2,
       "isPublic" : true,
       "helpURI" : null,
       "label" : "PyPlot Demo Advanced",
       "shortDescription" : "Advanced demo plotting app",
       "longDescription" : "Advanced demo app to create a graph using Python",
       "tags" : [ "python", "demo", "plotting", "tutorial" ],
       "ontology" : [ "" ],
       "executionType" : "CLI",
       "executionSystem" : "demo.execute.example.com",
       "deploymentPath" : "/api/v2/apps/demo-pyplot-demo-advanced-0.1.0u1.zip",
       "deploymentSystem" : "demo.storage.example.com",
       "templatePath" : "wrapper.sh",
       "testPath" : "test/test.sh",
       "checkpointable" : false,
       "lastModified" : "2014-10-24T04:57:17.000-05:00",
       "modules" : [ ],
       "available" : true,
       "inputs" : [ {
         "id" : "dataset",
         "value" : {
           "validator" : "([^s]+(.(?i)(zip|gz|tgz|tar.gz|bz2|rar|csv))$)",
           "visible" : true,
           "required" : true,
           "order" : 0,
           "enquote" : false,
           "default" : [ "agave://demo.storage.example.com/api_sample_user/inputs/pyplot/testdata.csv" ]
         },
         "details" : {
           "label" : "Dataset",
           "description" : "The dataset to plot",
           "argument" : null,
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 1,
           "maxCardinality" : -1,
           "ontology" : [ "http://sswapmeet.sswap.info/mime/text/Csv", "http://sswapmeet.sswap.info/mime/text/Zip", "http://sswapmeet.sswap.info/mime/text/Tar", "http://sswapmeet.sswap.info/mime/text/Bzip", "http://sswapmeet.sswap.info/mime/text/Rar" ],
           "fileTypes" : [ "csv-0", "zip-0", "tar-0", "tgz-0", "bz-2", "rar-0" ]
         }
       } ],
       "parameters" : [ {
         "id" : "showYLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show y-axis label?",
           "description" : "Select whether a label will be shown on the y axis",
           "argument" : "--show-y-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "unpackInputs",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : null
         },
         "details" : {
           "label" : "Unpack input(s)",
           "description" : "If true, any compressed input files will be expanded prior to execution on the remote system.",
           "argument" : "1",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "showLegend",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--show-legend",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "width",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 1024,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart width",
           "description" : "The width in pixels of each chart",
           "argument" : "--width=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "chartType",
         "value" : {
           "visible" : true,
           "required" : true,
           "type" : "enumeration",
           "order" : 0,
           "enquote" : false,
           "default" : "line",
           "enum_values" : [ {
             "bar" : "Bar Chart"
           }, {
             "line" : "Line Chart"
           } ]
         },
         "details" : {
           "label" : "Chart types",
           "description" : "Select one or more chart types to generate for each dataset",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:enumeration", "xs:string" ]
         }
       }, {
         "id" : "showXLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show x-axis label?",
           "description" : "Select whether a label will be shown on the x axis",
           "argument" : "--show-x-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "xlabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Time",
           "validator" : ""
         },
         "details" : {
           "label" : "X-axis label",
           "description" : "Label to display below the x-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "ylabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Magnitude",
           "validator" : ""
         },
         "details" : {
           "label" : "Y-axis label",
           "description" : "Label to display below the y-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "background",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "#FFFFFF",
           "validator" : "^#(?:[0-9a-fA-F]{6}){1}$"
         },
         "details" : {
           "label" : "Background color",
           "description" : "The hexadecimal background color of the charts. White by default",
           "argument" : "--background=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "height",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 512,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart height",
           "description" : "The height in pixels of each chart",
           "argument" : "--height=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "separateCharts",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--file-per-series",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       } ],
       "outputs" : [ ],
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u1"
         },
         "executionSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com"
         },
         "storageSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.storage.example.com"
         },
         "owner" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/api_sample_user"
         },
         "permissions" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u1/pems"
         },
         "metadata" : {
           "href" : "https://public.tenants.agaveapi.co/meta/v2/data/?q={"associationIds":"0001414144637043-5056a550b8-0001-005"}"
         }
       }
     }
   }

Updating your app is simply a matter of posting an updated JSON description to your app's URL. The following tabs show how to do this using the unix ``curl`` command as well as with the Tapis CLI. Notice that when you POST an update, the revision number increases. This provides a quick way to track changes to an app description without querying the full provenance history.

Deleting an app
^^^^^^^^^^^^^^^

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0?pretty=true


Deleting an app is done by calling a HTTP DELETE on an app's URL. Note that deleting an app does not make its id available for reuse.
