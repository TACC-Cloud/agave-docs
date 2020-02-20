.. role:: raw-html-m2r(raw)
   :format: html


Tutorials
============

This tutorial is designed to allow you to practice and get familiar with the Tapisv2 enviornment.

Prerequisites
______________________

In order to navigate this tutorial you should have knowledge and familiarity with the following items:

**Skills**

    * SSH with keys to a host
    * List files
    * Navigate to directories
    * Unix commands
    * Open, edit, save a text file
    * File/Dir permissions

    * Intro to APIs, HTTP and basics of REST (replace python.requests with curl): https://tacc.github.io/CSC2017Institute/docs/day2/APIs_intro.html

    * Intro to HTTP authentication: https://tacc.github.io/CSC2017Institute/docs/day2/Intro_Authentication_in_HTTP.html

    * Intro to GNU Coreutils: https://tacc.github.io/ctls2017/docs/gnu_utils/gnu_utils_01.html

**Possess a TACC user account**


    #. In order to obtain a TACC user-account, first you must proceed to https://portal.tacc.utexas.edu/account-request

    #. Click the button that says "Continue to Create an Account"

    #. Please review the information on this page and follow the instructions to obtain a TACC User account




**Quick Start Tutorial** 
========================

This quick start guide is designed to show you how to do the following:

1. Create an Oauth Client. 
2. Submit a job using a public image classifyApp.
3. Retrieve job output information. 




**Create an OAuth client**
______________________

Most requests to the Tapisv2 REST APIs require authorization; that is, the user must have granted permission for an application to access the requested data. 

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
    -d 'grant_type=password&username=<username>&password=<password>&scope=PRODUCTION' 
    https://api.tacc.utexas.edu/token
Once you have obtained that token, save it as a variable by entering the following command


.. code-block:: shell

    export tok=<TOKEN>


For more information please see:

**OAuth tutorial**: https://tacc.github.io/CSC2017Institute/docs/day2/Intro_Tapis_OAuth.html


**Running a job**
______________________

The systems and application hvae been created for you, so now you are ready to run a Tapisv2 Job.
The Tapis Jobs service allows you to run applications registered with the Tapis Apps service across multiple, distributed, heterogeneous systems through a common REST interface. 

For this tutorial we have registered an Image Classifier App using Tapis Apps Service. 
Tapis.app.imageclassify-1.0u3 is a public app that uses public storage and execution systems.
Follow the steps below to submit the Tapis Job and view the output.



**Step 1:** Crafting the job definition:

Create the following file jobs.json

                    
                .. code-block:: json
                
                        {
                        "name":"tapis.demo.imageclassify.job",
                        "appId":"tapis.app.imageclassify-1.0u3",
                        "archive":false,
                        "memoryPerNode":"1"
                        
                        }

Job parameters used in the definition above are:

* name- The user selected name for the job.

* appId- The unique ID (name + version) of the application run by this job. This must be a valid application that the user has permission to run.

* archive- Whether the job output should be archived. When true, all new files created during job execution will be moved to the Archive Path on the Archive system.

* memoryPerNode- The memory requested for each node on which the job runs. Values are expressed as [num][units], where num can be a decimal number and units can be KB, MB, GB, TB (default = GB). Examples include 200MB, 1.5GB and 5.


**Step 2:** Submit the job by using the curl-command below:


.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" -X POST -d @jobs.json \
    -H "Content-Type: application/json" https://api.tacc.utexas.edu/jobs/v2

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





.. role:: raw-html-m2r(raw)
   :format: html


Extended Tutorial
========================

This Tutorial covers Tapisv2 in more depth. It covers:

#. Creating an Oauth Client
#. Creating a Storage System            
#. Creating an Execution System 
#. Creating an Application
#. Create the job definition
#. Run the job
#. Check status and get output


Note: The OAuth client and token you created in the Quick Start Tutorial can be used in the Extended Tutorial.  By default, the access tokens expire after 4 hours so if this time has passed you will need to create a new token. 



**Create an OAuth client**
______________________



Most requests to the Tapisv2 REST APIs require authorization; that is, the user must have granted permission for an application to access the requested data. 

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

**OAuth tutorial**: https://tacc.github.io/CSC2017Institute/docs/day2/Intro_Tapis_OAuth.html



**Systems**
______________________

Storage systems tell Tapisv2 where data resides. You can store files for running compute jobs, archive results, share files with collaborators, and maintain copies of your Tapis apps on storage systems. Tapis supports many of the communication protocols and permissions models that go along with them, so you can work privately, collaborate with individuals, or provide an open community resource. It’s up to you. Here is an example of a simple data storage system template accessed via SFTP for the TACC Corral cloud storage system:

.. code-block:: shell

        {
        "id": "UPDATEUSERNAME.tacc.corral.storage",
        "name": "Storage system for TACC cloud storage on corral",
        "type": "STORAGE",
        "description": "Storage system for TACC cloud storage on corral",
        "storage": {
            "host": "cloud.corral.tacc.utexas.edu",
            "port": 22,
            "protocol": "SFTP",
            "homeDir": "/home/UPDATEUSERNAME/",
            "auth": {
                "username": "UPDATEUSERNAME",
                "password": "UPDATEPASSWORD",
                "type": "SSHKEYS",
                "publicKey":"*****",
                "privateKey":"*****"
            }
        }
    }


* **id**- This needs to be a unqiue identifier amongst all systems in Tapis - so using your username helps ensure this.
* **name**- This can be whatever you like, but should be descriptive for you.
* **type** - A system can be STORAGE or EXECUTION.
* **host** - This is the ip or domain of the server we need to connect to
* **port** - This is the port we need to use when connecting, this is usally tied to the protocol (SFTP is usually port 22)
* **protocol** - This is the communication protocol most systems use SFTP but others are supported.
* **homeDir** - This is the directory that a Tapis user will access by default.
* **auth** - The Authenication type to use when accessing the system - in this tutorial we are using a PASSWORD Auth but SSH-KEYS is usually recommended.

After replacing <UPDATEUSERNAME> with your TACC ID; use the information in this json to create a file called s-system.json. 
To submit this job use this command:

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" -d @s-system.json https://api.tacc.utexas.edu/systems/v2

More details on the possible parameters for storage systems can be found in the Tapis Storage System documentation.

            [https://tacc-cloud.readthedocs.io/projects/Tapis/en/latest/Tapis/guides/systems/systems-storage.html]


**Tapisv2 Execution Systems**
______________________
Execution systems in Tapisv2 are very similar to storage systems. They just have additional information for how to launch jobs. In this example, we are using the Stampede2 HPC system, so we have to give scheduler and queue information. This system description is longer than the storage definition due to logins, queues, scratch systems definitions.


    .. code-block:: json

        {
        "id": "UPDATEUSERNAME.stampede2.execution",
        "name": "DEMO exec system",
        "type": "EXECUTION",
        "description": "Tapis exec system for DEMO project",
        "executionType": "HPC",
        "scratchDir": "/home1/0003/UPDATEUSERNAME/scratch",
        "workDir": "/home1/0003/UPDATEUSERNAME/work",
        "scheduler": "SLURM",
        "queues": [
            {
            "name": "normal",
            "default": true
            }
        ],
        "login": {
            "host": "stampede2.tacc.utexas.edu",
            "port": 22,
            "protocol": "SSH",
            "auth": {
                "username":"UPDATEUSERNAME",
                "type": "SSHKEYS",
                "publicKey":"*****",
                "privateKey":"*****"
            }
        },
        "storage": {
            "host": "stampede2.tacc.utexas.edu",
            "port": 22,
            "protocol": "SFTP",
            "homeDir": "/home1/0003/UPDATEUSERNAME",
            "auth": {
                "username":"UPDATEUSERNAME",
                "type": "SSHKEYS",
                "publicKey":"*****",
                "privateKey":"*****"
            }
        }
        }





We covered what some of these keywords are in the storage systems section. Below is some commentary on the new fields:

* **executionType** - Either HPC, Condor, or CLI. Specifies how jobs should go into the system. HPC and Condor will leverage a batch scheduler. CLI will fork processes.
* **scheduler** - For HPC or CONDOR systems, Tapisv2 is “scheduler aware” and can use most popular schedulers to launch jobs on the system. This field can be LSF, LOADLEVELER, PBS, SGE, CONDOR, FORK, COBALT, TORQUE, MOAB, SLURM, UNKNOWN. 
* **scratchDir** - Whenever Tapisv2 runs a job, it uses a temporary directory to cache any app assets or job data it needs to run the job. This job directory will be created under the “scratchDir” that you set. The path in this field will be resolved relative to the rootDir value in the storage config if it begins with a “/”, and relative to the system homeDir otherwise.
* **workDir** - Path to use for a job working directory. This value will be used if no scratchDir is given. The path will be resolved relative to the rootDir value in the storage config if it begins with a “/”, and relative to the system homeDir otherwise.
* **queue** - An array of batch queue definitions providing descriptive and quota information about the queues you want to expose on your system. If not specified, no other system queues will be available to jobs submitted using this system.
Complete reference information is located here: [https://tacc-cloud.readthedocs.io/projects/Tapis/en/latest/Tapis/guides/systems/introduction.html]


After replacing <UPDATEUSERNAME>; use the information in this json to create a file called e-system.json. 
To submit this job use this command:

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" -d @e-system.json


**Apps**
______________________


A Tapisv2 App is a versioned executable that runs on a specific execution system through the Tapis Jobs service.
So, for example, if you have multiple versions of a software package on a system, you would register each version as its own app. Likewise, if a single application code needs to be run on multiple systems, each combination of app and system needs to be defined as an app. Once you have storage and execution systems registered with Tapis, you are ready to build and use apps.

**Apps service**

The Apps service is a central registry for all Tapis apps. With Apps service you can:

* List or search apps
* Register new apps
* Manage or share app permissions
* Revise existing apps
* View information about each app such as its version number, owner, revision number to name a few

The rest of this tutorial explains how to package your Tapis app and register it with the Apps service.

**App Packaging**

Tapis v2 apps are bundled into a directory and organized in a way that Tapis jobs can properly invoke it. Tapis is the new code name for rearchitectured Tapis Jobs service. We will discuss more on this in the next part of the tutorial. Though there is plenty of opportunity to establish your own conventions, at the very least, your application folder should have a wrapper script. 

In order to run your application, you will need to create a wrapper template that calls your executable code. For the sake of maintainability, it should be named something simple and intuitive like wrapper.sh.
It should exit with a status of 0 on success when executed on the command line.
The resulting minimal app bundle would look something like the following:


* wrapper.sh


**Application Definition**

Here is an example of an Application Definition

    .. code-block:: json

            {
            "name": "UPDATEUSERNAME.stampede2.app",
            "version": "1.0",
            "label": "Hello World",
            "shortDescription": "Hello World App",
            "executionType": "HPC",
            "executionSystem": "UPDATEUSERNAME.stampede2.execution",
            "deploymentSystem": "UPDATEUSERNAME.tacc.corral.storage",
            "deploymentPath": "DEMO/hello_app",
            "templatePath": "wrapper.sh",
            "testPath": "wrapper.sh",
            "checkpointable": false
            "parallelism": "SERIAL",
            "inputs": [],
            "archive": false,
            "parameters": [ 
                {
                "id": "command",
                "details":
                {
                    "label": "Command to run",
                    "description": "This is the actual shell command to run",
                    "argument": "sh -c ",
                    "showArgument": true,
                    "repeatArgument": false
                },
                "value":
                {
                    "type": "string",
                    "required": true,
                    "visible": true,
                    "default": "/usr/bin/id"
                }
                }
            ],
            "outputs": [],
        }
* **name** - Apps are given an ID by combining the “name” and “version” that is unique across the entire Tapis tenant. You should put your username in either the beginning or end, it’s often useful to have the system name referenced there too.
* **version** - This should be the version of the software package that you are wrapping. If you update your app description later on, Tapis will keep track of the app revision separately.
* **deploymentSystem** - The data storage system where you keep the app assets, such as the wrapper script, test script, etc. as app assets are not stored on the execution system. Tapis requires that you keep them on a storage system.
* **deploymentPath** - the directory on the deploymentSystem where the app bundle is located
* **templatePath** - This template is what Tapis uses to run your app. The path you specify here is relative to the deploymentPath
* **testPath** - The intention here is that you include a testcase inside of your app bundle.

More details about Applications can be found in the Tapis Application documentation.
[https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/apps/introduction.html#apps]

**Registering an app**
______________________

Registering an app with the Apps service is conceptually simple. Just describe your app as a JSON document and POST it to the Apps service.

After updating the UPDATEUSERNAME with your TACC ID. Use the information in the template above to create a file called apps.json. 

Lets first check your storage and execution systems that you registered with Tapis with the command below:

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" https://api.tacc.utexas.edu/systems/v2


To register the app

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" -X POST -d @app.json https://public.tenants.Tapisapi.co/apps/v2/?pretty=true


**Running a job**
______________________

The last step before running the job would be to create your Application Bundle (for this demo it will only contain the wrapper.sh script) and place it on the storage system.

To accomplish this follow these steps:

 #. Login to the storage system (UPDATEUSERNAME.cloud.corral.utexas.edu)
 #. Navigate to the home directory 
 #. Create the directory that will contain your app bundle 

    * mkdir -p demo/hello_app 

 #. Navigate to the directory and create the wrapper script 
    
    * cd demo/hello_app && touch wrapper.sh

 #. Place the following code into the wrapper.sh

    .. code-block:: json 

        # helloworld app. All we need is a
        # template variable placeholder where Tapisv2
        # will insert the command we pass in the job
        # request.
        ${command}
 
 #. Log out of the storage system


Now you are ready to run a Tapisv2 Job.

The Tapisv2 Jobs service allows you to run applications registered with the Tapis Apps service across multiple, distributed, heterogeneous systems through a common REST interface. 

Follow the steps below to submit the Tapis Job and view the output.



**Step 1:** Crafting the job definition:

Create the following file jobs.json


                .. code-block:: json
                
                         {
                        "name":"Demo-App",
                        "appId":"UPDATEUSERNAME.stampede2.app-1.0"
                        }

Job parameters used referred in the definition above are:

* name- The user selected name for the job.

* appId- The unique ID (name + version) of the application run by this job. This must be a valid application that the user has permission to run.


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

    curl -sk -H "Authorization: Bearer  $tok" https://Tapis.iplantc.org/jobs/v2/$JOB_ID/status

And to receive the outputs you would enter

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" https://api.tacc.utexas.edu/jobs/v2/$job_id/outputs/listings/?pretty=true

**NOTE** 

You can download the files if you want by entering in the command: 

.. code-block:: shell

    curl -sk -H "Authorization: Bearer $tok" https://api.tacc.utexas.edu/jobs/v2/$job_id/outputs/media/$PATH


For more information you can refer to:

https://tacc-cloud.readthedocs.io/projects/Tapis/en/latest/Tapis/guides/jobs/introduction.html#jobs
