.. role:: raw-html-m2r(raw)
   :format: html


In the previous lesson on :raw-html-m2r:`<a title="App Discovery" href="http://agaveapi.co/documentation/beginners-guides/app-discovery/">Discovering Apps</a>`\ , we learned how to identify the inputs and parameters needed to run an app from its app description. Using that knowledge, we can craft a JSON description of our public app, ``wc-osg-1.00u1``.

.. code-block:: javascript

   {
   "name":"wordcount demo",
   "appId":"wc-osg-1.00u1",
   "inputs":{
   "query1":"agave://data.agaveapi.co/systest/picksumipsum.txt"
   },
   "parameters": {},
   "notifications":[
   {
   "url":"http://postbin.agaveapi.co/ad3a9dz?job_status=${JOB_STATUS}&amp;job_id=${JOB_ID}",
   "event":"*",
   "persistent":true
   }
   ]
   }

You should recognize the attributes in this object from the app description in the :raw-html-m2r:`<a title="App Discovery" href="http://agaveapi.co/documentation/beginners-guides/app-discovery/">Discovering Apps</a>` guide. Additionally we add two new attributes: ``name`` and ``notifications``. The ``name`` attribute is a mandatory descriptive name for the job. The ``notifications`` attribute is an optional array of notification objects used to send you alerts of various job events. We cover notifications more in a couple sections.

Submitting a job request
------------------------

Running a job is simply a matter of sending a POST request to the Jobs service with a JSON description, like the one above, of your job.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST --data &#039;&#039; https://public.tenants.agaveapi.co/jobs/v2

.. code-block:: plaintext

   jobs-submit -v -F submit.json

Submitting this job description will return a JSON object with a full description of the job including all the default, hidden, and global parameters used.

.. code-block:: javascript

   {
   "appId": "wc-osg-1.00u1",
   "archive": true,
   "archivePath": "systest/archive/jobs/job-0001409784588509-5056a550b8-0001-007",
   "archiveSystem": "data.agaveapi.co",
   "batchQueue": "condorqueue",
   "endTime": null,
   "executionSystem": "condor.opensciencegrid.org",
   "id": "0001409784588509-5056a550b8-0001-007",
   "inputs": {
   "query1": "agave://data.agaveapi.co/systest/picksumipsum.txt"
   },
   "localId": null,
   "maxRunTime": "999:59:59",
   "memoryPerNode": 2.0,
   "name": "wordcount demo",
   "nodeCount": 1,
   "outputPath": null,
   "owner": "systest",
   "parameters": {},
   "processorsPerNode": 1,
   "retries": 0,
   "startTime": null,
   "status": "PENDING",
   "submitTime": "2014-09-03T17:49:48.568-05:00",
   "_links": {
   "app": {
   "href": "https://public.tenants.agaveapi.co/apps/v2/wc-osg-1.00u1"
   },
   "archiveData": {
   "href": "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/listings"
   },
   "archiveSystem": {
   "href": "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "executionSystem": {
   "href": "https://public.tenants.agaveapi.co/systems/v2/condor.opensciencegrid.org"
   },
   "history": {
   "href": "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/history"
   },
   "metadata": {
   "href": "https://public.tenants.agaveapi.co/meta/v2/data/?q={\"associationIds\":\"0001409784588509-5056a550b8-0001-007\"}"
   },
   "notifications": {
   "href": "https://public.tenants.agaveapi.co/notifications/v2/?associatedUuid=0001409784588509-5056a550b8-0001-007"
   },
   "owner": {
   "href": "https://public.tenants.agaveapi.co/profiles/v2/systest"
   },
   "permissions": {
   "href": "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/pems"
   },
   "self": {
   "href": "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }

Monitoring your job
-------------------

Throughput on the OSG Condor pool, where this job is running, is generally pretty quick. However, depending on several factors out of our control, this can take a bit of time to complete. You can following the status of the job either by adding a ``-W`` argument to the ``jobs-submit`` command or querying the status of the job using the ``jobs-status`` command. An example is shown below.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/status

.. code-block::


   ```plaintext
   jobs-status -v 0001409784588509-5056a550b8-0001-007

The response will be an abbreviated JSON object containing just the status of the job.

.. code-block:: javascript

   {
   "id": "0001409784588509-5056a550b8-0001-007",
   "status": "FINISHED",
   "_links": {
   "self": {
   "href": "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }

Job notifications
-----------------

When we described our job in the first section, we pointed out a ``notifications`` attribute. The preferred way to track the status of your jobs is to subscribe to receive asynchronous notifications on job events of interest such as FINISHED, RUNNING, and FAILED. In our job request above, we used the wildcard event ``"*"`` to indicate that we want to receive notifications about every event that occurs in our job's lifecycle. We provide a url where the notification should be sent, and we specify that we want the notification to persist between invocations rather than expire the first time it is sent.

.. code-block:: javascript

   {
   "url":"http://agaveapi.co/requestbin/ad3a9dz?job_status=${JOB_STATUS}&amp;job_id=${JOB_ID}",
   "event":"*",
   "persistent":true
   }

Agave supports two kinds of notifications: :raw-html-m2r:`<a title="Webhooks" href="http://webhooks.org" target="_blank">webhooks</a>` and email. In the job notification we created, we specified a webhook. Webhooks are just HTTP endpoints that will receive a POST from Agave's Notification service when the desired event occurs. Agave supports a rich set of template variables that allow you to craft informative, custom URLS to suite your particular application needs. Our URL will be resolved at run time to include the job's id, ``${JOB_ID}``\ , and status, ``${JOB_STATUS}`` before being called.


.. raw:: html

   <aside class="notice">There are several good services available online for testing webhooks. Runscope's <a title="Request Bin by Runscope" href="http://requestb.in" target="_blank">RequestBin</a> is a good, free hosted service. A simple, self-hosted node listener is available <a href="https://github.com/deardooley/node-http-post-listener">here</a>. You can also create a <a title="Agave Request Bin" href="http://requestbin.agaveapi.co" target="_blank">request bin</a> on this site to use in your development.</aside>


Job history
-----------

As with the Files service, Agave keeps a complete history of all activity related to your jobs. You can access this provenance trail through the job history.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/history

.. code-block:: plaintext

   jobs-history -v 0001409784588509-5056a550b8-0001-007

The response will be a JSON array of events related to the job. At this point we've simply submitted the job and let it run to completion. If we share the job with out colleagues, resubmit it, or want to watch it progress in real time, we will see those events show up in the job's history.

.. code-block:: javascript

   [
   {
   "created": "2014-09-03T17:49:48.000-05:00",
   "description": "Job accepted and queued for submission.",
   "status": "PENDING"
   },
   {
   "created": "2014-09-03T17:49:50.000-05:00",
   "description": "Attempt 1 to stage job inputs",
   "status": "PROCESSING_INPUTS"
   },
   {
   "created": "2014-09-03T17:49:51.000-05:00",
   "description": "Identifying input files for staging",
   "status": "PROCESSING_INPUTS"
   },
   {
   "created": "2014-09-03T17:49:51.000-05:00",
   "description": "Staging agave://data.agaveapi.co/systest/picksumipsum.txt to remote job directory",
   "status": "STAGING_INPUTS"
   },
   {
   "created": "2014-09-03T17:49:51.000-05:00",
   "description": "Copy in progress",
   "progress": {
   "averageRate": 3235,
   "source": "agave://data.agaveapi.co/systest/picksumipsum.txt",
   "totalActiveTransfers": 0,
   "totalBytes": 3235,
   "totalBytesTransferred": 3235,
   "totalFiles": 1
   },
   "status": "STAGING_INPUTS"
   },
   {
   "created": "2014-09-03T17:49:53.000-05:00",
   "description": "Job inputs staged to execution system",
   "status": "STAGED"
   },
   {
   "created": "2014-09-03T17:49:54.000-05:00",
   "description": "Preparing job for submission.",
   "status": "SUBMITTING"
   },
   {
   "created": "2014-09-03T17:49:54.000-05:00",
   "description": "Attempt 1 to submit job",
   "status": "SUBMITTING"
   },
   {
   "created": "2014-09-03T17:50:28.000-05:00",
   "description": "Condor job successfully placed into queue",
   "status": "QUEUED"
   },
   {
   "created": "2014-09-03T17:50:39.000-05:00",
   "description": "Job started running",
   "status": "RUNNING"
   },
   {
   "created": "2014-09-03T17:51:01.000-05:00",
   "description": "Job completion detected by Condor monitor.",
   "status": "CLEANING_UP"
   },
   {
   "created": "2014-09-03T17:51:02.000-05:00",
   "description": "Beginning to archive output.",
   "status": "ARCHIVING"
   },
   {
   "created": "2014-09-03T17:51:02.000-05:00",
   "description": "Attempt 1 to archive job output",
   "status": "ARCHIVING"
   },
   {
   "created": "2014-09-03T17:51:02.000-05:00",
   "description": "Transferring job output to archive system",
   "status": "ARCHIVING"
   },
   {
   "created": "2014-09-03T17:51:03.000-05:00",
   "description": "Archiving agave://condor.opensciencegrid.org//condor/scratch/systest/job-0001409784588509-5056a550b8-0001-007-wordcount-demo to agave://data.agaveapi.co/systest/archive/jobs/job-0001409784588509-5056a550b8-0001-007",
   "progress": {
   "averageRate": 0,
   "source": "agave://condor.opensciencegrid.org//condor/scratch/systest/job-0001409784588509-5056a550b8-0001-007-wordcount-demo",
   "totalActiveTransfers": 1,
   "totalBytes": 7514,
   "totalBytesTransferred": 7514,
   "totalFiles": 8
   },
   "status": "ARCHIVING"
   },
   {
   "created": "2014-09-03T17:51:20.000-05:00",
   "description": "Job archiving completed successfully.",
   "status": "ARCHIVING_FINISHED"
   },
   {
   "created": "2014-09-03T17:51:22.000-05:00",
   "description": "Job complete",
   "status": "FINISHED"
   }
   ]


.. raw:: html

   <aside class="notice">In each job's history you will see every event that occurs during the job's lifetime. This includes data movement. The job history is a good place to track the progress of the job's data movement before and after a job runs.</aside>


Note that data produced from the job will be archived by default to your public storage system. Input files are not archived. If you do not want the job output data archived, specify ``archive: false`` in your job request JSON and all job data will remain in the original work directory. You will still be able to access this data using the ``jobs-output`` command described next.

Job output
----------

Now that your job has completed, you will probably want to retrieve the output. We could use the Files service for this, but let's look at how to interact with job data through the job output API.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/listing

.. code-block:: plaintext

   jobs-output -v 0001409784588509-5056a550b8-0001-007

The response will be a JSON array of file objects identical to that returned from the Files service. The array will contain the contents of our job's work directory. You can dive deeper into subfolders simply by appending the relative path to the curl URL or to the CLI using the ``-P`` or ``--path`` argument.

.. code-block:: javascript

   [
   {
   "name" : "condorSubmit",
   "path" : "/condorSubmit",
   "lastModified" : "2014-09-03T17:51:05.000-05:00",
   "length" : 310,
   "permission" : "NONE",
   "mimeType" : "application/octet-stream",
   "format" : "unknown",
   "type" : "file",
   "_links" : {
   "self" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/condorSubmit"
   },
   "system" : {
   "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "parent" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }, {
   "name" : "job.err",
   "path" : "/job.err",
   "lastModified" : "2014-09-03T17:51:07.000-05:00",
   "length" : 104,
   "permission" : "NONE",
   "mimeType" : "application/octet-stream",
   "format" : "unknown",
   "type" : "file",
   "_links" : {
   "self" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/job.err"
   },
   "system" : {
   "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "parent" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }, {
   "name" : "job.out",
   "path" : "/job.out",
   "lastModified" : "2014-09-03T17:51:09.000-05:00",
   "length" : 100,
   "permission" : "NONE",
   "mimeType" : "application/octet-stream",
   "format" : "unknown",
   "type" : "file",
   "_links" : {
   "self" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/job.out"
   },
   "system" : {
   "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "parent" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }, {
   "name" : "output.txt",
   "path" : "/output.txt",
   "lastModified" : "2014-09-03T17:51:12.000-05:00",
   "length" : 20,
   "permission" : "NONE",
   "mimeType" : "text/plain",
   "format" : "unknown",
   "type" : "file",
   "_links" : {
   "self" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/output.txt"
   },
   "system" : {
   "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "parent" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }, {
   "name" : "picksumipsum.txt",
   "path" : "/picksumipsum.txt",
   "lastModified" : "2014-09-03T17:51:14.000-05:00",
   "length" : 3235,
   "permission" : "NONE",
   "mimeType" : "text/plain",
   "format" : "unknown",
   "type" : "file",
   "_links" : {
   "self" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/picksumipsum.txt"
   },
   "system" : {
   "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "parent" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }, {
   "name" : "runtime.log",
   "path" : "/runtime.log",
   "lastModified" : "2014-09-03T17:51:16.000-05:00",
   "length" : 1007,
   "permission" : "NONE",
   "mimeType" : "application/octet-stream",
   "format" : "unknown",
   "type" : "file",
   "_links" : {
   "self" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/runtime.log"
   },
   "system" : {
   "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "parent" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }, {
   "name" : "transfer.tar.gz",
   "path" : "/transfer.tar.gz",
   "lastModified" : "2014-09-03T17:51:19.000-05:00",
   "length" : 2738,
   "permission" : "NONE",
   "mimeType" : "application/octet-stream",
   "format" : "unknown",
   "type" : "file",
   "_links" : {
   "self" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/transfer.tar.gz"
   },
   "system" : {
   "href" : "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
   },
   "parent" : {
   "href" : "https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007"
   }
   }
   }
   ]

Downloading job data is just as easy and uses the same conventions from the Files service.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/jobs/v2/0001409784588509-5056a550b8-0001-007/outputs/media/output.txt

.. code-block:: plaintext

   jobs-output -D -P output.txt 0001409784588509-5056a550b8-0001-007

HTTP isn't the best way to download directories, so if you need to pull down your entire job directory, try using the ``files-get`` command in the CLI. Alternatively, if you need to move your job output to another system you've registered in Agave, you can have Agave transfer the entire directory for you.
