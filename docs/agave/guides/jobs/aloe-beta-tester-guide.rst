.. role:: raw-html-m2r(raw)
   :format: html
   
.. raw:: html

    <style> .red {color:red} </style>

.. role:: red


Aloe Beta Tester Guide
======================

The Aloe Beta program allows users to test the new **Jobs Service** in a production-like Tapis environment before it gets deployed to production. The Aloe Beta test environment includes a snapshot of the production Tapis database along with a way to generate credentials to access that environment. This document explains how to configure and use the Aloe Beta test environment.

The documentation on the new Aloe Job service itself can be found `here <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/jobs/introduction.html>`_.


.. contents:: Table of Contents

Getting Started
---------------

The Aloe Beta relies on the `sandbox key facility of WSO2 <https://docs.wso2.com/display/AM170/Maintaining+Separate+Production+and+Sandbox+Gateways>`_, which allows users to target the Beta environment with their existing credentials. You will need to generate sandbox keys in order to authenticate to the Aloe Jobs service.  Here is the procedure: 

1.	Using your tenant’s production URL, create a client for the Aloe Beta using the command below.  Replace *<username>* with your username in double quotes; replace *<base>* with your tenant's base URL. For example, the Cyverse base URL is https://agave.iplantc.org and the DesignSafe base URL is https://agave.designsafe-ci.org. The command will prompt you for your password. 
 
|
.. code-block:: plaintext

        $ curl -sku <username> -X POST -d "clientName=aloe_beta_client" https://<base>/clients/v2
| 
   
2.	Go to the WSO2 store for your tenant, which is just your tenant’s base URL + /store in your browser (for example, Cyverse would look like https://agave.iplantc.org/store). Login with the same credentials you just used to create the client.
 
3.	Select the “My Subscriptions” tab and find the newly created client in the drop down under “Applications With Subscriptions”.

4.	Select the “Generate Keys” icon under the *Keys-Sandbox* section.

You now have a sandbox *Consumer Key*, *Consumer Secret* and *Access Token* for your tenant that can authenticate to the Aloe Jobs service. The default lifespan of a token is 4 hours (14400 seconds), but you can enter any lifespan you’d prefer and regenerate your token. For a token that doesn’t expire, enter -1 seconds (but be mindful of the security implications). 

For curl and CLI users, use the generated sandbox access token as you would normally use your production token. The only difference is that the sandbox token will direct your requests to the Aloe Beta test environment. 

For portal administrators, install the sandbox Key and Secret in your portal test environment so that all requests in your test portal will be routed to the Aloe Beta environment. 


Aloe Beta Testing Environment
-----------------------------

Before you start running test jobs, there are a couple of important things to note. 

1.	The Aloe Beta test database is NOT permanent. Any apps and systems defined and published in this environment will disappear at the end of the beta program. In addition, the history of jobs that you ran will also be discarded at the end of the Beta program. The archived output of jobs, however, will physically remain in the directories where it was written. Basically, everything saved to the Beta database will be lost at the conclusion of the Beta program. 

2.	The “snapshot” date for the Aloe Beta database is 01/06/2019. The database will reflect your tenant’s production database up to the snapshot date. Any applications or systems defined after this date, or any job histories created after this date, will not be reflected in the Aloe Beta environment. 



Running Jobs
------------

We highly recommend that you **TEST EVERYTHING THAT YOU NEED TO DO YOUR WORK**. Test all of the different variables you may use, such as different HPC systems, archive true vs. false, different application versions, etc. The goal is to verify that all of your workflows continue to execute under the new Jobs service. 

It is also important to verify your outputs after your jobs have completed. Please make sure that your outputs match what you would expect, even if the job gives you a “SUCCESS” status. 

Getting Help and Providing Feedback
-----------------------------------

*Reporting Problems*: Email us using `this link <mailto:cic@consult.tacc.utexas.edu?cc=cicsupport@tacc.utexas.edu&Subject=Aloe%20Bug%20Report:%20(Quick%20Description)&body=Created%20Via%20Email%0d%0d-------%0d%0dName:%0d%0d%0dTenant:%0d%0d%0dTenant%20Username:%0d%0d%0dIssue%20Description:%0d%0d%0dSteps%20to%20Reproduce:%0d%0d%0dActual%20Result:%0d%0d%0dExpected%20Result:%0d%0d%0dOther%20Information:>`_. Fill out the subject line and the template provided. Please make sure you send a separate email per issue.

`Current List of Known Bugs and Issues <https://docs.google.com/spreadsheets/d/1iG9K9dDjHg-J1oHMKOtvoaX5fUyNX2HBxj-ovxKfbY8/edit?usp=sharing>`_



*Get Support*: You can head over to the TACC-Cloud slack and talk to us on Aloe-Beta channel. If Slack isn’t an option, you can either email CICsupport@tacc.utexas.edu, or create a ticket in the `TACC portal <https://portal.tacc.utexas.edu/home>`_ if you have a TACC account. If making a ticket through the TACC portal, choose “Cloud and Interactive Computing (Tapis API)” as the System/Resource. 


*Give Feedback*: Want to just communicate general ideas/feelings/questions? You can email CICsupport@tacc.utexas.edu, or connect with us on the TACC-Cloud slack where we have a designated Aloe-Beta channel. 

Known Limitations
-----------------


1. The new jobs service currently executes forked jobs and Slurm jobs on HPC systems. Support for other schedulers, such as PBS, Torque and LFS, will be introduced sometime after the Beta program begins. :red:`Condor, PBS, LFS, Torque, LoadLeveler, and SGE/GridEngine available since version 0.14.`

2. The Profiles endpoint is not available in the Beta test environment due to the difficulty in migrating the production data.


---

`Click Here to Join TACC-Cloud Slack <https://join.slack.com/t/tacc-cloud/shared_invite/enQtNTIxMDY2NjUxNjIzLTQwMThkZGI2NWY3NDY2MGM2ODEzZTU5NmE2OWNkYzczOTU0NTNjZDJiNTNmMGZkODc4ZTkyNzQwY2U2M2M2OWQ>`_







