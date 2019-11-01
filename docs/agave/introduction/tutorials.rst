.. role:: raw-html-m2r(raw)
   :format: html


Tutorials
============

This tutorial is designed to allow you to practice and get familiar with the Tapis enviornment.

Prerequisites
-----------------

In order to navigate this tutorial you should have knowledge and familiarity with the following items:

* SSH with keys to a host
* List files
* Navigate to directories
* Additional basic commands
* Open, edit, save a text file
* File/Dir permissions

* Intro to APIs, HTTP and basics of REST (replace python.requests with curl): https://tacc.github.io/CSC2017Institute/docs/day2/APIs_intro.html

* Intro to HTTP authentication: https://tacc.github.io/CSC2017Institute/docs/day2/Intro_Authentication_in_HTTP.html

* Intro to GNU Coreutils: https://tacc.github.io/ctls2017/docs/gnu_utils/gnu_utils_01.html





**Possess a TACC user account**
______________________

In order to obtain a TACC user-account, first you must proceed to
https://portal.tacc.utexas.edu/account-request?p_p_id=createaccount_WAR_createaccountportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_createaccount_WAR_createaccountportlet_action=continue

* At the bottom of the page there is a button to click and accept. Click that button. 
* At the next page you must fill out your contact information. 




**Quick Start Tutorial** 
---------------------

This quick start guide is designed to show you how to do the following:

1. Create an Oauth Client. 
2. Submit a job using a public image classifyApp.
3. Retrieve job output information. 




**Create an OAuth client**
______________________

Most requests to the Tapis REST APIs require authorization; that is, the user must have granted permission for an application to access the requested data. 

**Step 1:** Create an Oauth Client by entering the following curl command:

.. code-block:: shell

    curl -sku "$API_USERNAME" -X POST \
    -d "clientName=my_cli_app&description=Client app used for scripting up cool stuff" \
    https://api.tacc.utexas.edu/clients/v2


Create a variable for the client key and secret by entering:

.. code-block:: shell

    export key=<client key>
    export secret=<secret>

**Step 2:** Generate an access token by entering the following curl command:

.. code-block:: shell

    curl -v -u $key:$secret -X POST
    -d 'grant_type=password&username=<testshareuser>&password=<testshareuserpassword>&token_username=<testshareuser>&scope=PRODUCTION' 
    https://api.tacc.utexas.edu/token
Once you have obtained that token, save it as a variable by entering the following command


.. code-block:: shell

    export tok=<TOKEN>


For more information please see:

**OAuth tutorial**: https://tacc.github.io/CSC2017Institute/docs/day2/Intro_Agave_OAuth.html


**Running a job**
______________________

Now you are ready to run a Tapis Job.
The Tapis Jobs is the service that allows you to run applications registered with the Tapis Apps service across multiple, distributed, heterogeneous systems through a common REST interface. 

For this tutorial we have registered an Image Classifier App using Tapis Apps Service. 
Tapis.app.imageclassify-1.0u3 is a public app that uses public storage and execution systems.
Follow the steps below to submit the Tapis Job and view the output.



**Step 1:** Crafting the job definition:

Create the following file jobs.json

.. container:: foldable

                .. container:: header

                    :fa:`caret-right`
                    **Show JSON**
                .. code-block:: json
                
                        {
                        "name":"tapis.demo.imageclassify.job",
                        "appId":"tapis.app.imageclassify-1.0u3",
                        "archive":false,
                        "memoryPerNode":"1"
                        
                        }

Job parameters used referred in the definition above are:

* name- The user selected name for the job.

* appId- The unique ID (name + version) of the application run by this job. This must be a valid application that the user has permission to run.

* archive- Whether the job output should be archived. When true, all new files created during job execution will be moved to the Archive Path on the Archive system.

* memoryPerNode- The memory requested for each node on which the job runs. Values are expressed as [num][units], where num can be a decimal number and units can be KB, MB, GB, TB (default = GB). Examples include 200MB, 1.5GB and 5.


**Step 2:** Submit the job by using the curl-command below:


.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" -X POST -d @jobs.json \
    -H "Content-Type: application/json" https://api.tacc.utexas.edu

**Note:** Please make sure to run it from the same folder where you have created jobs.json
You should see a message “Successfully submitted job job-id”. Everytime you submit a job, a unique job id is created.

**Job output**
______________________

You can check the status of the job and receive the output of the job at the same time. 

Type in the curl command below:

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" https://api.tacc.utexas.edu/jobs/v2/$job_id/outputs/listings/?pretty=true

**NOTE** 

You can download the files if you want by entering in the command: 

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" https://api.tacc.utexas.edu/jobs/v2/$job_id/outputs/media/$PATH



