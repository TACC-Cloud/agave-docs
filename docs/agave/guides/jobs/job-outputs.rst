
Outputs
=======

Throughout the lifecycle of a job, your inputs, application assets, and outputs are copied from and shuffled between several different locations. Though it is possible in many instances to explicitly locate and view all the moving pieces of your job through the Files service, resolving where those pieces are given the status, execution system, storage systems, data protocols, login protocols, and execution mechanisms of your job at a given time is...challenging. It is important, however, that you have the ability to monitor your job's output throughout the lifetime of the job.

To make tracking the output of a specific job easier to do, the Jobs service provides a special URL for referencing individual job outputs

.. code-block::

   jobs-output-list $JOB_ID
   jobs-output-list -v $JOB_ID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" https://agave.iplantc.org/jobs/v2/$JOB_ID/outputs/listings/?pretty=true
|


The syntax of this service is consistent with the Files service syntax, as is the JSON response from the service. The response would be similar to the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "status" : "success",
        "message" : null,
        "version" : "2.1.0-r6d11c",
        "result" : [ {
          "name" : "output",
          "path" : "/output",
          "lastModified" : "2014-11-06T13:34:35.000-06:00",
          "length" : 0,
          "permission" : "NONE",
          "mimeType" : "text/directory",
          "format" : "folder",
          "type" : "dir",
          "_links" : {
            "self" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/media/output"
            },
            "system" : {
              "href" : "https://agave.iplantc.org/systems/v2/data.iplantcollaborative.org"
            },
            "parent" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007"
            }
          }
        }, {
          "name" : "demo-pyplot-demo-advanced-test-1414139896.err",
          "path" : "/demo-pyplot-demo-advanced-test-1414139896.err",
          "lastModified" : "2014-11-06T13:34:27.000-06:00",
          "length" : 442,
          "permission" : "NONE",
          "mimeType" : "application/octet-stream",
          "format" : "unknown",
          "type" : "file",
          "_links" : {
            "self" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/media/demo-pyplot-demo-advanced-test-1414139896.err"
            },
            "system" : {
              "href" : "https://agave.iplantc.org/systems/v2/data.iplantcollaborative.org"
            },
            "parent" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007"
            }
          }
        }, {
          "name" : "demo-pyplot-demo-advanced-test-1414139896.out",
          "path" : "/demo-pyplot-demo-advanced-test-1414139896.out",
          "lastModified" : "2014-11-06T13:34:30.000-06:00",
          "length" : 1396,
          "permission" : "NONE",
          "mimeType" : "application/octet-stream",
          "format" : "unknown",
          "type" : "file",
          "_links" : {
            "self" : {
              "href" : "https://pagave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/media/demo-pyplot-demo-advanced-test-1414139896.out"
            },
            "system" : {
              "href" : "https://agave.iplantc.org/systems/v2/data.iplantcollaborative.org"
            },
            "parent" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007"
            }
          }
        }, {
          "name" : "demo-pyplot-demo-advanced-test-1414139896.pid",
          "path" : "/demo-pyplot-demo-advanced-test-1414139896.pid",
          "lastModified" : "2014-11-06T13:34:33.000-06:00",
          "length" : 6,
          "permission" : "NONE",
          "mimeType" : "application/octet-stream",
          "format" : "unknown",
          "type" : "file",
          "_links" : {
            "self" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/media/demo-pyplot-demo-advanced-test-1414139896.pid"
            },
            "system" : {
              "href" : "https://agave.iplantc.org/systems/v2/data.iplantcollaborative.org"
            },
            "parent" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007"
            }
          }
        }, {
          "name" : "testdata.csv",
          "path" : "/testdata.csv",
          "lastModified" : "2014-11-06T13:34:42.000-06:00",
          "length" : 3212,
          "permission" : "NONE",
          "mimeType" : "application/octet-stream",
          "format" : "unknown",
          "type" : "file",
          "_links" : {
            "self" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/media/testdata.csv"
            },
            "system" : {
              "href" : "https://agave.iplantc.org/systems/v2/data.iplantcollaborative.org"
            },
            "parent" : {
              "href" : "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007"
            }
          }
        } ]
        }
|


To download a file you would use the following syntax

.. code-block::

   jobs-output-get $JOB_ID $PATH

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" https://agave.iplantc.org/jobs/v2/$JOB_ID/outputs/media/$PATH
|

   :information_source: The Jobs output service follows the same conventions of the Files service. Thus, you may specify a range header to retrieve a specific byte range. This is particularly helpful when tracking job progress since it gives you a mechanism to tail the output and error log files.


Regardless of job status, the above services will always point to the most recent location of the job data. If you choose for the Jobs service to archive your job after completion, the URL will point to the archive folder of the job. If you do not choose to archive your data, or if archiving fails, the URL will point to the execution folder created for your job at runtime. Because Tapis (Agave) does not own any of the underlying hardware, it cannot guarantee that those locations will always exist. If, for example, the execution system enforces a purge policy, the output data may be deleted by the system administrators. Agave will let you know if the data is no longer present, however, it cannot prevent it from being deleted. This is another reason that it is important to archive data you feel will be needed in the future.
