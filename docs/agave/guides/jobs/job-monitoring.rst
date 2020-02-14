.. role:: raw-html-m2r(raw)
   :format: html


Job monitoring
==============

Once you submit your job request, the job will be handed off to Tapis's back end execution service. Your job may run right away, or it may wait in a batch queue on the execution system until the required resources are available. Either way, the execution process occurs completely asynchronous to the submission process. To monitor the status of your job, Tapis supports two different mechanisms: polling and webhooks.

..

   :information_source: For the sake of brevity, we placed a detailed explanation of the job lifecycle in a separate, aptly title post, :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/jobs/the-job-lifecycle.html" title="The Job Lifecycle">The Job Lifecycle</a>`. There you will find detailed information about how, when, and why everything moves from place to place and how you can peek behind the curtains.


Polling
-------

If you have ever taken a long road trip with children, you are probably painfully aware of how polling works. Starting several minutes from the time you leave the house, a child asks, "Are we there yet? You reply, "No." Several minutes later the child again asks, "Are we there yet?" You again reply, "No." This process continues until you finally arrive at your destination. :raw-html-m2r:`<strong>This is called polling and polling is bad</strong>`

Polling for your job status works the same way. After submitting your job, you start a while loop that queries the Jobs service for your job status until it detects that the job is in a terminal state. The following two URLs both return the status of your job. The first will result in a list of abbreviated job descriptions, the second will result in a full description of the job with the given $JOB_ID, exactly like that returned when submitting the job. The third will result in a much smaller response object that contains only the $JOB_ID and status being returned.

.. code-block::

   jobs-list -v
   jobs-list -v $JOB_ID
   jobs-list $JOB_ID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" https://agave.iplantc.org/jobs/v2/?pretty=true
        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" https://agave.iplantc.org/jobs/v2/$JOB_ID
        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" https://agave.iplantc.org/jobs/v2/$JOB_ID/status
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "id" : "$JOB_ID",
        "name" : "$USERNAME-$APP_ID",
        "owner" : "$USERNAME",
        "appId" : "$APP_ID",
        "executionSystem" : "$PUBLIC_EXECUTION_SYSTEM",
        "batchQueue": "normal",
        "nodeCount": 1,
        "processorsPerNode": 16,
        "memoryPerNode": 32,
        "maxRunTime": "01:00:00",
        "archive": false,
        "retries": 0,
        "localId": "659413",
        "created": "2018-01-26T15:08:02.000-06:00",
        "lastUpdated": "2018-01-26T15:09:55.000-06:00",
        "outputPath": "$USERNAME/$JOB_ID-$APP_ID",
        "status": "FINISHED",
        "submitTime": "2018-01-26T15:09:45.000-06:00",
        "startTime": "2018-01-26T15:09:53.000-06:00",
        "endTime": "2018-01-26T15:09:55.000-06:00",
        "inputs": {
          "inputBam": [
            "agave://data.iplantcollaborative.org/shared/iplantcollaborative/example_data/Samtools_mpileup/ex1.bam"
          ]
        },
        "parameters": {
          "nameSort": true,
          "maxMemSort": 800000000
        },
        "_links": {
          "self": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID"
          },
          "app": {
            "href": "https://api.tacc.utexas.edu/apps/v2/$APP_ID"
          },
          "executionSystem": {
            "href": "https://api.tacc.utexas.edu/systems/v2/$PUBLIC_EXECUTION_SYSTEM"
          },
          "archiveSystem": {
            "href": "https://api.tacc.utexas.edu/systems/v2/$PUBLIC_EXECUTION_SYSTEM""
          },
          "archiveData": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/outputs/listings"
          },
          "owner": {
            "href": "https://api.tacc.utexas.edu/profiles/v2/$USERNAME"
          },
          "permissions": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/pems"
          },
          "history": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/history"
          },
          "metadata": {
            "href": "https://api.tacc.utexas.edu/meta/v2/data/?q=%7B%22associationIds%22%3A%22462259152402771480-242ac113-0001-007%22%7D"
          },
          "notifications": {
            "href": "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=$JOB_ID"
          }
        }
        }
|


The list of all possible job statuses is given in table 2.


.. raw:: html

   <table border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Event</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>ACCEPTED</td>
   <td>The job accepted for processing</td>
   </tr>
   <tr>
   <td>PENDING</td>
   <td>The job processing beginning</td>
   </tr>
   <tr>
   <td>PROCESSING_INPUTS</td>
   <td>Identifying input files for staging</td>
   </tr>
   <tr>
   <td>STAGING_INPUTS</td>
   <td>Transferring job input data to execution system</td>
   </tr>
   <tr>
   <td>STAGED</td>
   <td>Job inputs staged to execution system</td>
   </tr>
   <tr>
   <td>STAGING_JOB</td>
   <td>Staging runtime assets to execution system.</td>
   </tr>
   <tr>
   <td>SUBMITTING</td>
   <td>Submitting job to execution system</td>
   </tr>
   <tr>
   <td>QUEUED</td>
   <td>Job queued in execution system queue</td>
   </tr>
   <tr>
   <td>RUNNING</td>
   <td>Job running on execution system</td>
   </tr>
   <tr>
   <td>CLEANING_UP</td>
   <td>Job completed execution</td>
   </tr>
   <tr>
   <td>ARCHIVING</td>
   <td>Transferring job output to archive system</td>
   </tr>
   <tr>
   <td>BLOCKED</td>
   <td>Job blocked</td>
   </tr>
   <tr>
   <td>PAUSED</td>
   <td>Job processing suspended</td>
   </tr>
   <tr>
   <td>FINISHED</td>
   <td>Job completed successfully</td>
   </tr>
   <tr>
   <td>STOPPED</td>
   <td>Job execution intentionally stopped</td>
   </tr>
   <tr>
   <td>FAILED</td>
   <td>Job failed</td>
   </tr>
   </tbody>
   </table>
|


.. raw:: html

   <p class="table-caption">Table 2. Job statuses listed in progressive order from job submission to completion.</p>


Polling is an incredibly effective approach, but it is bad practice for two reasons. First, it does not scale well. Querying for one job status every few seconds does not take much effort, but querying for 100 takes quite a bit of time and puts unnecessary load on Tapis's servers. Second, polling provides what is effectively a binary response. It tells you whether a job is done or not done, it does not give you any information on what is actually going on with the job or where it is in the overall execution process. Subscribing to any job event notification will automatically subscribe you to: `FINISHED`, `STOPPED`, `BLOCKED`, `PAUSED` and `FAILED` notifications.

The job history URL provides much more detailed information on the various state changes, system messages, and progress information associated with data staging. The syntax of the job history URL is as follows:

.. code-block::

   jobs-history -v $JOB_ID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" https://agave.iplantc.org/jobs/v2/$JOB_ID/history?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "status":"success",
        "message":null,
        "version":"2.1.0-r6d11c",
        "result":[
          {
            "created":"2014-10-24T04:47:45.000-05:00",
            "status":"PENDING",
            "description":"Job accepted and queued for submission."
          },
          {
            "created":"2014-10-24T04:47:47.000-05:00",
            "status":"PROCESSING_INPUTS",
            "description":"Attempt 1 to stage job inputs"
          },
          {
            "created":"2014-10-24T04:47:47.000-05:00",
            "status":"PROCESSING_INPUTS",
            "description":"Identifying input files for staging"
          },
          {
            "created":"2014-10-24T04:47:48.000-05:00",
            "status":"STAGING_INPUTS",
            "description":"Staging agave://$PUBLIC_STORAGE_SYSTEM/$API_USERNAME/inputs/pyplot/testdata.csv to remote job directory"
          },
          {
            "progress":{
              "averageRate":0,
              "totalFiles":1,
              "source":"agave://$PUBLIC_STORAGE_SYSTEM/$API_USERNAME/inputs/pyplot/testdata.csv",
              "totalActiveTransfers":0,
              "totalBytes":3212,
              "totalBytesTransferred":3212
            },
            "created":"2014-10-24T04:47:48.000-05:00",
            "status":"STAGING_INPUTS",
            "description":"Copy in progress"
          },
          {
            "created":"2014-10-24T04:47:50.000-05:00",
            "status":"STAGED",
            "description":"Job inputs staged to execution system"
          },
          {
            "created":"2014-10-24T04:47:55.000-05:00",
            "status":"SUBMITTING",
            "description":"Preparing job for submission."
          },
          {
            "created":"2014-10-24T04:47:55.000-05:00",
            "status":"SUBMITTING",
            "description":"Attempt 1 to submit job"
          },
          {
            "created":"2014-10-24T04:48:08.000-05:00",
            "status":"RUNNING",
            "description":"Job started running"
          },
          {
            "created":"2014-10-24T04:48:12.000-05:00",
            "status":"CLEANING_UP"
          },
          {
            "created":"2014-10-24T04:48:15.000-05:00",
            "status":"FINISHED",
            "description":"Job completed. Skipping archiving at user request."
          }
        ]
        }
|


Depending on the nature of your job and the reliability of the underlying systems, the response from this service can grow rather large, so it is important to be aware that this query can be an expensive call for your client application to make. Everything we said before about polling job status applies to polling job history with the additional caveat that you can chew through quite a bit of bandwidth polling this service, so keep that in mind if your application is bandwidth starved.

Often times, however, polling is unavoidable. In these situations, we recommend using an :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/Exponential_backoff" title="Exponential Backoff" target="_blank">exponential backoff</a>` to check job status. An exponential backoff is an alogrithm that increases the time between retries as the number of failures increases.

Webhooks
~~~~~~~~

Webhooks are the alternative, preferred way for your application to monitor the status of asynchronous actions in Tapis. If you are a :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/Design_Patterns_(book)" title="Gang of Four" target="_blank">Gang of Four</a>` disciple, webhooks are a mechanism for implementing the :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/Observer%5Fpattern" title="Observer Pattern" target="_blank">Observer Pattern</a>`. They are widely used across the web and chances are that something you're using right now is leveraging them. In the context of Tapis, a webhook is a URL that you give to Tapis in advance of an event which it later POSTs a response to when that event occurs. A webhook can be any web accessible URL.

..

   :information_source: For more information about webhooks, events, and notifications in Tapis, please see the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/notifications/introduction.html" title="Notifications Guide">Notifications</a>` and :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/events/introduction.html" title="Events Guide">Events</a>` Guides.


The Jobs service provides several template variables for constructing dynamic URLs. Template variables can be included anywhere in your URL by surrounding the variable name in the following manner ``${VARIABLE_NAME}``. When an event of interest occurs, the variables will be resolved and the resulting URL called. Several example urls are given below.

.. code-block::

   http://example.com/?job_id=${JOB_ID}&amp;job_status=${EVENT}

   http://example.com/trigger/job/${JOB_NAME}/${EVENT}

   http://example.com/webhooks/?nonce=sdfkajerouiwe234289fahlkqr&amp;id=${JOB_ID}&amp;status=${EVENT}&amp;start=${JOB_START_TIME}&amp;end=${JOB_END_TIME}&amp;url=${JOB_ARCHIVE_URL}

The full list of template variables are listed in the following table.


.. raw:: html

   <table border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the job</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>JOB_STATUS</td>
   <td>The status of the job at the time the event occurs</td>
   </tr>
   <tr>
   <td>JOB_URL</td>
   <td>The url of the job within the API</td>
   </tr>
   <tr>
   <td>JOB_ID</td>
   <td>The unique id used to reference the job within Tapis.</td>
   </tr>
   <tr>
   <td>JOB_SYSTEM</td>
   <td>ID of the job execution system (ex. ssh.execute.example.com)</td>
   </tr>
   <tr>
   <td>JOB_NAME</td>
   <td>The user-supplied name of the job</td>
   </tr>
   <tr>
   <td>JOB_START_TIME</td>
   <td>The time when the job started running in ISO8601 format.</td>
   </tr>
   <tr>
   <td>JOB_END_TIME</td>
   <td>The time when the job stopped running in ISO8601 format.</td>
   </tr>
   <tr>
   <td>JOB_SUBMIT_TIME</td>
   <td>The time when the job was submitted to Tapis for execution by the user in ISO8601 format.</td>
   </tr>
   <tr>
   <td>JOB_ARCHIVE_PATH</td>
   <td>The path on the archive system where the job output will be staged.</td>
   </tr>
   <tr>
   <td>JOB_ARCHIVE_URL</td>
   <td>The Tapis URL for the archived data.</td>
   </tr>
   <tr>
   <td>JOB_ERROR</td>
   <td>The error message explaining why a job failed. Null if completed successfully.</td>
   </tr>
   </tbody>
   </table>
|


.. raw:: html

   <p class="table-caption">Table 3. Template variables available for use when defining webhooks for your job.</p>


Email
-----

In situations where you do not have a persistent web address, or access to a backend service, you may find it more convenient to subscribe for email notifications rather then providing a webhook. Tapis supports email notifications as well. Simply specify a valid email address in the ``url`` field in your job submission notification object and an email will be sent to that address when a relevant event occurs. A sample email message is given below.

.. code-block::

   The status of job 0001414144065563-5056a550b8-0001-007, "demo-pyplot-demo-advanced test-1414139896," has changed to FINISHED.

   Name: demo-pyplot-demo-advanced test-1414139896
   URL: https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007
   Message: Job completed successfully.
   Submit Time: 2014-10-24T04:48:11.000-05:00
   Start Time: 2014-10-24T04:48:08.000-05:0
   End Time: 2014-10-24T04:48:15.000-05:00
   Output Path: $API_USERNAME/archive/jobs/job-0001414144065563-5056a550b8-0001-007
   Output URL: https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs


.. raw:: html

   <!-- ## Websockets

   Websockets are a realtime approach to monitoring where your client application listens on a dedicated channel for notification messages from Tapis. Simply subscribe to Tapis's websocket server ([https://realtime.agaveapi.co](https://realtime.agaveapi.co) and listen for a channel matching the job id.

   ```json
   /agave.prod/$API_USERNAME/$JOB_ID
   ```
   -->

