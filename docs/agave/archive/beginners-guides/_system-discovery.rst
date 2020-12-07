
System Discovery
================

Tapis enables you to group together one or more compute and storage systems to assemble the infrastructure you need to power your digital lab. To help you get started with Tapis, we provide several sandbox environments you can use to walk through these tutorials. These compute and storage resources are available to all users and will be used throughout the tutorials and examples on this site. Let's start out by querying the systems service to see what we already have.

Find all systems available to you
---------------------------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2

.. code-block:: plaintext

   systems-list -v

The response to this call for our example user looks like this:

.. code-block:: javascript

   [  
      {  
         "_links":{  
            "self":{  
               "href":"https://public.tenants.agaveapi.co/systems/v2/lonestar4.tacc.teragrid.org"
            }
         },
         "default":false,
         "description":"The TACC Dell Linux Cluster (Lonestar) is a powerful, multi-use cyberinfrastructure HPC and remote visualization resource. Lonestar contains 22,656 cores within 1,888 Dell PowerEdgeM610 compute blades (nodes), 16 PowerEdge R610 compute-I/Oserver-nodes, an...",
         "id":"lonestar4.tacc.teragrid.org",
         "name":"TACC Lonestar (Public)",
         "public":true,
         "status":"UP",
         "type":"EXECUTION"
      },
      {  
         "_links":{  
            "self":{  
               "href":"https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
            }
         },
         "default":true,
         "description":"The iPlant Data Store is where your data are stored. The Data Store is cloud-based and is the central repository from which data is accessed by all of iPlant&#039;s technologies.",
         "id":"data.agaveapi.co",
         "name":"iPlant Data Store",
         "public":true,
         "status":"UP",
         "type":"STORAGE"
      },
      {  
         "_links":{  
            "self":{  
               "href":"https://public.tenants.agaveapi.co/systems/v2/condor.opensciencegrid.org"
            }
         },
         "default":false,
         "description":"The Open Science Grid (OSG) advances science through open distributed computing. The OSG is a multi-disciplinary partnership to federate local, regional, community and national cyberinfrastructures to meet the needs of research and academic communities at...",
         "id":"condor.opensciencegrid.org",
         "name":"Open Science Grid",
         "public":true,
         "status":"UP",
         "type":"EXECUTION"
      },
      {  
         "_links":{  
            "self":{  
               "href":"https://public.tenants.agaveapi.co/systems/v2/docker.iplantcollaborative.org"
            }
         },
         "default":false,
         "description":"Atmosphere VM used for Docker demonstrations and tutorials.",
         "id":"docker.iplantcollaborative.org",
         "name":"Demo Docker VM",
         "public":true,
         "status":"UP",
         "type":"EXECUTION"
      },
      {  
         "_links":{  
            "self":{  
               "href":"https://public.tenants.agaveapi.co/systems/v2/stampede.tacc.utexas.edu"
            }
         },
         "default":false,
         "description":"Stampede is intended primarily for parallel applications scalable to tens of thousands of cores. Normal batch queues will enable users to run simulations up to 24 hours. Jobs requiring run times and more cores than allowed by the normal queues will be run...",
         "id":"stampede.tacc.utexas.edu",
         "name":"TACC Stampede (Public)",
         "public":true,
         "status":"UP",
         "type":"EXECUTION"
      }
   ]

The response contains a list of abbreviated system descriptions. Notice that there are two kinds of systems returned: ``EXECUTION`` and ``STORAGE``. Execution systems are used to run your simulations and optionally store and cache data. Storage systems are used to exclusively to store data. Tapis speaks multiple data, scheduling, and authentication protocols, so chances are that whatever mechanism you are using to interact with your data and compute resources today, Tapis can use those same mechanisms out of the box with no installation needed. The systems in the above example all use different combinations of protocols.

Viewing system details
----------------------

You can see each system's detailed description by adding the system id to the above request.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/systems/v2/docker.iplantcollaborative.org

.. code-block:: plaintext

   systems-list -v docker.iplantcollaborative.org

The response to this contains the full description of the system ``docker.iplantcollaborative.org``\ :

.. code-block:: javascript

   {  
      "description":"Atmosphere VM used for Docker demonstrations and tutorials.",
      "environment":null,
      "executionType":"CLI",
      "id":"docker.iplantcollaborative.org",
      "lastModified":"2014-07-17T10:00:24.000-05:00",
      "login":{  
         "auth":{  
            "type":"SSHKEYS"
         },
         "host":"128.196.64.126",
         "port":22,
         "protocol":"SSH",
         "proxy":null
      },
      "maxSystemJobs":100,
      "maxSystemJobsPerUser":5,
      "name":"Demo Docker VM",
      "public":true,
      "queues":[  
         {  
            "customDirectives":null,
            "default":true,
            "maxJobs":100,
            "maxMemoryPerNode":1,
            "maxNodes":1,
            "maxProcessorsPerNode":1,
            "maxUserJobs":10,
            "name":"debug"
         }
      ],
      "revision":5,
      "scheduler":"FORK",
      "scratchDir":"",
      "site":"iplantc.org",
      "startupScript":"./bashrc",
      "status":"UP",
      "storage":{  
         "auth":{  
            "type":"SSHKEYS"
         },
         "homeDir":"/",
         "host":"128.196.64.126",
         "mirror":false,
         "port":22,
         "protocol":"SFTP",
         "proxy":null,
         "rootDir":"/home/nryan/vhome"
      },
      "type":"EXECUTION",
      "uuid":"0001402177703917-5056a550b8-0001-006",
      "_links":{  
         "credentials":{  
            "href":"https://public.tenants.agaveapi.co/systems/v2/docker.iplantcollaborative.org/credentials"
         },
         "metadata":{  
            "href":"https://public.tenants.agaveapi.co/meta/v2/data/?q={\"associationIds\":\"0001402177703917-5056a550b8-0001-006\"}"
         },
         "roles":{  
            "href":"https://public.tenants.agaveapi.co/systems/v2/docker.iplantcollaborative.org/roles"
         },
         "self":{  
            "href":"https://public.tenants.agaveapi.co/systems/v2/docker.iplantcollaborative.org"
         }
      }
   }

In the next beginner's guide we will learn how to interact with data on our storage systems.
