Getting started
===========================

**Prerequisites**

#. Introduction to Linux: 

    https://tacc.github.io/ctls2017/docs/intro_to_linux/intro_to_linux_01.html
        
        And 
    https://tacc.github.io/ctls2017/docs/gnu_utils/gnu_utils_01.html

        *. SSH with keys to a host

        *. List files

        *. Navigate to directories

        *. Additional basic commands

        *. Open, edit, save a text file

        *. File/Dir permissions

        *. Intro to APIs, HTTP and basics of REST (replace python.requests with curl): https://tacc.github.io/CSC2017Institute/docs/day2/APIs_intro.html

#. Intro to HTTP authentication: 
    https://tacc.github.io/CSC2017Institute/docs/day2/Intro_Authentication_in_HTTP.html

#. OAuth tutorial: 
    https://tacc.github.io/CSC2017Institute/docs/day2/Intro_Agave_OAuth.html


**Tutorial: Part 1 Creating Storage System**

#. Login to the TACC VPN.

#. SSH to the execution host ext-test-sys.tacc.utexas.edu (129.114.60.189) with your TACC credentials
    ssh <tacc-id>@ext-test-sys.tacc.utexas.edu           
    You will be prompted to enter password.

#. Install the required public key by issuing the following commands from your home directory.
    a. mkdir .ssh
    b. chmod 700 .ssh
    c. cd .ssh
    d. touch authorized_keys
    e. chmod 600 authorized_keys
    f. Copy the following text as is into the authorized_keys file:

            ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCjkSNFhWHNdHkr9u/nYtobIfsY+fXaZgCd3gNbU
            3nk+tNgLXw4bdxrQhE0I7gBKJW39CXUXst9EVA8urlzU9MMNb5YQVEEvPfesV40QQMCDCQI09wA/h2
            +wIffZmOuwMjH+nHaJ7omRuP0mWRxpIiY1hQqK6nWg5ndktot0QeyQ56pdd9vqhQRyeIlJjrepoast
            RgmGt72xYVqsLHPAEAYJ+J7IdginKNk56/Tr0sLHDXng1heLvf3ApAbP1zTjYUdLpUcKNtVY/CP6F+
            suK+iM0BECtZj5FGZBtMuQOwHiMXCXdamT2EdwCI1i8X7HFheRGU4offRmsY1SYSnLbg5 
            testgroup@tacc.utexas.edu

    g. Save the file.

#. There are two methods to create storage system. One using curl command and other using agavepy. In this tutorial we will discuss to create storage system using curl command.
    
**Create Storage system (using curl)**

#. Download sterry1-storage-ext-testuser1.json from attachments to your project directory (on your workstation) and rename it as <userid>-storage-ext.json .

#. Make following changes in <userid>-storage-ext.json
    a. Change the system-id to identify your storage system
    b. Change home dir to your home directory on the host ext-test-sys.tacc.utexas.edu. (/home/<userid>)
    c. Change username:testuser1 to username:<your tacc userid>

#. Run following curl command in the terminal by giving absolute or relative path of the file <userid>-storage-ext.json. (The token used in the curl command below is a forever token generated for 'test-client' app in the develop environment.)

    curl -k -H "Authorization:Bearer bc696aa76a5b77199d1a451d2b6d64" -F 'fileToUpload=@/<path>/<userid>.storage-ext.json' https://dev.tenants.aloedev.tacc.cloud/systems/v2?pretty=true

#. If storage system creation is successful, you should see a response containing status: success

#. You can get the details of newly created system by making a GET request to the Systems service giving your storage_system_id:

    export dev_tok=bc696aa76a5b77199d1a451d2b6d64

    curl -k -H "Authorization:Bearer $dev_tok" https://dev.tenants.aloedev.tacc.cloud/systems/v2/<storage_system_id>?pretty=true


**Tutorial: Part 2 Creating Execution System**

**Create Compute system (using curl)**

#. Download sterry1-compute-ext-testuser<userid>.json from attachments to your project directory and rename to <userid>-compute-ext.json.

#. Create  scratch, work and data directories in /home/<userid> on ext-test-sys.tacc.utexas.edu 


#. Make following changes in <userid>-compute-ext.json, after which "testuser1" should not appear in the file.

    a. Change the system-id to identify your compute system
    b. Change username:testuser1 to username:<your tacc-id> (2 occurrences)
    c. Change scratchDir to home/<userid>/scratch (2 occurrences)
    d. Change workDir to home/<userid>/work (2 occurrences)
    e. Change homeDir to home/<userid>/data

#. Run the following curl command in terminal by giving absolute or relative path of the file <userid>-compute-ext.json. (The token used in the curl command below is a forever token generated for 'test-client' app in the develop environment.)

    curl -k -H "Authorization:Bearer bc696aa76a5b77199d1a451d2b6d64" -F "fileToUpload=@/<path>/<userid>compute-ext.json" https://dev.tenants.aloedev.tacc.cloud/systems/v2?pretty=true

#. If compute system creation is successful, you should see a response containing status: success

#. You can get the details of newly created system by making a GET request to the Systems service giving your execution_system_id:

    export dev_tok=bc696aa76a5b77199d1a451d2b6d64

    curl -k -H "Authorization:Bearer $dev_tok" https://dev.tenants.aloedev.tacc.cloud/systems/v2/<execution_system_id>?pretty=true


**Tutorial: Part 3 Registering Hello World app**

#. Download helloworldapp.json from attachments to your project directory.

#. Create file wrapper.sh inside home/data folder on ext-test-sys.tacc.utexas.edu. 

#. Copy the contents of wrapper.sh from attachments to it. (You can also choose to upload the file wrapper.sh to home/data folder using agave files upload service). 

#. Make following changes in helloworldapp.json

    a. Suffix your initials to the app name, so you can identify your app later.
    b. Change the executionSystem to your execution system id created in Tutorial Part 2.
    c. Change the deploymentSystem to your storage system id created in Tutorial Part 1.

#. Run following curl command to register app:

    curl -k -H "Authorization:Bearer $dev_tok" -X POST -F "fileToUpload=@/<path>/helloworldapp.json" https://dev.tenants.aloedev.tacc.cloud/apps/v2?pretty=true

#. Once the app is created successfully, you should see a response containing **status:success **

#. Save the app **id** as it will be used in the next tutorial for job submission.

**Tutorial:  Part 4 Running app by submitting job**

#. Download file helloworldjob.json from attachments to your project directory.  

#. Make following changes in your helloworldjob.json:

    a. Change job name. 
    b. Change app id to one you saved in Tutorial Part 3.

#. Run curl command to submit job:

    curl -k -H "Content-Type:application/json" -X POST "--data@/<path>/helloworldjob.json" https://dev.tenants.aloedev.tacc.cloud/jobs/v2?pretty=true


#. Once the job is successfully submitted, you should see response status:success

#. Save the job id to check the status. Use the curl command below to check if the job is complete and status is FINISHED (this may not happen instantaneously, retry until job completes): 

          curl -k -H "Authorization:Bearer $dev_tok" https://dev.tenants.aloedev.tacc.cloud/jobs/v2/<job-id>?pretty=true

#. Note the workPath element in the result from the last command.  Go to the indicated directory to see the output Agave generated.  You should see 7 files, one of which is the wrapper.sh script that you provided.  The .ipcexe file is the actual file that Agave generated and ran on the execution system.  The other files with normal visibility capture stdout, stderr and the process id of the program that executed.  The final two files, .agave.log and .agave.archive, contain information about how the job executed.
