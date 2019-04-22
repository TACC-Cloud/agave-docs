
Systems
=======

A system in Tapis (Agave) represents a server or collection of servers. A server can be physical, virtual, or a collection of servers exposed through a single hostname or ip address. Systems are identified and referenced in Tapis (Agave) by a unique ID unrelated to their ip address or hostname. Because of this, a single physical system may be registered multiple times. This allows different users to configure and use a system in whatever way they need to for their specific needs.

Systems come in two flavors: storage and execution. Storage systems are only used for storing and interacting with data. Execution systems are used for running apps (aka jobs or batch jobs) as well as storing and interacting with data.

The Systems service gives you the ability to add and discover storage and compute resources for use in the rest of the API. You may add as many or as few storage systems as you need to power your digital lab. When you register a system, it is private to you and you alone. Systems can also be published into the public space for all users to use. Depending on who is administering Tapis (Agave) for your organization, this may have already happened and you may already have one or more storage systems available to you by default.

In this tutorial we walk you through how to discovery, manage, share, and configure systems for your specific needs. This tutorial is best done in a hands-on manner, so if you do not have a compute or storage system of your own to use, you can grab a VM from our sandbox.

Discovering systems
-------------------

.. code-block:: plaintext

   systems-list -v

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/

|
The response will be something like this:

.. code-block:: json

   [
     {
       "id" : "user.storage",
       "name" : "Storage VM for the drug discovery portal",
       "type" : "STORAGE",
       "description" : "SFTP on drugdiscovery for the drug discovery portal",
       "status" : "UP",
       "public" : true,
       "default" : false,
       "_links" : {
         "self" : {
           "href" : "https://api.tacc.utexas.edu/systems/v2/user.storage"
         }
       }
     },
     {
       "id" : "docker.tacc.utexas.edu",
       "name" : "Demo Docker VM",
       "type" : "EXECUTION",
       "description" : "Cloud VM used for Docker demonstrations and tutorials.",
       "status" : "UP",
       "public" : true,
       "default" : false,
       "_links" : {
         "self" : {
           "href" : "https://api.tacc.utexas.edu/systems/v2/docker.tacc.utexas.edu"
         }
       }
     }
   ]

The Systems service allows you to list and search for systems you have registered and systems that have been shared with you. To get a list of all your systems, make a GET request on the Systems collection.

System description can get rather verbose, so a summary object is returned when listing a resource collection. The summary object contains the most critical fields in order to reduce response size when retrieving a user's systems. You can customize this behavior using the ``filter`` query parameter.

The above response my vary depending on who administers Tapis (Agave) for your organization. To customize this tutorial for your specific account, login.

Filtering results
-----------------

List all systems (up to the page limit)

.. code-block:: plaintext

   systems-list -v -S

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?type=storage
|


List only execution systems

.. code-block:: plaintext

   systems-list -v -E

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?type=execution
|


List only public systems

.. code-block:: plaintext

   systems-list -v -P

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?publicOnly=true
|


List only private systems

.. code-block:: plaintext

   systems-list -v -Q

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?privateOnly=true
|


Only return default systems

.. code-block:: plaintext

   systems-list -v -D

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?default=true
|


You can further filter the results by type, scope, and default status. See the search section for further filtering options.

System details
--------------

.. code-block:: plaintext

   systems-list -v api.tacc.cloud

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/user.storage
|


The response will be something like this:

.. code-block:: json

   {
     "site": "drugdiscovery.tacc.utexas.edu",
     "id": "user.storage",
     "revision": 4,
     "default": true,
     "lastModified": "2018-09-30T21:43:11.000-05:00",
     "status": "UP",
     "description": "SFTP on drugdiscovery for the drug discovery portal",
     "name": "Storage VM for the drug discovery portal",
     "owner": "user",
     "_links": {
       "roles": {
         "href": "https://api.tacc.utexas.edu/systems/v2/user.storage/roles"
       },
       "credentials": {
         "href": "https://api.tacc.utexas.edu/systems/v2/user.storage/credentials"
       },
       "self": {
         "href": "https://api.tacc.utexas.edu/systems/v2/user.storage"
       },
       "metadata": {
         "href": "https://api.tacc.utexas.edu/meta/v2/data/?q=%7B%22associationIds%22%3A%224602981590618992154-242ac116-0001-006%22%7D"
       }
     },
     "globalDefault": false,
     "available": true,
     "uuid": "0001431090358445-5056a550b8-0001-006",
     "public": true,
     "type": "STORAGE",
     "storage": {
       "mirror": false,
       "port": 22,
       "homeDir": "/home/user/storage",
       "protocol": "SFTP",
       "host": "drugdiscovery.tacc.utexas.edu",
       "publicAppsDir": "/apps",
       "proxy": null,
       "rootDir": "/",
       "auth": {
         "type": "SSHKEYS"
       }
     }
   }

To query for detailed information about a specific system, add the system id to the url and make another GET request.

This time, the response will be a JSON object with a full system description. The following is the description of a storage system. In the next section we talk more about storage systems and how to register one of your own.
