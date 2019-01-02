.. role:: raw-html-m2r(raw)
   :format: html

Aloe Beta Tester Guide
======================

The purpose of the Aloe Beta is to test the new jobs service in a production-like Agave environment. The Aloe Beta test environment is a snapshot of the production Agave database and a special way to generate credentials to access the Beta environment. This document helps users configure their Aloe Beta test environment.

The documentation on the new Aloe Job service itself can be found `here <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/jobs/introduction.html>`_.


.. contents:: Table of Contents

Getting Started
---------------

The Aloe Beta relies on the `sandbox key facility of WSO2 <https://docs.wso2.com/display/AM170/Maintaining+Separate+Production+and+Sandbox+Gateways>`_, which allows existing users to target the Beta environment with their existing credentials. 

You will need to generate sandbox keys in order to authenticate to the Aloe Jobs service. 

1.	Using your tenant’s production URL, create a client for the Aloe Beta where <username> is replaced by your username in double quotes and <base> is replaced by your tenant base URL. For example, the Cyverse base URL is https://agave.iplantc.org and the DesignSafe base URL is https://agave.designsafe-ci.org. 

|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl example**

     .. code-block:: plaintext

        $ curl -sku <username> -X POST -d "clientName=aloe_beta_client" https://<base>/clients/v2
| 


This will prompt you for your password. 

2.	Go to the WSO2 store for your tenant, which is just your tenant’s base URL + /store in your browser (for example, Cyverse would look like https://agave.iplantc.org/store). Login with the same credentials you just used to create the client.
 
3.	Select the “My Subscriptions” tab and find the newly created client in the drop down under “Applications With Subscriptions”.

4.	Select the “Generate Keys” icon under the Keys-Sandbox section.

You now have a Consumer Key, Consumer Secret and an Access Token for your tenant that can authenticate you to the Aloe Jobs service. The default lifespan of a token is 4 hours (14400 seconds), but you can enter any lifespan you’d prefer and regenerate your token. For a token that doesn’t expire, enter -1 seconds (but be mindful of the security implications). 
For curl or CLI users, you can use the sandbox access token generated as you would normally use your production token. The only difference is that the sandbox token will direct your requests to the Aloe Beta test environment. 

For portal administrators, you can install the sandbox Key and Secret in your portal test environment so that all requests in your test portal will be routed to the Aloe Beta environment. 


Aloe Beta Testing Environment
-----------------------------

Before you start running test jobs, there are a couple of important things to note. 

1.	The Aloe Beta test database is NOT permanent. Any apps and systems defined and published in this environment will disappear at the end of the beta program. In addition, the history of jobs that you ran will also be discarded at the end of the Beta program. On the other hand, job output archived to your preexisting storage systems will remain. Basically, everything saved to the Beta database will be lost at the conclusion of the Beta program. 

2.	There is a “snapshot” date for the Aloe Beta database. The database will reflect your tenant’s production database up to the snapshot date. Any applications or systems defined after this date, or any job histories created after this date, will not be reflected in the Aloe Beta environment. 


Running Jobs
------------

We highly recommend that you **TEST EVERYTHING THAT YOU NEED TO DO YOUR WORK**. Test all of the different variables you may use, such as different HPC systems, archive true vs. false, different application versions, etc. The goal is to test that all of your workflows continue to execute under the new Jobs service. 

It is also important to verify your outputs after your jobs have completed. Please make sure that your outputs match what you would expect, even if the job gives you a “SUCCESS” status. 

Getting Help and Providing Feedback
-----------------------------------

Reporting problems: Email us using `this link <mailto:cic@consult.tacc.utexas.edu?Subject=Aloe%20Bug%20Report:%20(Quick%20Description)&body=Created%20via%20email%0d%0d-------%0d%0dName:%0d%0d%0dTenant:%0d%0d%0dTenant%20Username:%0d%0d%0dIssue%20Description:%0d%0d%0dSteps%20to%20Reproduce:%0d%0d%0dActual%20Result:%0d%0d%0dExpected%20Result:%0d%0d%0dOther%20Information:>`_. Fill out the subject line and the template provided. Please make sure you send a separate email per issue.


Get Support: You can head over to the TACC-Cloud slack and talk to us on Aloe-Beta channel. If Slack isn’t an option, you can either email CICsupport@tacc.utexas.edu, or create a ticket in the `TACC portal <https://portal.tacc.utexas.edu/home>`_ if you have a TACC account. If making a ticket through the TACC portal, choose “Cloud and Interactive Computing (Agave API)” as the System/Resource. 


Give feedback: Want to just communicate general ideas/feelings/questions? You can email CICsupport@tacc.utexas.edu, or connect with us on the TACC-Cloud slack where we have a designated Aloe-Beta channel. 

---

Slack: <Will insert a 30 day join link>







