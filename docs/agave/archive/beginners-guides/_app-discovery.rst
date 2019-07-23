.. role:: raw-html-m2r(raw)
   :format: html


App Tutorial
============

.. code-block::

   binary code + system = app


We saw in the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/beginners-guides/system-discovery/" title="System Discovery">System Discovery</a>` guide that there were both storage and execution systems. The :raw-html-m2r:`<a href="http://agaveapi.co/documentation/beginners-guides/managing-data/" title="Managing Data">Data Management</a>` guide covered interacting with storage systems. In this section we look at Apps, which are the primary point of interaction with execution systems.

An app in Tapis is most easily thought of as the installation of a simulation code on a physical resource. For example, the official installation of Blast on Stampede would be described by a single app. Your personally compiled version of Blast on Stampede would be described by a different app. Ditto for the same two codes on Lonestar.

Discovering Apps
----------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/apps/v2

.. code-block:: plaintext

   apps-list -v

.. code-block:: json

   [  
     {  
       "executionSystem":"docker.agaveapi.co",
       "id":"cloud-runner-0.1.0u1",
       "isPublic":true,
       "lastModified":"2014-06-30T17:19:56.000-05:00",
       "name":"cloud-runner",
       "revision":1,
       "shortDescription":"Generic app to run arbitrary docker images in the cloud.",
       "version":"0.1.0",
       "_links":{  
         "self":{  
           "href":"https://public.tenants.agaveapi.co/apps/v2/cloud-runner-0.1.0u1"
         }
       }
     },
     {  
       "executionSystem":"docker.agaveapi.co",
       "id":"wordcount-1.0u1",
       "isPublic":true,
       "lastModified":"2014-06-30T17:19:56.000-05:00",
       "name":"wordcount",
       "revision":1,
       "shortDescription":"Demo R app running as a Docker container.",
       "version":"1.0",
       "_links":{  
         "self":{  
           "href":"https://public.tenants.agaveapi.co/apps/v2/wordcount-1.0u1"
         }
       }
     }
   ]

To view a list of all the apps available to you, make a GET request to the Apps service.

The response is a JSON array of summary app descriptions.


.. raw:: html

   <aside class="notice">Depending on who is administering the Tapis platform for your organization, you may see many or few apps returned from the above response. This is normal and has to do with what systems and apps they have chosen to make publicly available. If you don't see any apps there by default, no worries, see the <a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/" title="App Management Tutorial">App Management Tutorial</a> for a quick reference on how to add your own.</aside>


Viewing app details
-------------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/apps/v2/wc-osg-1.00u1

.. code-block:: plaintext

   apps-list -v wc-osg-1.00u1

..

   The response is a JSON object with a lot of information that we elaborate more on in the App Service tutorial.


.. code-block:: json

   {  
     "available":true,
     "checkpointable":true,
     "defaultMaxRunTime":null,
     "defaultMemoryPerNode":null,
     "defaultNodeCount":null,
     "defaultProcessorsPerNode":null,
     "defaultQueue":null,
     "deploymentPath":"/api/v2/apps/wc-osg-1.00u1.zip",
     "deploymentSystem":"data.agaveapi.co",
     "executionSystem":"condor.opensciencegrid.org",
     "executionType":"CONDOR",
     "helpURI":"http://www.gnu.org/s/coreutils/manual/html_node/wc-invocation.html",
     "icon":null,
     "id":"wc-osg-1.00u1",
     "inputs":[  
       {  
         "details":{  
           "argument":null,
           "description":"",
           "label":"File to count words in: ",
           "showArgument":false,
           "visible":true
         },
         "id":"query1",
         "semantics":{  
           "fileTypes":[  
             "text-0"
           ],
           "minCardinality":1,
           "ontology":[  
             "http://sswapmeet.sswap.info/util/TextDocument"
           ]
         },
         "value":{  
           "default":"read1.fq",
           "order":0,
           "required":false,
           "validator":"",
           "visible":true
         }
       }
     ],
     "isPublic":true,
     "label":"wc condor",
     "lastModified":"2014-06-07T12:29:12.000-05:00",
     "longDescription":"",
     "modules":[  
       "load TACC",
       "purge"
     ],
     "name":"wc-osg",
     "ontology":[  
       "http://sswapmeet.sswap.info/algorithms/wc"
     ],
     "outputs":[  
       {  
         "details":{  
           "description":"Results of WC",
           "label":"Text file"
         },
         "id":"outputWC",
         "semantics":{  
           "fileTypes":[],
           "maxCardinality":1,
           "minCardinality":1,
           "ontology":[  
             "http://sswapmeet.sswap.info/util/TextDocument"
           ]
         },
         "value":{  
           "default":"wc_out.txt",
           "validator":""
         }
       }
     ],
     "parallelism":"SERIAL",
     "parameters":[  

     ],
     "revision":1,
     "shortDescription":"Count words in a file",
     "tags":[  
       "gnu",
       "textutils"
     ],
     "templatePath":"/wrapper.sh",
     "testPath":"/wrapper.sh",
     "uuid":"0001402162152914-5056a550b8-0001-005",
     "version":"1.00",
     "_links":{  
       "executionSystem":{  
         "href":"https://public.tenants.agaveapi.co/systems/v2/condor.opensciencegrid.org"
       },
       "metadata":{  
         "href":"https://public.tenants.agaveapi.co/meta/v2/data/?q={\"associationIds\":\"0001402162152914-5056a550b8-0001-005\"}"
       },
       "owner":{  
         "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan"
       },
       "permissions":{  
         "href":"https://public.tenants.agaveapi.co/apps/v2/wc-osg-1.00u1/pems"
       },
       "self":{  
         "href":"https://public.tenants.agaveapi.co/apps/v2/wc-osg-1.00u1"
       },
       "storageSystem":{  
         "href":"https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
       }
     }
   }

Appending an app's id to the above commands will give the full app description. Let's look at the ``wc-osg-1.00u1`` app as an example.

The the important fields to notice in the repsonse are ``id``\ , ``inputs``\ , ``parameters``\ , and ``executionSystem``.


* ``id``\ : The unique id of the app. App ids are made up of a name separated by a version number. Public apps also have the revision number appended to the id to distinguish their changes over time.
* ``inputs``\ : a JSON array of objects describing the input files needed to run this app. 
  ** ``inputs.id``\ : the input id, which is the attribute name that will be used when specifying this input in a job request. ** ``inputs.details.label``\ : a short description of what this input field represents in terms of the app 
  ** ``inputs.value.required``\ : a boolean value indicating whether this value is required to submit a job request. ** ``inputs.value.validator``\ : a Perl regular expression used to validate this field value in a job request. 
* ``parameters``\ : a JSON array of objects describing the parameters needed to run this app.
  ** ``parameters.id``\ : the input id, which is the attribute name that will be used when specifying this input in a job request. ** ``parameters.details.label``\ : a short description of what this parameter represents in terms of the app 
  ** ``parameters.value.type``\ : the primary type assigned to this parameter. This determines what kind of value you pass for this parameter in a job request. Possible values are string, number, bool, flag, and enum. ** ``parameters.value.required``\ : a boolean value indicating whether this parameter is required to submit a job request. 
  ** ``parameters.value.validator``\ : a Perl regular expression used to validate this parameter value in a job request. Any parameter-specific validation will occur after the value's primary type is validated.  
* ``executionSystem``\ : the system on which this app code will run. You don't actually need to know this to run a job with this app, but it's helpful in case you need/want to debug at some point. 

Next Steps
----------

Now that you understand how to find an app and how to identify the inputs and parameters needed in a job request, we can move on to the next lesson on :raw-html-m2r:`<a href="http://agaveapi.co/documentation/beginners-guides/running-a-simulation/" title="Running a Simulation">Running a Simulation</a>`.
