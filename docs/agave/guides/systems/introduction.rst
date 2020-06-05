
Systems
=======

A system in Tapis represents a server or collection of servers. A server can be physical, virtual, or a collection of servers exposed through a single hostname or ip address. Systems are identified and referenced in Tapis by a unique ID unrelated to their ip address or hostname. Because of this, a single physical system may be registered multiple times. This allows different users to configure and use a system in whatever way they need to for their specific needs.

Systems come in two flavors: storage and execution. Storage systems are only used for storing and interacting with data. Execution systems are used for running apps (aka jobs or batch jobs) as well as storing and interacting with data.

The Systems service gives you the ability to add and discover storage and compute resources for use in the rest of the API. You may add as many or as few storage systems as you need to power your digital lab. When you register a system, it is private to you and you alone. Systems can also be published into the public space for all users to use. Depending on who is administering Tapis for your organization, this may have already happened and you may already have one or more storage systems available to you by default.

In this tutorial we walk you through how to discovery, manage, share, and configure systems for your specific needs. This tutorial is best done in a hands-on manner, so if you do not have a compute or storage system of your own to use, you can grab a VM from our sandbox.

Discovering systems
-------------------

.. code-block:: plaintext

  tapis systems list -v

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
       "default" : false,
       "_links" : {
         "self" : {
           "href" : "https://api.tacc.utexas.edu/systems/v2/user.storage"
         }
       },
       "available": null,
       "description" : "SFTP on drugdiscovery for the drug discovery portal",
       "public" : true,
       "status" : "UP",
     },
     {
       "id" : "docker.tacc.utexas.edu",
       "name" : "Demo Docker VM",
       "type" : "EXECUTION",
       "default" : false,
       "_links" : {
         "self" : {
           "href" : "https://api.tacc.utexas.edu/systems/v2/docker.tacc.utexas.edu"
         }
       },
       "available": null,
       "description" : "Cloud VM used for Docker demonstrations and tutorials.",
       "public" : true,
       "status" : "UP"
     }
   ]

The Systems service allows you to list and search for systems you have registered and systems that have been shared with you. To get a list of all your systems, make a GET request on the Systems collection.

System description can get rather verbose, so a summary object is returned when listing a resource collection. The summary object contains the most critical fields in order to reduce response size when retrieving a user's systems. You can customize this behavior using the ``filter`` query parameter.

The above response my vary depending on who administers Tapis for your organization. To customize this tutorial for your specific account, login.

Filtering results
-----------------

List all systems (up to the page limit)

.. code-block:: plaintext

   tapis systems search -v --type eq STORAGE

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?type=storage
|


List only execution systems

.. code-block:: plaintext

   tapis systems search -v --type eq EXECUTION

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?type=execution
|


List only public systems

.. code-block:: plaintext

   tapis systems search --public eq TRUE


.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?publicOnly=true
|


List only private systems

.. code-block:: plaintext

   tapis systems search --public eq FALSE

.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://api.tacc.utexas.edu/systems/v2/?privateOnly=true
|


Only return default systems

.. code-block:: plaintext

   tapis systems search --default eq TRUE

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

   tapis systems show -v hpc-tacc-jetstream

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
    "id": "hpc-tacc-jetstream",
    "name": "TACC Jetstream (Docker Host)",
    "type": "EXECUTION",
    "default": false,
    "_links": {
      "metadata": {
      "href": "https://api.sd2e.org/meta/v2/data/?q=%7B%22associationIds%22%3A%228014294480571067929-242ac11a-0001-006%22%7D"
      },
      "roles": {
        "href": "https://api.sd2e.org/systems/v2/hpc-tacc-jetstream/roles"
        },
        "self": {
        "href": "https://api.sd2e.org/systems/v2/hpc-tacc-jetstream"
        },
        "history": {
        "href": "https://api.sd2e.org/systems/v2/hpc-tacc-jetstream/history"
        }
      },
      "available": true,
      "description": "Linux container support via Docker 17.12.1-ce",
      "environment": null,
      "executionType": "CLI",
      "globalDefault": false,
      "lastModified": "2019-09-11T12:49:47.000-05:00",
      "login": {
      "proxy": null,
      "protocol": "SSH",
      "port": 22,
      "auth": {
        "type": "SSHKEYS"
        },
        "host": "129.114.17.137"
        },
        "maxSystemJobs": 10,
        "maxSystemJobsPerUser": 10,
        "owner": "sd2eadm",
        "public": true,
        "queues": [
        {
        "maxJobs": 128,
        "maxMemoryPerNode": 1,
        "default": false,
        "maxRequestedTime": "00:15:00",
        "name": "short",
        "description": "Rapid turnaround jobs",
        "maxNodes": 1,
        "maxProcessorsPerNode": 1,
        "mappedName": null,
        "maxUserJobs": 10,
        "customDirectives": "-A SD2E-Community"
        },
      ],
      "revision": 20,
      "scheduler": "FORK",
      "scratchDir": "",
      "site": "jetstream-cloud.org",
      "status": "UP",
      "storage": {
        "proxy": null,
        "protocol": "SFTP",
        "mirror": false,
        "port": 22,
        "auth": {
          "type": "SSHKEYS"
        },
        "host": "129.114.17.137",
        "rootDir": "/data/jobs",
        "homeDir": "/"
      },
      "uuid": "8014294480571067929-242ac11a-0001-006",
      "workDir": ""
    }

To query for detailed information about a specific system, add the system id to the url and make another GET request.

This time, the response will be a JSON object with a full system description. The following is the description of a storage system. In the next section we talk more about storage systems and how to register one of your own.
