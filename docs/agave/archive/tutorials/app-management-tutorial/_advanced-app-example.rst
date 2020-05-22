.. role:: raw-html-m2r(raw)
   :format: html


This is the second of three app examples demonstrating how a real world code can be registered and used in Tapis. The app is a Python code that takes a csv file and creates a graph of the data. We detail how to create a JSON description of the code we want to run, how to create the wrapper template that Tapis uses to run the code, and how to test and run the app with Tapis.


.. raw:: html

   <aside class="notice">You can download the full source code for this example app and client application in the <a href="https://bitbucket.org/agaveapi/science-api-samples" title="Tapis Samples">Tapis Samples</a> repository in the <span class="code">apps/pyplot-demo/advanced/pyplot-demo-advanced-0.1.0</span> directory. The webapp source code is provided in the <span class="code">apps/pyplot-demo/intermediate/webapp</span>directory. If you would like to run this app in a live environment, you can register your own compute and storage systems, or use one of our developer sandbox environments.</aside>


Basic app overview
------------------

The application code we're going to use in the same Python plotting program from the previous tutorial. In this tutorial we will enhance the previous app by exposing several more parameters and adding validation rules so Tapis will handle server-side validation for us. As a refresher, here is the usage text from the pyplot app.

[code lang=text]
python main.py -h
usage: pyplot-demo [-h] [--chart-type {bar,line}] [--x-label [XLABEL]]
                   [--show-x-label] [--y-label [YLABEL]] [--show-y-label]
                   [--show-legend] [--width WIDTH] [--height HEIGHT]
                   [--background-color BACKGROUND] [--output-location OUTDIR]
                   [--file-per-series] [--format {png,jpg,gif}] [-v]
                   infile

A program to plot the contents of a csv file.

positional arguments:
  infile                The dataset to plot.

optional arguments:
  -h, --help            show this help message and exit
  --chart-type {bar,line}
                        The type of chart to show.
  --x-label [XLABEL]    The x-axis label.
  --show-x-label        If specified, the x-axis label will be shown
  --y-label [YLABEL]    The y-axis label.
  --show-y-label        If specified, the y-axis label will be shown
  --show-legend         If specified, a legend will be generated for each
                        chart.
  --width WIDTH         The chart width.
  --height HEIGHT       The chart height.
  --background-color BACKGROUND
                        The css hex color of the chart background.
  --output-location OUTDIR
                        The output directory of the plotted dataset.
  --file-per-series     If specified, each chart will be saved in a separate
                        file.
  --format {png,jpg,gif}
                        The image format of the plotted dataset.
  -v, --verbose         Enable verbose output.

.. code-block::


   From the basic example, we have a working app that takes an single input file representing the dataset that the pyplot code will process, and a single parameter that specifies the type of chart that will be generated. If we intend for other people to use this app, we probably want to add a couple things that will enhance the user experience. For example, the pyplot app only knows how to process files in comma separated value (csv) format. It would be good if the app verified the file was a CSV file when a job was submitted rather than let it fail silently. Also, the previous app we registered only allowed for png images to be created, so we will add some parameters to the app description that allow for better control of the look and feel of the generated charts.

   The result of these changes will be an app that is more flexible and error-resistant than its predecessor. To illustrate, we will look at a simple web application that exposes both apps to the end user and highlight the impact the changes have on the user experience.

   ### Runtime requirements <a name="runtime-requirements"></a>

   In order to run this app, the target execution system must have the following installed.

   <ul>
   <li>Python 2.7</li>
   <li>Matplotlib</li>
   </ul>

   If you are following along on your local system, you will need to have these installed in order to run the wrapper script and invoke the pyplot Python code.

   ### Creating the app JSON description <a name="creating-the-app-json-description"></a>

   The JSON for our intermediate app is below.

   ```javascript
   {
     "name":"demo-pyplot-demo-advanced",
     "parallelism":"SERIAL",
     "version":"0.1.0",
     "label":"PyPlot Demo Advanced",
     "shortDescription":"Advanced demo plotting app",
     "longDescription":"Advanced demo app to create a graph using Python",
     "defaultMemory":1,
     "defaultMaxRunTime":"00:15:00",
     "defaultMemoryPerNode":1,
     "defaultProcessors":1,
     "defaultQueue":"debug",
     "deploymentPath":"apps/pyplot-demo-advanced-0.1.0",
     "deploymentSystem":"demo.storage.example.com",
     "executionSystem":"demo.execute.example.com",
     "executionType":"CLI",
     "templatePath":"wrapper.sh",
     "testPath":"test/test.sh",
     "checkpointable":false,
     "modules":[

     ],
     "tags":[
       "demo",
       "python",
       "tutorial",
       "plotting"
     ],
     "ontology":[

     ],
     "inputs":[
       {
         "id":"dataset",
         "value":{
           "default":"agave://data.agaveapi.co/nryan/inputs/pyplot/testdata.csv",
           "type":"string",
           "validator":"([^s]+(.(?i)(zip|gz|tgz|tar.gz|bz2|rar|csv))$)",
           "visible":true,
           "required":true,
           "enquote":true
         },
         "details":{
           "label":"Dataset",
           "description":"The dataset to plot",
           "argument":null,
           "showArgument":false,
           "repeatArgument":true
         },
         "semantics":{
           "ontology":[
             "http://sswapmeet.sswap.info/mime/text/Csv",
             "http://sswapmeet.sswap.info/mime/text/Zip",
             "http://sswapmeet.sswap.info/mime/text/Tar",
             "http://sswapmeet.sswap.info/mime/text/Bzip",
             "http://sswapmeet.sswap.info/mime/text/Rar"
           ],
           "minCardinality":1,
           "maxCardinality":-1,
           "fileTypes":[
             "csv-0",
             "zip-0",
             "tar-0",
             "tgz-0",
             "bz-2",
             "rar-0"
           ]
         }
       }
     ],
     "parameters":[
       {
         "id":"unpackInputs",
         "details":{
           "label":"Unpack input(s)",
           "description":"If true, any compressed input files will be expanded prior to execution on the remote system.",
           "argument":"1",
           "showArgument":true
         },
         "value":{
           "default":false,
           "type":"flag",
           "visible":true,
           "required":false
         },
         "semantics":{
           "ontology":[
             "xs:boolean"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"chartType",
         "value":{
           "default":"bar",
           "type":"enumeration",
           "enum_values":[
             {
               "bar":"Bar Chart"
             },
             {
               "line":"Line Chart"
             }
           ],
           "visible":true,
           "required":true,
           "enquote":false
         },
         "details":{
           "label":"Chart types",
           "description":"Select one or more chart types to generate for each dataset",
           "argument":null,
           "showArgument":false,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:enumeration",
             "xs:string"
           ],
           "minCardinality":1,
           "maxCardinality":2
         }
       },
       {
         "id":"xlabel",
         "value":{
           "default":"Time",
           "type":"string",
           "validator":"",
           "visible":true,
           "required":false,
           "enquote":true
         },
         "details":{
           "label":"X-axis label",
           "description":"Label to display below the x-axis",
           "argument":"--x-label=",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:string"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"showXLabel",
         "value":{
           "default":true,
           "type":"flag",
           "validator":"",
           "visible":true,
           "required":false
         },
         "details":{
           "label":"Show x-axis label?",
           "description":"Select whether a label will be shown on the x axis",
           "argument":"--show-x-label",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:boolean"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"ylabel",
         "value":{
           "default":"Magnitude",
           "type":"string",
           "validator":"",
           "visible":true,
           "required":false,
           "enquote":true
         },
         "details":{
           "label":"Y-axis label",
           "description":"Label to display below the y-axis",
           "argument":"--y-label=",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:string"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"showYLabel",
         "value":{
           "default":true,
           "type":"flag",
           "validator":"",
           "visible":true,
           "required":false,
           "enquote":false
         },
         "details":{
           "label":"Show y-axis label?",
           "description":"Select whether a label will be shown on the y axis",
           "argument":"--show-y-label",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:boolean"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"showLegend",
         "value":{
           "default":false,
           "type":"flag",
           "validator":"",
           "visible":true,
           "required":false,
           "enquote":false
         },
         "details":{
           "label":"Extract the first k bytes",
           "description":"Select whether to include a legend in each chart",
           "argument":"--show-legend",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:string"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"separateCharts",
         "value":{
           "default":false,
           "type":"flag",
           "validator":"",
           "visible":true,
           "required":false,
           "enquote":false
         },
         "details":{
           "label":"Extract the first k bytes",
           "description":"Select whether to include a legend in each chart",
           "argument":"--file-per-series",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:boolean"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"height",
         "value":{
           "default":512,
           "type":"number",
           "validator":"d+",
           "visible":true,
           "required":false,
           "enquote":false
         },
         "details":{
           "label":"Chart height",
           "description":"The height in pixels of each chart",
           "argument":"--height=",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:integer"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"width",
         "value":{
           "default":1024,
           "type":"number",
           "validator":"d+",
           "visible":true,
           "required":false,
           "enquote":false
         },
         "details":{
           "label":"Chart width",
           "description":"The width in pixels of each chart",
           "argument":"--width=",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:integer"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       },
       {
         "id":"background",
         "value":{
           "default":"#FFFFFF",
           "type":"string",
           "validator":"^#(?:[0-9a-fA-F]{6}){1}$",
           "visible":true,
           "required":false,
           "enquote":true
         },
         "details":{
           "label":"Background color",
           "description":"The hexadecimal background color of the charts. White by default",
           "argument":"--background=",
           "showArgument":true,
           "repeatArgument":false
         },
         "semantics":{
           "ontology":[
             "xs:string"
           ],
           "minCardinality":0,
           "maxCardinality":1
         }
       }
     ]
   }

As with the previous app description, the JSON is still broken up in 3 general section. The first section is identical to before, save we have given this app a new name to reflect it represents our intermediate app tutorial. The inputs section still contains a single input object called ``dataset``. This time we added an extra attribute to the definition called, ``validator``. The validator field takes a regular expression value and uses this to validate user supplied values in job requests for the app. The regular expression we specified will ensure that only files ending with :raw-html-m2r:`<strong>.csv</strong>` will be accepted.

The parameters section is significantly larger than last time. Whereas the basic app had a single enumerated string parameter, this app has parameters for all the options the underlying pyplot supports. The parameters represent string, boolean, and numeric values. Notice that we do not explicitly define integer or decimal values. Rather, Tapis supports a generic :raw-html-m2r:`<em>number</em>` type which you can refine to an integer or decimal value through the use of the ``validator`` field.

Another change from the basic app is that our new parameters are optional. As you will see when we create our wrapper template, this means we will need to check for the existence of these values at run time.


.. raw:: html

   <pre>`There are many, many other attributes and options that we could include in our app description. We will get to some of them in the intermediate and advanced examples. For a full description of all the app description attributes and options, see the &lt;a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/app-inputs-and-parameters-tutorial/" title="App Inputs and Parameters Tutorial"&gt;App Inputs and Parameters Tutorial&lt;/a&gt;.
   `</pre>


Creating a wrapper script :raw-html-m2r:`<a name="creating-a-wrapper-script"></a>`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now that we have our app definition, we will create a wrapper template that Tapis can use to run our pyplot code. A wrapper template is a shell script that Tapis calls to invoke your app. A simple wrapper template for our app is shown below.

.. code-block:: shell

   #set -x
   WRAPPERDIR=$( cd "$( dirname "$0" )" &amp;&amp; pwd )

   # The application bundle is already here. We check to see if we need to unpack
   # it using the boolean parameter `unpackInputs` passed in.
   if [ -n "${unpackInputs}" ]; then

     # multiple datasets could be passed in, unpack each one as needed
     for i in ${dataset}; do

       dataset_extension="${i##*.}"

       if [ "$dataset_extension" == &#039;zip&#039; ]; then
         unzip "$i"
       elif [ "$dataset_extension" == &#039;tar&#039; ]; then
         tar xf "$i"
       elif [ "$dataset_extension" == &#039;gz&#039; ] || [ "$dataset_extension" == &#039;tgz&#039; ]; then
         tar xzf "$i"
       elif [ "$dataset_extension" == &#039;bz2&#039; ]; then
         bunzip "$i"
       elif [ "$dataset_extension" == &#039;rar&#039; ]; then
         unrar "$i"
       elif [ "$dataset_extension" != &#039;csv&#039; ]; then
         echo "Unable to unpack dataset due to unrecognized file extension, ${dataset_extension}. Terminating job ${AGAVE_JOB_ID}" &gt;&amp;2
         ${AGAVE_JOB_CALLBACK_FAILURE}
         exit
       fi

     done

   fi

   # Run the script with the runtime values passed in from the job request

   # iterate over every input file/folder given
   for i in `find $WRAPPERDIR -name "*.csv"`; do

     # iterate over every chart type supplied
     for j in ${chartType}; do

       inputfile=$(basename $i)
       outdir="$WRAPPERDIR/output/${inputfile%.*}"
       mkdir -p "$outdir"


       python $WRAPPERDIR/lib/main.py ${showYLabel} ${ylabel} ${showXLabel} ${xlabel} ${showLegend} ${height} ${width} ${background} ${format} ${separateCharts} -v --output-location=$outdir --chart-type=$j $i

       # send a callback notification for subscribers to receive alerts after every chart is generated
       ${AGAVE_JOB_CALLBACK_NOTIFICATION}

     done

   done

As you probably guessed, the wrapper template, like the app description, is a little bit more complex. However, a closer look will reveal that the majority of the new content is predictable scaffolding to check for the existence of a parameter before adding it to the call to pyplot. No value or type checks are needed because Tapis already handled the validation when it processed the job request. By the time the wrapper template is processed, boolean parameters will be resolved to 1 or 0, string parameters will be empty   or match the validator, enumeration parameters will be one of the predefined values, and numeric parameters will be integer values. Thus, with only value or missing values to deal with in the wrapper template, the initialization code becomes very predictable.


.. raw:: html

   <pre>`For even more help registering your apps, check out the App Generator. This form-based wizard will walk you through the creation of your app step by step, show you the resulting JSON along the way, and give you the option to generate a wrapper template skeleton. It is a big help in making app definition painless.
   `</pre>


When a user runs this example app, they will specify a ``dataset`` and ``chartType`` in their job request. During job submission, Tapis will stage the ``dataset`` to the execution system, demo.execute.example.com, and place it in the job's work directory. It will then copy the contents of the app's ``deploymentPath``\ , apps/pyplot-demo-intermediate-0.1.0, from the ``deploymentSystem``\ , demo.storage.example.com, to the job work directory on demo.execute.example.com and process the contents of the wrapper template, wrapper.sh, into an executable file.

During processing, Tapis will replace all occurrences of ``${dataset}``\ , ``${chartType}``\ , ``${xlabel}``\ , etc. with the name of the corresponding input or parameter value provided in the job description. Depending on whether the execution system registered with Tapis uses a batch scheduler, specifies a custom environment, or requires other custom environment variables set, Tapis will prepend these values to the top of the file, resolve any other :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/" title="App Management Tutorial">predefined template variables</a>` in the wrapper, save the file in the job work directory, and run it.

Things you don't worry about :raw-html-m2r:`<a name="things-you-dont-worry-about"></a>`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Data staging
~~~~~~~~~~~~

Data will already be there before the app is run. If the data isn't available or the user didn't provide any, the job will fail before the wrapper template is processed.

Logging
~~~~~~~

Logging is handled for you by Tapis. Both stderr and stdout will be captured for CLI apps. On batch systems, the job log files are saved in the job work directory. All will be present in the job work directory or archive directory when the job completes.

App installation
~~~~~~~~~~~~~~~~

This is a bit of a moot point since pyplot is Python, but Tapis handles the app staging for you by copying the ``deploymentPath`` from the ``deploymentSystem`` given in your app description to the job work folder on the ``executionSystem``. As long as you can package up your app's assets into the ``deploymentPath``\ , or ensure that they are already present on the system, you can run your app without dealing with pulling in dependencies, etc.

Of course, you still have the option of including a build or compilation in your wrapper script. For throughput reasons, however, that may not be the best approach. For another option with much better portability and performance, see the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/docker-app-containers-tutorial/" title="Docker App Containers Tutorial">Docker App Containers Tutorial</a>`.

Testing the wrapper template :raw-html-m2r:`<a name="testing-the-wrapper-template"></a>`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To test our wrapper template, we will create a new script in our test folder. The script will define the template variables Tapis would replace in the wrapper template at runtime. One perk of the wrapper templates being shell scripts is we can simply define our inputs and parameters as environment variables and bash will do the replacement for us.

.. code-block:: shell

   #!/bin/bash

   DIR=$( cd "$( dirname "$0" )" &amp;&amp; pwd )

   # set test variables
   export dataset="$DIR/lib/testdata.csv"
   export chartType="line"
   export xlabel="Trade_Date"
   export ylabel="Stock_Value"
   export showXLabel=1
   export showYLabel=1
   export showLegend=1
   export separateCharts=0
   export height=512
   export width=1024
   export format="png"
   export background="#999999"

   # call wrapper template as if the values had been injected by the API
   sh -c ../wrapper.sh

That's it. We can run the script and verify that the correct bar chart appears in the output directory.

Registering your app :raw-html-m2r:`<a name="registering-your-app"></a>`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now that we have our wrapper script and app description, and we have tested it works, we will register it to Tapis. Let's copy our wrapper script and test directory up to the ``deploymentSystem`` we specified in the app description and then send our app description to Tapis.

.. code-block:: shell

   files-mkdir -N apps/pyplot-demo-advanced-0.1.0 -S demo.storage.example.com
   files-upload -F wrapper.sh -S demo.storage.example.com apps/pyplot-demo-advanced-0.1.0
   files-upload -F test -S demo.storage.example.com apps/pyplot-demo-advanced-0.1.0

   tapis apps update -F app.json

That's it. Now we have our app ready to run with Tapis.

Running your app :raw-html-m2r:`<a name="running-your-app"></a>`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To run your app, we will post a JSON job request object to the jobs service. We can get an sample job description from the Tapis CLI's ``jobs-template`` script.

.. code-block:: shell

   jobs-template -A demo-pyplot-demo-advanced-0.1.0 &gt; submit.json

That will produce JSON similar to the following in the ``submit.json`` file. In the sample below we have added an additional input file and chartType to illustrate the support for multiple input and parameter values.

.. code-block:: javascript

   {
     "name": "pyplot-demo test",
     "appId": "demo-pyplot-demo-advanced-0.1.0",
     "inputs": {
       "dataset": [
         "agave://data.agaveapi.co/nryan/inputs/pyplot/testdata.csv",
         "agave://data.agaveapi.co/nryan/inputs/pyplot/testdata2.csv"
       ]
     },
     "archive": false,
     "parameters": {
       "unpackInputs": false,
       "chartType": ["bar","line"],
       "width": 1024,
       "height": 512,
       "background": "#d96727",
       "showYLabel": true,
       "ylabel": "The Y Axis Label",
       "showXLabel": true,
       "xlabel": "The X Axis Label",
       "showLegend": true,
       "separateCharts": false
     }
   }

We can now submit this JSON to the jobs service to run our pyplot on the execution system and access the output in the exact same way as before.

Improving the user experience :raw-html-m2r:`<a name="improving-the-user-experience"></a>`
----------------------------------------------------------------------------------------------

From an end-user perspective, the this app provides an upgraded experience over the intermediate app. The webapp in the intermediate folder illustrates this differences. Notice how the intermediate app is able to provide better field validation, multiple file selections, and catch errors to the input file prior to job submission where the intermediate app allows single input files and minimal validation.
