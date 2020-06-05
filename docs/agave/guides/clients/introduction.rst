.. role:: raw-html-m2r(raw)
   :format: html


Clients and API Keys
--------------------

By now you already have a user account. Your user account identifies you to the web applications you interact with. A username and password is sufficient for interacting with an application because the application has a user interface, so it knows that the authenticated user is the same one interacting with it. The Tapis API does not have a user interface, so simply providing it a username and password is not sufficient. Tapis needs to know both the user on whose behalf it is acting as well as the client application that is making the call. Whereas every person has a single user account, they may leverage multiple services to do their daily work.

In different types of Tapis interactions, the user is the same, but the context with which they interact with the Tapis is different. Further, the different Tapis interactions all involve client applications developed by the same organization. The situation is further complicated when one or more 3rd party client applications are used to leverage the infrastructure. Tapis needs to track both the users and client applications with whom it interacts. It does this through the issuance of API keys.

Tapis uses :raw-html-m2r:`<a href="http://oauth.net/2" title="OAuth2" target="_blank">OAuth2</a>` to authenticate users and make authorization decisions about what APIs client applications have permission to access. A discussion of OAuth2 is out of the context of this tutorial. You can read more about it on the :raw-html-m2r:`<a href="http://oauth.net/2" title="OAuth2" target="_blank">OAuth2</a>` website or from the websites of any of the many other service providers using it today. In this section, we will walk you through getting your API keys so we can stay focused on learning how to interact with the Tapis' (Tapis) APIs.

Creating a new client application
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order to interact with any of the Tapis APIs, you will need to first get a set of API keys. You can get your API keys from the Clients service. The example below shows how to get your API keys using both curl and the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/tooling/command-line-interface.html" title="Tapis CLI">Tapis CLI</a>`.


.. code-block:: shell

      curl -sku "$API_USERNAME:$API_PASSWORD" -X POST -d "clientName=my_cli_app" -d "description=Client app used for scripting up cool stuff" https://api.tacc.utexas.edu/clients/v2


..

Note: the -S option will store the new API keys for future use so you don't need to manually enter then when you authenticate later.

The response to this call will look something like:


.. code-block:: json

   {
      "callbackUrl":"",
      "key":"gTgp...SV8a",
      "secret":"hZ_z3f...BOD6",
      "description":"Client app used for scripting up cool stuff",
      "name":"my_cli_app",
      "tier":"Unlimited",
      "_links":{
         "self":{
            "href":"https://api.tacc.utexas.edu/clients/v2/my_cli_app"
         },
         "subscriber":{
            "href":"https://api.tacc.utexas.edu/profiles/v2/nryan"
         },
         "subscriptions":{
            "href":"https://api.tacc.utexas.edu/clients/v2/my_cli_app/subscriptions/"
         }
      }
   }

Your API keys should be kept in a secure place and not shared with others. This will prevent other, unauthorized client applications from impersonating your application. If you are developing a web application, you should also provide a valid callbackUrl when creating your keys. This will reduce the risk of your keys being reused even if they are compromised. You should also create a unique set of API keys for each client application you develop. This will allow you to better monitor your usage on a client application-to-application basis and reduce the possibility of inadvertently hitting usage quotas due to cumulative usage across client applications.

Listing your existing client applications
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

      curl -sku "$API_USERNAME:$API_PASSWORD" https://api.tacc.utexas.edu/clients/v2

..

The response to this call will look something like:


.. code-block:: json

   [
      {
         "callbackUrl":"",
         "key":"xn8b...0y3d",
         "description":"",
         "name":"DefaultApplication",
         "tier":"Unlimited",
         "_links":{
            "self":{
               "href":"https://api.tacc.utexas.edu/clients/v2/DefaultApplication"
            },
            "subscriber":{
               "href":"https://api.tacc.utexas.edu/profiles/v2/nryan"
            },
            "subscriptions":{
               "href":"https://api.tacc.utexas.edu/clients/v2/DefaultApplication/subscriptions/"
            }
         }
      },
      {
         "callbackUrl":"",
         "key":"gTgp...SV8a",
         "description":"Client app used for scripting up cool stuff",
         "name":"my_cli_app",
         "tier":"Unlimited",
         "_links":{
            "self":{
               "href":"https://api.tacc.utexas.edu/clients/v2/my_cli_app"
            },
            "subscriber":{
               "href":"https://api.tacc.utexas.edu/profiles/v2/nryan"
            },
            "subscriptions":{
               "href":"https://api.tacc.utexas.edu/clients/v2/my_cli_app/subscriptions/"
            }
         }
      }
   ]

Over time you may develop several client applications. Managing several sets of API keys can become tricky. You can see which applications you have created by querying the Clients service.


.. raw:: html

   <aside class="notice">In the last response you will notice that the client secret was not returned as part of the response objects. If you need to recover your client secret, just recreate the client app. Your client keys will not change, but the response will include your secret key.</aside>


Deleting client registrations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

      curl -sku "$API_USERNAME:$API_PASSWORD" -X DELETE https://api.tacc.utexas.edu/clients/v2/my_cli_app

..

The response to this call is simply a null result object.


At some point you may need to delete a client. You can do this by requesting a DELETE on your client in the Clients service.

Listing current subscriptions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

      curl -sku "$API_USERNAME:$API_PASSWORD" https://api.tacc.utexas.edu/clients/v2/my_cli_app/subscriptions


..

The response to this call will look something like:


.. code-block:: json

   [
     {
        "context":"/apps",
        "name":"Apps",
        "provider":"admin",
        "status":"PUBLISHED",
        "version":"v2",
        "tier":"Unlimited",
        "_links":{
           "api":{
              "href":"https://api.tacc.utexas.edu/apps/v2/"
           },
           "client":{
              "href":"https://api.tacc.utexas.edu/clients/v2/systest_test_client"
           },
           "self":{
              "href":"https://api.tacc.utexas.edu/clients/v2/systest_test_client/subscriptions/"
           }
        }
     },
     {
        "context":"/files",
        "name":"Files",
        "provider":"admin",
        "status":"PUBLISHED",
        "version":"v2",
        "tier":"Unlimited"
        "_links":{
           "api":{
              "href":"https://api.tacc.utexas.edu/files/v2/"
           },
           "client":{
              "href":"https://api.tacc.utexas.edu/clients/v2/systest_test_client"
           },
           "self":{
              "href":"https://api.tacc.utexas.edu/clients/v2/systest_test_client/subscriptions/"
           }
        }
     },
     ...
   ]

When you register a new client application and get your API keys, you are given access to all the Tapis APIs by default. You can see the APIs you have access to by querying the subscriptions collection of your client.

Updating client subscriptions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

      curl -sku "$API_USERNAME:$API_PASSWORD" -X POST -d "name=transforms" https://api.tacc.utexas.edu/clients/v2/my_cli_app/subscriptions


..

You can also use a wildcard to resubscribe to all active APIs.


.. code-block:: shell

      curl -sku "$API_USERNAME:$API_PASSWORD" -X POST -d "name=*" https://api.tacc.utexas.edu/clients/v2/my_cli_app/subscriptions

..

   The response to this call will be a JSON array identical to the one returned when listing your subscriptions.


Over time, new APIs will be deployed. When this happens you will need to subscribe to the new APIs. You can do this by POSTing a request to the subscription collection with the information about the new API.
