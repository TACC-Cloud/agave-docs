.. role:: raw-html-m2r(raw)
   :format: html


Overview
--------

In the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/" title="App Management Tutorial">App Management Tutorial</a>` you learned about how to register apps for your own personal use and share them with other users to enable collaborative research. In this section, we will learn about the concept of app publication and what it means to promote an app into the public space.

In addition to traditional permissions, Tapis (Agave) also has a concept of scope. By default, every app you personally register with Agave has a private scope. For individual users, this is usually sufficient for all your needs. At an organizational level, however, it is a very common requirement to provide a curated collection of apps that are publicly available to everyone. Such a collection of apps would reside in the public scope. The process of moving an app from the (default) private scope into the public scope is called :raw-html-m2r:`<strong><em>publishing</em></strong>`.

Implications of publishing an app :raw-html-m2r:`<a name="implications-of-publishing-an-app">&nbsp;</a>`
------------------------------------------------------------------------------------------------------------

As you can imagine, publishing an app gives it much greater exposure and results in increased usage by the user community. It also comes with increased responsibilities for the original owner as well as the API administrators.

Public apps must run on public systems.
"""""""""""""""""""""""""""""""""""""""

In order to ensure that all users can actually use the app after it is published, it must have a public system specified as the ``executionSystem``. This ensures that the app will perform consistently for anyone who uses it. It also means that publishing an app carries with it a cost in terms of resource consumption.

Publishing an app can only be done by tenant admins
"""""""""""""""""""""""""""""""""""""""""""""""""""

Because of the requirement that public apps run on public systems, apps may only be published by tenant admins. This allows them to vet each app for performance, reliability, and security prior to opening it up to the broader community. In most situation this simply involves emailing your admin and asking them to publish the app, but policy can vary from tenant to tenant, so check with your tenant administrators for specifics.

Public apps maintain the original author as point of contact
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Creating and registering an app that can be used by the community at large is a tremendous contribution in and of itself. Your contribution can go on to help thousands of other users stay focused on their science rather than their computational needs. Once your app is published, your name will remain as the acknowledged "owner" of the app. This allows you to receive attribute for your contribution to the field as well as provide an additional point of contact for support. The degree to which you are expected to actually address support issues related to the published app is a matter of policy laid out by your tenant administrators. Generally speaking, you won't be expected to do much more than address scientifically based questions on the mailing list and/or forums about the inner workings of the app.

Publication lifecycle
---------------------

The publication lifecycle begins after an app is already registered.

Validate your app works
"""""""""""""""""""""""

Once you have a working app that you have verified runs correctly, you contact your tenant admins requesting the app be published. Hopefully you cloned the public system and used your own personal account on that system to verify the app performance. If not, you will need to work with the admins to ensure it works as intended on the public system.

Admins create a public version of the app :raw-html-m2r:`<a name="admins-create-a-public-version-of-the-app">&nbsp;</a>`
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Once the app is vetted, your tenant admins will tell Tapis (Agave) to publish the app. This can be done with a single call the the Apps API. An example of publishing the ``demo-pyplot-demo-advanced-0.1.0`` app from our :raw-html-m2r:`<a href="#registering-an-app" title="App Regisration Guide">App Registration Guide</a>` is shown below.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X PUT -d "action=publish" https://public.tenants.agaveapi.co/apps/v2/wc-1.00?pretty=true

.. code-block:: plaintext

   apps-publish -v wc-1.00

.. code-block:: json

   {
     "status" : "success",
     "message" : null,
     "version" : "2.1.0-rc424a",
     "result" : {
       "id" : "demo-pyplot-demo-advanced-0.1.0u1",
       "name" : "demo-pyplot-demo-advanced",
       "icon" : null,
       "uuid" : "0001414144637043-5056a550b8-0001-005",
       "parallelism" : "SERIAL",
       "defaultProcessorsPerNode" : 1,
       "defaultMemoryPerNode" : 1,
       "defaultNodeCount" : 1,
       "defaultMaxRunTime" : null,
       "defaultQueue" : "debug",
       "version" : "0.1.0",
       "revision" : 1,
       "isPublic" : true,
       "helpURI" : null,
       "label" : "PyPlot Demo Advanced",
       "shortDescription" : "Advanced demo plotting app",
       "longDescription" : "Advanced demo app to create a graph using Python",
       "tags" : [ "python", "demo", "plotting", "tutorial" ],
       "ontology" : [],
       "executionType" : "CLI",
       "executionSystem" : "docker.iplantcollaborative.org",
       "deploymentPath" : "/api/v2/apps/demo-pyplot-demo-advanced-0.1.0u1.zip",
       "deploymentSystem" : "data.agaveapi.co",
       "templatePath" : "wrapper.sh",
       "testPath" : "test/test.sh",
       "checkpointable" : false,
       "lastModified" : "2014-10-24T04:57:17.000-05:00",
       "modules" : [ ],
       "available" : true,
       "inputs" : [ {
         "id" : "dataset",
         "value" : {
           "validator" : "([^s]+(.(?i)(zip|gz|tgz|tar.gz|bz2|rar|csv))$)",
           "visible" : true,
           "required" : true,
           "order" : 0,
           "enquote" : false,
           "default" : [ "agave://demo.storage.example.com/api_sample_user/inputs/pyplot/testdata.csv" ]
         },
         "details" : {
           "label" : "Dataset",
           "description" : "The dataset to plot",
           "argument" : null,
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 1,
           "maxCardinality" : -1,
           "ontology" : [ "http://sswapmeet.sswap.info/mime/text/Csv", "http://sswapmeet.sswap.info/mime/text/Zip", "http://sswapmeet.sswap.info/mime/text/Tar", "http://sswapmeet.sswap.info/mime/text/Bzip", "http://sswapmeet.sswap.info/mime/text/Rar" ],
           "fileTypes" : [ "csv-0", "zip-0", "tar-0", "tgz-0", "bz-2", "rar-0" ]
         }
       } ],
       "parameters" : [ {
         "id" : "showYLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show y-axis label?",
           "description" : "Select whether a label will be shown on the y axis",
           "argument" : "--show-y-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "unpackInputs",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : null
         },
         "details" : {
           "label" : "Unpack input(s)",
           "description" : "If true, any compressed input files will be expanded prior to execution on the remote system.",
           "argument" : "1",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "showLegend",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--show-legend",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "width",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 1024,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart width",
           "description" : "The width in pixels of each chart",
           "argument" : "--width=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "chartType",
         "value" : {
           "visible" : true,
           "required" : true,
           "type" : "enumeration",
           "order" : 0,
           "enquote" : false,
           "default" : "line",
           "enum_values" : [ {
             "bar" : "Bar Chart"
           }, {
             "line" : "Line Chart"
           } ]
         },
         "details" : {
           "label" : "Chart types",
           "description" : "Select one or more chart types to generate for each dataset",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:enumeration", "xs:string" ]
         }
       }, {
         "id" : "showXLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show x-axis label?",
           "description" : "Select whether a label will be shown on the x axis",
           "argument" : "--show-x-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "xlabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Time",
           "validator" : ""
         },
         "details" : {
           "label" : "X-axis label",
           "description" : "Label to display below the x-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "ylabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Magnitude",
           "validator" : ""
         },
         "details" : {
           "label" : "Y-axis label",
           "description" : "Label to display below the y-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "background",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "#FFFFFF",
           "validator" : "^#(?:[0-9a-fA-F]{6}){1}$"
         },
         "details" : {
           "label" : "Background color",
           "description" : "The hexadecimal background color of the charts. White by default",
           "argument" : "--background=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "height",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 512,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart height",
           "description" : "The height in pixels of each chart",
           "argument" : "--height=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "separateCharts",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--file-per-series",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       } ],
       "outputs" : [ ],
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u1"
         },
         "executionSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/docker.iplantcollaborative.org"
         },
         "storageSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
         },
         "owner" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/api_sample_user"
         },
         "permissions" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u1/pems"
         },
         "metadata" : {
           "href" : "https://public.tenants.agaveapi.co/meta/v2/data/?q={\\"associationIds\\":\\"0001414144637043-5056a550b8-0001-005\\"}"
         }
       }
     }
   }

Notice a few things about the response above. First, a new app was created. Our existing private app is still available and in place, however we now have a new app, ``demo-pyplot-demo-advanced-0.1.0u1`` with its own id. We should also point out that the id structure of public apps is different than that of private apps. In this example, the newly published app has a ``u1`` appended to the end of the private app id. The ``u1`` refers to the revision number of the public app. This is rest to 1 the first time you publish an app. Unlike private apps which can be updated over and over again without chagning the canonical URL, the canonical URL for public apps changes ever time the app is updated. This ensures that the behavior of an app never change. You can be assured that as long as a public app is available, it will always behave the same.

Second, notice that the ``deploymentPath`` has changed. Previously the app's assets were hosted out of a folder on the user's private storage system. Now, the ``deploymentPath`` points to a zip archive off the root of a public storage system. The location where public app archives are stored is determined by the ``system.storage.publicAppsDir`` value of the public ``deploymentSystem``. By default, if no value is provided, Tapis (Agave) will attempt to store the archive in ``/api/v2/apps``. If this folder does not exist and cannot be created, then publication will fail.


.. raw:: html

   <aside class="notice">When an app is published, a zip archive is created of the private apps's <span class="code">deploymentPath</span> and coped to the public apps directory of the <span> class="code">deploymentSystem</span>. 
   </aside>


This is an important point. The new public app record is updated to reflect the new storage location and a checksum of the zipped archive is saved. Every time the app is run, the checksum is validated, the archive is unzipped, and the app is run exactly as before. If at any time, the checksum of the zipped archive does not match the recorded value, the app is disabled and the tenant administrators are notified. As a design decision, public apps are disabled if their data or behavior becomes compromised. Because of this, you can be assured that when you use a public app, the results will always be consistent.

Third, notice that the ``executionSystem`` has been updated to point to the public system, and lastly, notice that the app has a new UUID.

Admins update a public app
""""""""""""""""""""""""""

It is not uncommon for the need to arise where you realize you need to update an app. This happens often when a bug is detected or the default values need to change. In this situation, you simply update your private app just as you did before, then ask your tenant admins to republish the app. An example is given below where we change the default value of the ``dataset`` input attribute to point to a file on a publicly available storage system.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X PUT -d "action=publish" https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0?pretty=true

.. code-block:: plaintext

   apps-publish -v demo-pyplot-demo-advanced-0.1.0

.. code-block:: json

   {
     "status" : "success",
     "message" : null,
     "version" : "2.1.0-rc424a",
     "result" : {
       "id" : "demo-pyplot-demo-advanced-0.1.0u1",
       "name" : "demo-pyplot-demo-advanced",
       "icon" : null,
       "uuid" : "0001414144632114-5056a550b8-0001-005",
       "parallelism" : "SERIAL",
       "defaultProcessorsPerNode" : 1,
       "defaultMemoryPerNode" : 1,
       "defaultNodeCount" : 1,
       "defaultMaxRunTime" : null,
       "defaultQueue" : "debug",
       "version" : "0.1.0",
       "revision" : 2,
       "isPublic" : true,
       "helpURI" : null,
       "label" : "PyPlot Demo Advanced",
       "shortDescription" : "Advanced demo plotting app",
       "longDescription" : "Advanced demo app to create a graph using Python",
       "tags" : [ "python", "demo", "plotting", "tutorial" ],
       "ontology" : [ "" ],
       "executionType" : "CLI",
       "executionSystem" : "docker.iplantcollaborative.org",
       "deploymentPath" : "/api/v2/apps/demo-pyplot-demo-advanced-0.1.0u2.zip",
       "deploymentSystem" : "data.agaveapi.co",
       "templatePath" : "wrapper.sh",
       "testPath" : "test/test.sh",
       "checkpointable" : false,
       "lastModified" : "2014-10-24T04:57:17.000-05:00",
       "modules" : [ ],
       "available" : true,
       "inputs" : [ {
         "id" : "dataset",
         "value" : {
           "validator" : "([^s]+(.(?i)(zip|gz|tgz|tar.gz|bz2|rar|csv))$)",
           "visible" : true,
           "required" : true,
           "order" : 0,
           "enquote" : false,
           "default" : [ "agave://data.agaveapi.co/datasets/tutorials/apps/demo-pyplot-demo-advanced-0.1.0/testdata.csv" ]
         },
         "details" : {
           "label" : "Dataset",
           "description" : "The dataset to plot",
           "argument" : null,
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 1,
           "maxCardinality" : -1,
           "ontology" : [ "http://sswapmeet.sswap.info/mime/text/Csv", "http://sswapmeet.sswap.info/mime/text/Zip", "http://sswapmeet.sswap.info/mime/text/Tar", "http://sswapmeet.sswap.info/mime/text/Bzip", "http://sswapmeet.sswap.info/mime/text/Rar" ],
           "fileTypes" : [ "csv-0", "zip-0", "tar-0", "tgz-0", "bz-2", "rar-0" ]
         }
       } ],
       "parameters" : [ {
         "id" : "showYLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show y-axis label?",
           "description" : "Select whether a label will be shown on the y axis",
           "argument" : "--show-y-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "unpackInputs",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : null
         },
         "details" : {
           "label" : "Unpack input(s)",
           "description" : "If true, any compressed input files will be expanded prior to execution on the remote system.",
           "argument" : "1",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "showLegend",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--show-legend",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "width",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 1024,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart width",
           "description" : "The width in pixels of each chart",
           "argument" : "--width=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "chartType",
         "value" : {
           "visible" : true,
           "required" : true,
           "type" : "enumeration",
           "order" : 0,
           "enquote" : false,
           "default" : "line",
           "enum_values" : [ {
             "bar" : "Bar Chart"
           }, {
             "line" : "Line Chart"
           } ]
         },
         "details" : {
           "label" : "Chart types",
           "description" : "Select one or more chart types to generate for each dataset",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:enumeration", "xs:string" ]
         }
       }, {
         "id" : "showXLabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : true,
           "validator" : ""
         },
         "details" : {
           "label" : "Show x-axis label?",
           "description" : "Select whether a label will be shown on the x axis",
           "argument" : "--show-x-label",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       }, {
         "id" : "xlabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Time",
           "validator" : ""
         },
         "details" : {
           "label" : "X-axis label",
           "description" : "Label to display below the x-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "ylabel",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "Magnitude",
           "validator" : ""
         },
         "details" : {
           "label" : "Y-axis label",
           "description" : "Label to display below the y-axis",
           "argument" : "",
           "showArgument" : false,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "background",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "string",
           "order" : 0,
           "enquote" : false,
           "default" : "#FFFFFF",
           "validator" : "^#(?:[0-9a-fA-F]{6}){1}$"
         },
         "details" : {
           "label" : "Background color",
           "description" : "The hexadecimal background color of the charts. White by default",
           "argument" : "--background=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:string" ]
         }
       }, {
         "id" : "height",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "number",
           "order" : 0,
           "enquote" : false,
           "default" : 512,
           "validator" : "d+"
         },
         "details" : {
           "label" : "Chart height",
           "description" : "The height in pixels of each chart",
           "argument" : "--height=",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:integer" ]
         }
       }, {
         "id" : "separateCharts",
         "value" : {
           "visible" : true,
           "required" : false,
           "type" : "flag",
           "order" : 0,
           "enquote" : false,
           "default" : false,
           "validator" : ""
         },
         "details" : {
           "label" : "Extract the first k bytes",
           "description" : "Select whether to include a legend in each chart",
           "argument" : "--file-per-series",
           "showArgument" : true,
           "repeatArgument" : false
         },
         "semantics" : {
           "minCardinality" : 0,
           "maxCardinality" : 1,
           "ontology" : [ "xs:boolean" ]
         }
       } ],
       "outputs" : [ ],
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u2"
         },
         "executionSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/docker.iplantcollaborative.org"
         },
         "storageSystem" : {
           "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
         },
         "owner" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/api_sample_user"
         },
         "permissions" : {
           "href" : "https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u2/pems"
         },
         "metadata" : {
           "href" : "https://public.tenants.agaveapi.co/meta/v2/data/?q={"associationIds":"0001414144632114-5056a550b8-0001-005"}"
         }
       }
     }
   }

Notice that both the revision number and app id changed after publication. Now, if we were to query the Apps service, we would see both ``demo-pyplot-demo-advanced-0.1.0u1`` and ``demo-pyplot-demo-advanced-0.1.0u2`` present.


.. raw:: html

   <aside class="warning">Republishing an app creates a new app with incremented revision number. It does **not** delete the previous app.
   </aside>


It is up to you to set the policy in place dealing with how you choose to retire public apps.

Also notice that the ``deploymentPath`` for the new app has changed. Every time an app is published, a new snapshot of the private app's assets is archived, checksummed, and stored on the public system. Again, this guarantees that each app is independent of the previous one and can be counted on to behave consistently over time.

Deleting a public app
"""""""""""""""""""""

..

   Delete a public app  

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/apps/v2/demo-pyplot-demo-advanced-0.1.0u1


.. code-block:: plaintext

   apps-delete demo-pyplot-demo-advanced-0.1.0u1

..

   This will result in an empty success response


As with private apps, public apps can be removed by issuing a DELETE request on the app's URL. Tenant admin permissions are required to delete public apps.
