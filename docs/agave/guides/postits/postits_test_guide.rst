.. role:: raw-html-m2r(raw)
   :format: html
   

Aloe Postits Tester Guide
=========================

The Aloe Postits program allows users to test the new **Postits Service** in a production-like Tapis environment before it gets deployed to production. The postits service in Aloe Postits test environment points to the new service. The files and systems services point to the production services, so all of your existing resources should be available. The test environment is limited in that redemption cannot be tested, 
as we cannot route these unauthenticated request to the sandbox environment. One can still test listing, revoking and creating postits. 

The documentation on the Postit service itself can be found `here <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/postits/introduction.html>`_.


.. contents:: Table of Contents

Getting Started
---------------

The Aloe Postits test environment relies on the `sandbox key facility of WSO2 <https://docs.wso2.com/display/AM170/Maintaining+Separate+Production+and+Sandbox+Gateways>`_, which allows users to target the Beta environment with their existing credentials. You will need to generate sandbox keys in order to authenticate to the Aloe Postits service.  Here is the procedure: 

1.	You can either use an existing client or create a new one. To use an existing client, skip to step 2. 

Using your tenant’s production URL, create a client for the Aloe Beta using the command below.  Replace *<username>* with your username in double quotes; replace *<base>* with your tenant's base URL. The command will prompt you for your password. 
 
|
.. code-block:: plaintext

        $ curl -sku <username> -X POST -d "clientName=postits_test_client" https://<base>/clients/v2
| 
   
2.	Go to the WSO2 store for your tenant, which is just your tenant’s base URL + /store in your browser (for example, Cyverse would look like https://agave.iplantc.org/store). Login with the same credentials you just used to create the client.
 
3.	Select the “My Subscriptions” tab and find the newly created client in the drop down under “Applications With Subscriptions”.

4.	Select the “Generate Keys” icon under the *Keys-Sandbox* section.

You now have a sandbox *Consumer Key*, *Consumer Secret* and *Access Token* for your tenant that can authenticate to the Aloe Jobs service. The default lifespan of a token is 4 hours (14400 seconds), but you can enter any lifespan you’d prefer and regenerate your token. For a token that doesn’t expire, enter -1 seconds (but be mindful of the security implications). 

For curl and CLI users, use the generated sandbox access token as you would normally use your production token. The only difference is that the sandbox token will direct your requests to the Postits test environment. 

For portal administrators, install the sandbox Key and Secret in your portal test environment so that all requests in your test portal will be routed to the Postits test environment. 


Postit Testing Environment
--------------------------

Before you start testing postits, there are a couple of important things to note. 

1. The actions performed on files and systems with the sandbox token will be permanent and reflected in the production database. Actions in the postits service will not be reflected in the production environment.
2. You will likely not have any postits available as most people have not created postits in the sandbox environment. You will have access to all production files and systems to create postits.
3. *You cannot redeem postits in the test environment*. Unfortunately, there is not a way to route redemption requests to the new service as it doesn't not require authentication. Any redemption requests will hit the production server. Any postit created in the sandbox environment will not be in the production environment, so you can expect "Postit Not Found" errors if attempting redeem postits created in the test environment. 

You can test all of the different parameters you may use to create postits, including legacy parameters. The goal is to verify that all of your non-redemption workflows continue to execute under the new Postits service. 


Getting Help and Providing Feedback
-----------------------------------

To give feedback or receive support, you can head over to the TACC-Cloud slack and reach out to @CICSupport and/or @BrandiKuritz. If Slack isn’t an option, you can also email CICsupport@tacc.utexas.edu.


`Click Here to Join TACC-Cloud Slack <https://join.slack.com/t/tacc-cloud/shared_invite/zt-8vqrwi01-IKZyFs~NkBN~U7n2m7JNDw>`_







