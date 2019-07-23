.. role:: raw-html-m2r(raw)
   :format: html


Introduction
------------

The systems you create are private to you. If you changed nothing else from the examples in the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/system-management/" title="System Management">System Management</a>` tutorial, you would have a shared storage resource which your client application could use to host data for all your application users. Such a setup is often referred to as a :raw-html-m2r:`<em>community account</em>` because a single account is used by an entire community of people.

One challenge that comes with using community accounts is tracking the usage of individual users. Such fine-grained accounting is both time consuming and difficult to implement. Tapis solves this problem for you through its Internal User feature. If you are not familiar with this particular topic, please consult the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/internal-user-management/" title="Internal User Tutorial">Internal User Management</a>` tutorial for a detailed introduction.

Even though you share the account among your application users, Tapis will still track individual activity, so you can generate reports on the activity of any user you've created.

If a community account model is not desired, you can skip defining a default credential for the system and instead define credentials for each internal user. In this scenario, you would include a custom header, ``x-agave-internaluser``\ , specifying the username of the internal user with each request. Tapis will pick up on this and the credentials you associated with the internal user on a particular system will be used when interacting with the physical system.

A hybrid model is also possible. Internal user credentials will always be looked for first, however, if none are found, whatever default authentication has been defined for that system will be used. Thus, if you have a situation where you would like to allow some users to share a single account, but then force others to use their own accounts, this would be a model for doing so. Enforcing internal user quotas is left up to the application developer, however internal user usage information can be obtained from the reporting service to facilitate the decision making process.

Assigning a internal user credential to a system
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -XPOST --data &#039;{"internal_username": "cdavis", "username": "cdavis", "password": "changeit", "type": "PASSWORD", "default": false}&#039; https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis

.. code-block:: plaintext

   systems-credentials-addupdate -v -u cdavis -F credential-password.json demo.execute.example.com

The response from the service will return a JSON array of credentials created for the internal user. This may seem odd that a single POST resulted in multiple credentials. The reason two credentials were returned is that the target system is an execution system, thus is has both a ``storage.auth`` and ``login.auth`` authentication section. When no credential type is specified in the URL, the credential is applied to both authentication sections.

.. code-block:: javascript

   [
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "LOGIN",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/login"
         }
       }
     }, 
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "STORAGE",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage"
         }
       }
     }
   ]

To set just the storage credential for the internal user, we can append the internal username and type to the URL.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -XPOST --data &#039;{"internal_username": "cdavis", "username": "cdavis", "password": "changeit", "type": "PASSWORD", "default": false}&#039; https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage

.. code-block:: plaintext

   systems-credentials-addupdate -v -u cdavis -s -F credential-password.json demo.execute.example.com

The response from the service will return a JSON array with just the newly created credential object.

.. code-block:: javascript

   [ 
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "STORAGE",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage"
         }
       }
     }
   ]

Listing internal users with assigned credentials
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To obtain a listing of internal users with default credentials assigned to them on a particular system, perform a GET on the system credentials collection.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials

.. code-block:: plaintext

    systems-credentials-list -v

The response from the service will be a JSON array of credential objects. Notice that the actual system credentials are not returned. Once assigned, internal user credentials, as with default system credentials, cannot be retrieved.

.. code-block:: javascript

   [
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "LOGIN",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/login"
         }
       }
     }, 
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "STORAGE",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage"
         }
       }
     },
     {
       "parentType" : "storage",
       "default" : true,
       "internalUsername" : null,
       "type" : "PASSWORD",
       "created" : "2014-01-03T03:21:28.000-06:00",
       "valid" : true,
       "expirationDate" : null,
       "server" : null,
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/default/storage"
         },
         "parent" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         }
       }
     }, 
     {
       "parentType" : "login",
       "default" : true,
       "internalUsername" : null,
       "type" : "PASSWORD",
       "created" : "2014-01-03T03:21:28.000-06:00",
       "valid" : true,
       "expirationDate" : null,
       "server" : null,
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/default/login"
         },
         "parent" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         }
       }
     }
   ]

Adding the internal username to the URL will return just the credentials for that internal user if present.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis

.. code-block:: plaintext

    systems-credentials-list -v -u cdavis

.. code-block:: javascript

   [
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "LOGIN",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/login"
         }
       }
     }, 
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "STORAGE",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage"
         }
       }
     }
   ]

To list the credentials of a specific type, append either :raw-html-m2r:`<em>storage</em>` or :raw-html-m2r:`<em>login</em>` to the previous URL.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage

.. code-block:: plaintext

    systems-credentials-list -v -u cdavis -s

.. code-block:: javascript

   [
     {
       "parentType" : "storage",
       "default" : false,
       "internalUsername" : "cdavis",
       "type" : "PASSWORD",
       "created" : "2014-09-23T04:20:31.000-05:00",
       "valid" : true,
       "expirationDate" : null,
       "server" : null,
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage"
         },
         "parent" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "internalUser" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         }
       }
     }
   ]

Deleting internal user credentials
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To remove internal user credentials, make a DELETE request on the credential's URL.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/storage

.. code-block:: plaintext

    systems-credentials-delete -v -u cdavis -s

An empty response object will be returned. If we then query for the user's credentials again, we will see that the user's storage credential has been replaced with the system default credential.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis

.. code-block:: plaintext

    systems-credentials-delete -v -u cdavis -S

.. code-block:: javascript

   [
     {
       "created": "2014-09-23T04:20:16.000-05:00",
       "default": false,
       "expirationDate": null,
       "internalUsername": "cdavis",
       "parentType": "LOGIN",
       "server": null,
       "type": "PASSWORD",
       "valid": true,
       "_links": {
         "internalUser": {
           "href": "https://public.tenants.agaveapi.co/profiles/v2/systest/users/cdavis"
         },
         "parent": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         },
         "self": {
           "href": "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis/login"
         }
       }
     },
     {
       "parentType" : "storage",
       "default" : true,
       "internalUsername" : null,
       "type" : "PASSWORD",
       "created" : "2014-01-03T03:21:28.000-06:00",
       "valid" : true,
       "expirationDate" : null,
       "server" : null,
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/default/storage"
         },
         "parent" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         }
       }
     }
   ]

To delete all of the internal user's credentials, omit the type from the URL.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis

.. code-block:: plaintext

    systems-credentials-delete -v -u cdavis

Once again the response will be empty. Querying for the internal user credentials will now return just the system defaults.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis

.. code-block:: plaintext

    systems-credentials-delete -v -u cdavis -S

.. code-block:: javascript

   [
     {
       "parentType" : "storage",
       "default" : true,
       "internalUsername" : null,
       "type" : "PASSWORD",
       "created" : "2014-01-03T03:21:28.000-06:00",
       "valid" : true,
       "expirationDate" : null,
       "server" : null,
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/default/storage"
         },
         "parent" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         }
       }
     },
     {
       "parentType" : "login",
       "default" : true,
       "internalUsername" : null,
       "type" : "PASSWORD",
       "created" : "2014-01-03T03:21:28.000-06:00",
       "valid" : true,
       "expirationDate" : null,
       "server" : null,
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/default/login"
         },
         "parent" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials"
         }
       }
     }
   ]

Clearing all internal user credentials from a system can be done by omitting the internal username from the URL.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2/demo.execute.example.com/credentials/cdavis

.. code-block:: plaintext

    systems-credentials-delete -v -u cdavis -S

The response from the service will be empty.

Once you clear all internal user credentials from a system, all internal users requests will again use the default system credentials.


.. raw:: html

   <aside class="notice">Be careful when deleting internal credentials. Doing so can make job and system data created and stored using the internal user's credentials unavailable after deletion.</aside>

