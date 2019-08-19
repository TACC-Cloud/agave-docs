.. role:: raw-html-m2r(raw)
   :format: html


This is the first of three app examples demonstrating how a real work code can be registered and used in Tapis. The app is a Python code that takes a csv file and creates a graph of the data. We detail how to create a JSON description of the code we want to run, how to create the wrapper template that Tapis uses to run the code, and how to test and run the app with Tapis.


.. raw:: html

   <aside class="notice">You can download the full source code for this example app and client application in the <a href="https://bitbucket.org/agaveapi/science-api-samples" title="Tapis Samples">Tapis Samples</a> repository in the <span class="code">apps/pyplot-demo/basic/pyplot-demo-basic-0.1.0</span> directory. If you would like to run this app in a live environment, you can register your own compute and storage systems, or use one of our developer sandbox environments.</aside>


Basic app overview
------------------

The app we're going to be using in this example is a native Python app that creates plots and charts of CSV data. The app itself is loosely based on example programs from the matplotlib cookbook with a healthy dose of parameterization, exception handling, and logging added for usability. The app's help output is listed below.

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


   While the app itself provides quite a few options, in this basic example, we will work under the assumption that end users don't need or use the majority of the options available from the pyplot code. The app we create will focus on two options: the kind of chart they want to create, `chart-type`, and the input file they want to plot, `infile`.

   As you will see, these two options will allow us to build a basic app description and highlight the major concepts of app registration. In the intermediate and advanced examples we will build on this example by exposing more of the pyplot options and demonstrating how Tapis can help you with data scheduling, parameter validation, and batch processing.

   ### Runtime requirements  

   In order to run this app, the target execution system must have the following installed.

   <ul>
   <li>Python 2.7</li>
   <li>Matplotlib</li>
   </ul>

   If you are following along on your local system, you will need to have these installed in order to run the wrapper script and invoke the pyplot Python code.

   ### Creating the app JSON description  

   In order to register our example app, we need to create a JSON description of it so Tapis knows where it should run and how to run it. The JSON for our basic app is below.

   ```json
   {
     "name": "demo-pyplot-demo-basic",
     "parallelism": "SERIAL",
     "version": "0.1.0",
     "label": "PyPlot Demo Basic",
     "shortDescription": "Basic demo plotting app",
     "longDescription": "Basic demo app to create a graph using Python",
     "deploymentPath": "apps/pyplot-demo-basic-0.1.0",
     "deploymentSystem": "demo.storage.example.com",
     "executionSystem": "demo.execute.example.com",
     "executionType": "CLI",
     "templatePath": "wrapper.sh",
     "testPath": "test/test.sh",
     "tags": [
       "demo",
       "python",
       "tutorial",
       "plotting"
     ],
     "ontology": [],
     "inputs": [{
       "id": "dataset",
       "value": {
         "default": "agave://demo.storage.example.com/inputs/pyplot/dataset.csv",
         "required": true 
       },
       "details": {
         "label": "Dataset",
         "description": "The dataset to plot"
       }
     }],
     "parameters": [{
       "id": "chartType",
       "value": {
         "default": "bar",
         "type": "enumeration",
         "enum_values": [{
           "bar": "Bar Chart"
         }, {
           "line": "Line Chart"
         }],
         "required": true
       },
       "details": {
         "label": "Chart types",
         "description": "Select the chart type to generate for the dataset"
       }
     }]
   }

It's easiest to think of the JSON description as having 3 basic components: metadata, inputs, and parameters. The metadata includes information about the app name and version,  where it should run, where the application assets (such as the pyplot code itself) are stored, etc. Inputs are the user-supplied input data that the app needs to run. In this example, pyplot will take a single input file as an input. We call the input file ``dataset`` for lack of a better term. We also specify that this is a required field any time someone runs our app. Finally, parameters are the user-supplied options passed to the pyplot app at runtime. We will talk more about how this is done when we create our wrapper template. For now we point out that we are defining a single input of type enumeration with possible values :raw-html-m2r:`<em>bar</em>` and :raw-html-m2r:`<em>line</em>`. Like our input, this parameter is required.

There are many, many other attributes and options that we could include in our app description. We will get to some of them in the intermediate and advanced examples. For a full description of all the app description attributes and options, see the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/app-inputs-and-parameters-tutorial/" title="App Inputs and Parameters Tutorial">App Inputs and Parameters Tutorial</a>`.

Creating a wrapper script
^^^^^^^^^^^^^^^^^^^^^^^^^

Now that we have our app defined, we need to create a wrapper template that Tapis can use to run our pyplot code. A wrapper template is a shell script that Tapis calls to invoke your app. A simple wrapper template for our app is shown below.

[code lang=text]
WRAPPERDIR=$( cd "$( dirname "$0" )" &amp;&amp; pwd )

The input file will be staged in for you as part of the job request.
====================================================================

Here we just sanity check that it exists.
=========================================

if [[ ! -e "${dataset}" ]]; then
    echo "Input file &#039;${dataset}&#039; was not found in the job directory" &gt;&amp;2
    exit 1
fi

We will drop the output graphs into a standard place
====================================================

outdir="$WRAPPERDIR/output"
mkdir -p "$outdir"

Now run the pyplot app with the injected chart type and directory as commandline options
========================================================================================

python $WRAPPERDIR/lib/main.py -v --output-location=$outdir --chart-type=${chartType} ${dataset}

.. code-block::


   You may notice that the wrapper template contains references to the `dataset` and `chartType` properties we defined in our app description. These are what we call <strong>template variables</strong>. Template variables are placeholders in the wrapper template that will be replaced with runtime values during job submission.

   When a user runs this example app, they will specify a `dataset` and `chartType` in their job request. During job submission, Tapis will stage the `dataset` to the execution system, demo.execute.example.com, and place it in the job's work directory. It will then copy the contents of the app's `deploymentPath`, apps/pyplot-demo-basic-0.1.0, from the `deploymentSystem`, demo.storage.example.com, to the job work directory on demo.execute.example.com and process the contents of the wrapper template, wrapper.sh, into an executable file.

   During processing, Tapis will replace all occurrences of `${dataset}` and `${chartType}` with the name of the input file that it staged to the job work directory (not the full path, just the file name) and the user-supplied `chartType` value. Depending on whether the execution system registered with Tapis uses a batch scheduler, specifies a custom environment, or requires other custom environment variables set, Tapis will prepend these values to the top of the file, resolve any other <a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/" title="App Management Tutorial">predefined template variables</a> in the wrapper, and save the file in the job work folder and executed.

   ### Things you don't worry about  

   #### Data staging  

   Data will already be there before the app is run. If the data isn't available or the user didn't provide any, the job will fail before the wrapper template is processed.

   #### Logging  

   Logging is handled for you by Tapis. Both stderr and stdout will be captured for CLI apps. On batch systems, the job log files are saved in the job work directory. All will be present in the job work directory or archive directory when the job completes.

   #### App installation  

   This is a bit of a moot point since pyplot is Python, but Tapis handles the app staging for you by copying the `deploymentPath` from the `deploymentSystem` given in your app description to the job work folder on the `executionSystem`. As long as you can package up your app's assets into the `deploymentPath`, or ensure that they are already present on the system, you can run your app without dealing with pulling in dependencies, etc.

   Of course, you still have the option of including a build or compilation in your wrapper script. For throughput reasons, however, that may not be the best approach. For another option with much better portability and performance, see the <a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/docker-app-containers-tutorial/" title="Docker App Containers Tutorial">Docker App Containers Tutorial</a>.

   ### Testing the wrapper template  

   To test our wrapper template, we will create a new script in our test folder. The script will define the template variables Tapis would replace in the wrapper template at runtime. One perk of the wrapper templates being shell scripts is we can simply define our inputs and parameters as environment variables and bash will do the replacement for us.

   [code lang=text]
   #!/bin/bash

   DIR=$( cd "$( dirname "$0" )" &amp;&amp; pwd )

   # set test variables
   export dataset="$DIR/lib/testdata.csv"
   export chartType="bar"

   # call wrapper script as if the values had been injected by the API
   sh -c ../wrapper.sh

That's it. We can run the script and verify that the correct bar chart appears in the output directory.

Registering your app
^^^^^^^^^^^^^^^^^^^^

Now that we have our wrapper script and app description, and we have tested it works, we will register it to Tapis. Let's copy our wrapper script and test directory up to the ``deploymentSystem`` we specified in the app description and then send our app description to Tapis.

.. code-block:: shell

   files-mkdir -N apps/pyplot-demo-basic-0.1.0 -S demo.storage.example.com 
   files-upload -F wrapper.sh -S demo.storage.example.com apps/pyplot-demo-basic-0.1.0
   files-upload -F test -S demo.storage.example.com apps/pyplot-demo-basic-0.1.0

   apps-addupdate -F app.json

That's it. Now we have our app ready to run with Tapis.

Running your app
^^^^^^^^^^^^^^^^

To run your app, we will post a JSON job request object to the jobs service. We can get an sample job description from the Tapis CLI's ``jobs-template`` script.

.. code-block:: shell

   jobs-template -A demo-pyplot-demo-basic-0.1.0 &gt; submit.json

That will produce JSON similar to the following in the ``submit.json`` file.

.. code-block:: json

   {
     "name": "demo-pyplot-demo-basic test-1415742730",
     "appId": "demo-pyplot-demo-basic-0.1.0",
     "archive": false,
     "inputs": {
       "dataset": "agave://demo.storage.example.com/apps/pyplot-demo-advanced-0.1.0/test/testdata.csv"
     },
     "parameters": {
       "chartType": "bar"
     }
   }

We can now submit this JSON to the jobs service to run our pyplot on the execution system.

.. code-block:: shell

   jobs-submit -W -F submit.json

When the job ends, you can use the ``jobs-output`` CLI script to retrieve the output. Here ``$JOB_ID`` is the id returned from the previous job submission.

Accessing job output
^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   jobs-output -P output/bar.png -D $JOB_ID
