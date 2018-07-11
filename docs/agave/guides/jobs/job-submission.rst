.. role:: raw-html-m2r(raw)
   :format: html


Job submission
==============

Job submission is a term recycled from shared batch computing environments where a user would submit a request for a unit of computational work (called a Job) to the batch scheduler, then go head home for dinner while waiting for the computer to complete the job they gave it.

Originally the batch scheduler was a person and the term batch came from their ability to process several submissions together. Later on, as human schedulers were replaced by software, the term stuck even though the process remained unchanged. Today the term job submission is essentially unchanged.

A user submits a request for a unit of work to be done. The primary difference is that today, often times, the wait time between submission and execution is considerably less. On shared systems, such as many of the HPC systems originally targeted by Agave, waiting for your job to start is the price you pay for the incredible performance you get once your job starts.

Agave, too, adopts the concept of job submission, though it is not in and of itself a scheduler. In the context of Agave's Job service, the process of running an application registered with the Apps service is referred to as submitting a job.

Unlike in the batch scheduling world where each scheduler has its own job submission syntax and its own idiosyncrasies, the mechanism for submitting a job to Agave is consistent regardless of the application or system on which you run. A HTML form or JSON object are posted to the Jobs service. The submission is validated, and the job is forwarded to the scheduling and execution services for processing.

Because Agave takes an app-centric view of science, execution does not require knowing about the underlying systems on which an application runs. Simply knowing how the parameters and inputs you want to use when running an app is sufficient to define a job. Agave will handle the rest.

As mentioned previously, jobs are submitted by making a HTTP POST request either a HTML form or a JSON object to the Jobs service. All job submissions must include a few mandatory values that are used to define a basic unit of work. Table 1 lists the optional and required attributes of all job submissions.


.. raw:: html

   <table>
   <thead>
   <tr>
   <th>Name</th>
   <th>Value(s)</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>name</td>
   <td>string</td>
   <td>Descriptive name of the job. This will be slugified and used as one component of directory names in certain situations.</td>
   </tr>
   <tr>
   <td>appId</td>
   <td>string</td>
   <td>The unique name of the application being run by this job. This must be a valid application that the calling user has permission to run.</td>
   </tr>
   <tr>
   <td>batchQueue</td>
   <td>string</td>
   <td>The batch queue on the execution system to which this job is submitted. Defaults to the app's defaultQueue property if specified. Otherwise a best-fit algorithm is used to match the job parameters to a queue on the execution system with sufficient capabilities to run the job.</td>
   </tr>
   <tr>
   <td>nodeCount</td>
   <td>integer</td>
   <td>The number of nodes to use when running this job. Defaults to the app's defaultNodes property or 1 if no default is specified.</td>
   </tr>
   <tr>
   <td>processorsPerNode</td>
   <td>integer</td>
   <td>The number of processors this application should utilize while running. Defaults to the app's defaultProcessorsPerNode property or 1 if no default is specified. If the application is not of executionType PARALLEL, this should be 1.</td>
   </tr>
   <tr>
   <td>memoryPerNode</td>
   <td>string</td>
   <td>The maximum amount of memory needed per node for this application to run given in ####.#[E|P|T|G]B format. Defaults to the app's defaultMemoryPerNode property if it exists. GB are assumed if no magnitude is specified.</td>
   </tr>
   <tr>
   <td>maxRunTime</td>
   <td>string</td>
   <td>The estimated compute time needed for this application to complete given in hh:mm:ss format. This value must be less than or equal to the max run time of the queue to which this job is assigned. </td>
   </tr>
   <tr>
   <td>notifications*</td>
   <td>JSON array</td>
   <td>An array of one or more JSON objects describing an event and url which the service will POST to when the given event occurs. For more on Notifications, see the section on webhooks below.</td>
   </tr>
   <tr>
   <td>archive*</td>
   <td>boolean</td>
   <td>Whether the output from this job should be archived. If true, all new files created by this application's execution will be archived to the archivePath in the user's default storage system.</td>
   </tr>
   <tr>
   <td>archiveSystem*</td>
   <td>string</td>
   <td>System to which the job output should be archived. Defaults to the user's default storage system if not specified.</td>
   </tr>
   <tr>
   <td>archivePath*</td>
   <td>string</td>
   <td>Location where the job output should be archived. A relative path or absolute path may be specified. If not specified, a unique folder will be created in the user's home directory of the archiveSystem at 'archive/jobs/job-$JOB_ID'</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p class="table-caption">Table 1. The optional and required attributes common to all job submissions. Optional fields are marked with an astericks.</p>


..

   :information_source: In this tutorial we will use JSON for our examples, however, one could replace the JSON object with a HTML form mapping JSON attribute and values to HTML form attributes and values one for one and get the same results, with the exception of the ``notifications`` attribute which is not accepted using HTML form submission and would need to be added after submitting the job request by sending each of the notification objects with the returned job id to the :raw-html-m2r:`<a href="../notifications/introduction" title="Notification Management Tutorial">Notifications API</a>`.


In addition to the standard fields for all jobs, the application you specify in the ``appId`` field will also have its own set of inputs and parameters specified during registration that are unique to that app. (For more information about app registration and descriptions, see the `Apps section <../apps/introduction>`_\ ).

The following snippet shows a sample JSON job request that could be submitted to the Jobs service to run the ``pyplot-0.1.0`` app. :raw-html-m2r:`<!-- from the <a href="http://agaveapi.co/documentation/tutorials/app-management-tutorial/advanced-app-example/" title="Advanced App Example">Advanced App Example</a> tutorial. -->`

..

   Show JSON job request &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
       "name":"pyplot-demo test",
       "appId":"demo-pyplot-demo-advanced-0.1.0",
       "inputs":{
         "dataset":[
           "agave://$PUBLIC_STORAGE_SYSTEM/$API_USERNAME/inputs/pyplot/testdata.csv",
           "agave://$PUBLIC_STORAGE_SYSTEM/$API_USERNAME/inputs/pyplot/testdata2.csv"
         ]
       },
       "archive":false,
       "parameters":{
         "unpackInputs":false,
         "chartType":[
           "bar",
           "line"
         ],
         "width":1024,
         "height":512,
         "background":"#d96727",
         "showYLabel":true,
         "ylabel":"The Y Axis Label",
         "showXLabel":true,
         "xlabel":"The X Axis Label",
         "showLegend":true,
         "separateCharts":false
       },
       "notifications":[
         {
           "url":"$API_EMAIL",
           "event":"RUNNING"
         },
         {
           "url":"$API_EMAIL",
           "event":"FINISHED"
         },
         {
           "url":"http://http://requestbin.agaveapi.co/o1aiawo1?job_id=${JOB_ID}&amp;status=${JOB_STATUS}",
           "event":"*",
           "persistent":true
         }
       ]
      }

   {: .solution}


Notice that this example specifies a single input attribute, ``dataset``. The ``pyplot-0.1.0`` app definition specified that the ``dataset`` input attribute could accept more than one value (maxCardinality = 2). In the job request object, that translates to an array of string values. Each string represents a piece of data that Agave will transfer into the job work directory prior to job execution. Any value accepted by the Files service when `importing data  <../files/introduction#importing-data>`_ is accepted here. Some examples of valid values are given in the following table.


.. raw:: html

   <table>
   <thead>
   <tr>
   <th>Name</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>inputs/pyplot/testdata.csv</td>
   <td>A relative path on the user's default storage system.</td>
   </tr>
   <tr>
   <td>/home/apiuser/inputs/pyplot/testdata.csv</td>
   <td>An absolute path on the user's default storage system.</td>
   </tr>
   <tr>
   <td>agave://$PUBLIC_STORAGE_SYSTEM/
   $API_USERNAME/inputs/pyplot/testdata.csv</td>
   <td>An Agave URL explicitly specifying a source system and relative path.</td>
   </tr>
   <tr>
   <td>agave://$PUBLIC_STORAGE_SYSTEM//home/
   apiuser/$API_USERNAME/inputs/pyplot/testdata.csv</td>
   <td>An Agave URL explicitly specifying a source system and absolute path.</td>
   </tr>
   <tr>
   <td>http://example.com/inputs/pyplot/testdata.csv</td>
   <td>Standard url with any <a href="../files/introduction#importing-data">supported transfer protocol</a>.</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p class="table-caption">Table 2. Examples of different syntaxes that input values can be specified in the job request object. Here we assume that the validator for the input field is such that these would pass.</p>


The example job request also specifies ``parameters`` object with the parameters defined in the ``pyplot-0.1.0`` app description. Notice that the parameter ``type`` value specified in the app description is reflected here. Numbers are given as numbers, not strings. Boolean and flag attributes are given as boolean true and false values. As with the input section, there is also a parameter ``chartType`` that accepts multiple values. In this case that translates to an array of string value. Had the parameter type required another primary type, that would be used in the array instead.

Finally, we see a ``notifications`` array specifying that we want Agave send three notifications related to this job. The first is a one-time email when the job starts running. The second is a one-time email when the job reaches a terminal state. The third is a webhook to the url we specified. More on notifications in the section on monitoring below.

Job submission validation
-------------------------

To get a template for the Job submission JSON for a particular app, you can use the following CLI command:

.. code-block:: shell

   jobs-template $APP_ID > job.json

You can submit the job with the following CLI command:

.. code-block:: shell

   jobs-submit -F job.json

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -F "fileToUpload=@job.json" https://agave.iplantc.org/jobs/v2/?pretty=true

   {: .solution}


If everything went well, you will receive a response that looks something like the following JSON object.

..

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
       "status" : "success",
       "message" : null,
       "version" : "2.2.14-red7223e",
       "result" : {
         "id" : "$JOB_ID",
         "name" : "$USERNAME-$APP_ID",
         "owner" : "$USERNAME",
         "appId" : "$APP_ID",
         "executionSystem" : "$PUBLIC_EXECUTION_SYSTEM",
         "batchQueue" : "normal",
         "nodeCount" : 1,
         "processorsPerNode" : 16,
         "memoryPerNode" : 32.0,
         "maxRunTime" : "01:00:00",
         "archive" : false,
         "retries" : 0,
         "localId" : null,
         "created" : "2018-01-26T15:01:44.000-06:00",
         "lastModified" : "2018-01-26T15:01:45.000-06:00",
         "outputPath" : null,
         "status" : "PENDING",
         "submitTime" : "2018-01-26T15:01:44.000-06:00",
         "startTime" : null,
         "endTime" : null,
         "inputs" : {
           "inputBam" : [ "agave://data.iplantcollaborative.org/shared/iplantcollaborative/example_data/Samtools_mpileup/ex1.bam" ]
         },
         "parameters" : {
           "nameSort" : true,
           "maxMemSort" : 800000000
         },
         "_links" : {
           "self" : {
             "href" : "https://agave.iplantc.org/jobs/v2/1674389564419740136-242ac113-0001-007"
           },
           "app" : {
             "href" : "https://agave.iplantc.org/apps/v2/$APP_ID"
           },
           "executionSystem" : {
             "href" : "https://agave.iplantc.org/systems/v2/$PUBLIC_EXECUTION_SYSTEM"
           },
           "archiveSystem" : {
             "href" : "https://agave.iplantc.org/systems/v2/$PUBLIC_EXECUTION_SYSTEM"
           },
           "archiveData" : {
             "href" : "https://agave.iplantc.org/jobs/v2/1674389564419740136-242ac113-0001-007/outputs/listings"
           },
           "owner" : {
             "href" : "https://agave.iplantc.org/profiles/v2/$USERNAME"
           },
           "permissions" : {
             "href" : "https://agave.iplantc.org/jobs/v2/1674389564419740136-242ac113-0001-007/pems"
           },
           "history" : {
             "href" : "https://agave.iplantc.org/jobs/v2/1674389564419740136-242ac113-0001-007/history"
           },
           "metadata" : {
             "href" : "https://agave.iplantc.org/meta/v2/data/?q=%7B%22associationIds%22%3A%221674389564419740136-242ac113-0001-007%22%7D"
           },
           "notifications" : {
             "href" : "https://agave.iplantc.org/notifications/v2/?associatedUuid=1674389564419740136-242ac113-0001-007"
           },
           "notification" : [ ]
         }
       }
      }

   {: .solution}

