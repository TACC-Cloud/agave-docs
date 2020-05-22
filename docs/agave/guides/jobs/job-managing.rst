
Stopping
========

Once your job is submitted, you have the ability to stop the job. This will kill the job on the system on which it is running.

You can kill a job with the following CLI command:

.. code-block:: plaintext

   tapis jobs cancel $JOB_UUID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "action=kill" https://api.tacc.utexas.edu/jobs/v2/$JOB_ID
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "id" : "$JOB_ID",
        "name" : "demo-pyplot-demo-advanced test-1414139896",
        "owner" : "$API_USERNAME",
        "appId" : "demo-pyplot-demo-advanced-0.1.0",
        "executionSystem" : "$PUBLIC_EXECUTION_SYSTEM",
        "batchQueue" : "debug",
        "nodeCount" : 1,
        "processorsPerNode" : 1,
        "memoryPerNode" : 1.0,
        "maxRunTime" : "01:00:00",
        "archive" : false,
        "retries" : 0,
        "localId" : "10321",
        "outputPath" : null,
        "status" : "STOPPED",
        "submitTime" : "2014-10-24T04:48:11.000-05:00",
        "startTime" : "2014-10-24T04:48:08.000-05:00",
        "endTime" : null,
        "inputs" : {
          "dataset" : "agave://$PUBLIC_STORAGE_SYSTEM/$API_USERNAME/inputs/pyplot/testdata.csv"
        },
        "parameters" : {
          "chartType" : "bar",
          "height" : "512",
          "showLegend" : "false",
          "xlabel" : "Time",
          "background" : "#FFF",
          "width" : "1024",
          "showXLabel" : "true",
          "separateCharts" : "false",
          "unpackInputs" : "false",
          "ylabel" : "Magnitude",
          "showYLabel" : "true"
        },
        "_links" : {
          "self" : {
            "href" : "https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007"
          },
          "app" : {
            "href" : "https://api.tacc.utexas.edu/apps/v2/demo-pyplot-demo-advanced-0.1.0"
          },
          "executionSystem" : {
            "href" : "https://api.tacc.utexas.edu/systems/v2/$PUBLIC_EXECUTION_SYSTEM"
          },
          "archiveData" : {
            "href" : "https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/listings"
          },
          "owner" : {
            "href" : "https://api.tacc.utexas.edu/profiles/v2/$API_USERNAME"
          },
          "permissions" : {
            "href" : "https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/pems"
          },
          "history" : {
            "href" : "https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/history"
          },
          "metadata" : {
            "href" : "https://api.tacc.utexas.edu/meta/v2/data/?q={"associationIds":"0001414144065563-5056a550b8-0001-007"}"
          },
          "notifications" : {
            "href" : "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=0001414144065563-5056a550b8-0001-007"
          }
        }
        }
|


Deleting a job
--------------

Over time the number of jobs you have run can grow rather large. You can delete jobs to remove them from your listing results, with the following CLI command:


.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://api.tacc.utexas.edu/jobs/v2/$JOB_ID
|

   :warning: Deleting a job will hide it from view, not permanently delete the record.


Resubmitting a job
------------------

Often times you will want to rerun a previous job as part of a pipeline, automation, or validation that the results were valid. In this situation, it is convenient to use the ``resubmit`` feature of the Jobs service.

.. code-block::

   tapis jobs resubmit $JOB_UUID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "action=resubmit" https://api.tacc.utexas.edu/jobs/v2/$JOB_ID
|


Resubmission provides you the options to enforce as much or as little rigor as you desire with respect to reproducibility in the job submission process. The following options are available to you for configuring a resubmission according to your requirements.

.. list-table::
   :header-rows: 1

   * - Field
     - Type
     - Description
   * - ignoreInputConflicts
     - boolean
     - Whether to ignore discrepencies in the previous app inputs for the resubmitted job. If true, the resubmitted job will make a best fit attempt and migrating the inputs.
   * - ignoreParameterConflicts
     - boolean
     - Whether to ignore discrepencies in the previous app parameters for the resubmitted job. If true, the resubmitted job will make a best fit attempt and migrating the parameters.
   * - preserveNotifications
     - boolean
     - Whether to recreate the notification of the original job for the resubmitted job.
