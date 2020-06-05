
UUID
----

.. code-block:: json

    /$$   /$$ /$$   /$$ /$$$$$$ /$$$$$$$
   | $$  | $$| $$  | $$|_  $$_/| $$__  $$
   | $$  | $$| $$  | $$  | $$  | $$  $$
   | $$  | $$| $$  | $$  | $$  | $$  | $$
   | $$  | $$| $$  | $$  | $$  | $$  | $$
   | $$  | $$| $$  | $$  | $$  | $$  | $$
   |  $$$$$$/|  $$$$$$/ /$$$$$$| $$$$$$$/
    \______/  \______/ |______/|_______/

The Tapis UUID service resolves the type and representation of one or more Tapis UUID. This is helpful, for instance, when you need to expand the hypermedia response of another resource, get the URL corresponding to a UUID, or fetch the representations of multiple resources in a single request.

Resolving a single UUID
^^^^^^^^^^^^^^^^^^^^^^^

..

   Resolving a uuid


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
       https://api.tacc.utexas.edu/uuid/v2/0001409758089943-5056a550b8-0001-002

..

   The response will look something like this:


.. code-block:: json

   {
     "uuid":"0001409758089943-5056a550b8-0001-002",
     "type":"FILE",
     "_links":{
       "file":{
         "href":"https://api.tacc.utexas.edu/files/v2/history/system/data.iplantcollaborative.org/nryan/picksumipsum.txt"
       }
     }
   }

A single UUID can be resolved by making a GET request on the UUID resource. The response will include the UUID and the type of the resource to which it is associated. The canonical resource URL is available in the hypermedia response. All calls to the UUID API are authenticated, however no permission checks will be made when doing basic resolving.

Expanding a UUID query
^^^^^^^^^^^^^^^^^^^^^^

..

   Resolving a uuid to a full resource representation


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
       https://api.tacc.utexas.edu/uuid/v2/0001409758089943-5056a550b8-0001-002?expand=true&pretty=true

..

   The response will include the entire representation of the resource just as if you queried the Files API.


.. code-block:: json

   {
     "internalUsername":null,
     "lastModified":"2014-09-03T10:28:09.943-05:00",
     "name":"picksumipsum.txt",
     "nativeFormat":"raw",
     "owner":"nryan",
     "path":"/home/nryan/picksumipsum.txt",
     "source":"http://127.0.0.1/picksumipsum.txt",
     "status":"STAGING_QUEUED",
     "systemId":"data.iplantcollaborative.org",
     "uuid":"0001409758089943-5056a550b8-0001-002",
     "_links":{
       "history":{
         "href":"https://api.tacc.utexas.edu/files/v2/history/system/data.iplantcollaborative.org/nryan/picksumipsum.txt"
       },
       "self":{
         "href":"https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org/nryan/picksumipsum.txt"
       },
       "system":{
         "href":"https://api.tacc.utexas.edu/systems/v2/data.iplantcollaborative.org"
       }
     }
   }

Often times you need more information about the resource associated with the UUID. You can save yourself an API request by adding ``expand=true`` to the URL query. The resulting response, if successful, will include the full resource representation of the resource associated with the UUID just as if you had called its URL directly. Filtering is also supported, so you can specify just the fields you want returned in the response.


.. raw:: html

   <aside class="warning">When requesting resource expansion, permission checks are made on each UUID prior to resolution. Thus, if you do not have permission to view a resource, you will receive a 403 rather than the expanded resource representation.</aside>


Resolving multiple UUID
^^^^^^^^^^^^^^^^^^^^^^^

..

   Resolving multiple UUID.


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
       https://api.tacc.utexas.edu/uuid/v2/?uuids.eq=0001409758089943-5056a550b8-0001-002,0001414144065563-5056a550b8-0001-007?expand=true&pretty=true

..

   The response will be similar to the following.


.. code-block:: json

   [
     {
       "uuid":"0001409758089943-5056a550b8-0001-002",
       "type":"FILE",
       "url":"https://api.tacc.utexas.edu/files/v2/history/system/data.iplantcollaborative.org/nryan/picksumipsum.txt",
       "_links":{
         "file":{
           "href":"https://api.tacc.utexas.edu/files/v2/history/system/data.iplantcollaborative.org/nryan/picksumipsum.txt"
         }
       }
     },
     {
       "uuid":"0001414144065563-5056a550b8-0001-007",
       "type":"JOB",
       "url":"https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007",
       "_links":{
         "file":{
           "href":"https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007"
         }
       }
     }
   ]

To resolve multiple UUID, make a GET request on the uuids collection and pass the UUID in as a comma-separated list to the ``uuids`` query parameter. The response will contain a list of resolved resources in the same order that you requested them.

Expanding multiple UUID
^^^^^^^^^^^^^^^^^^^^^^^

..

   Resolving multiple UUID to their resource representations


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
       https://api.tacc.utexas.edu/uuid/v2/?uuids.eq=0001409758089943-5056a550b8-0001-002,0001414144065563-5056a550b8-0001-007?expand=true&pretty=true

..

   The response will include an array of the expanded representations in the order they were requested in the URL query.


.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
          {
            "id":"$JOB_ID",
            "name":"demo-pyplot-demo-advanced test-1414139896",
            "owner":"$API_USERNAME",
            "appId":"demo-pyplot-demo-advanced-0.1.0",
            "executionSystem":"$PUBLIC_EXECUTION_SYSTEM",
            "batchQueue":"debug",
            "nodeCount":1,
            "processorsPerNode":1,
            "memoryPerNode":1.0,
            "maxRunTime":"01:00:00",
            "archive":false,
            "retries":0,
            "localId":"10321",
            "outputPath":null,
            "status":"STOPPED",
            "submitTime":"2014-10-24T04:48:11.000-05:00",
            "startTime":"2014-10-24T04:48:08.000-05:00",
            "endTime":null,
            "inputs":{
              "dataset":"agave://$PUBLIC_STORAGE_SYSTEM/$API_USERNAME/inputs/pyplot/testdata.csv"
            },
            "parameters":{
              "chartType":"bar",
              "height":"512",
              "showLegend":"false",
              "xlabel":"Time",
              "background":"#FFF",
              "width":"1024",
              "showXLabel":"true",
              "separateCharts":"false",
              "unpackInputs":"false",
              "ylabel":"Magnitude",
              "showYLabel":"true"
            },
            "_links":{
              "self":{
                "href":"https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007"
              },
              "app":{
                "href":"https://api.tacc.utexas.edu/apps/v2/demo-pyplot-demo-advanced-0.1.0"
              },
              "executionSystem":{
                "href":"https://api.tacc.utexas.edu/systems/v2/$PUBLIC_EXECUTION_SYSTEM"
              },
              "archiveData":{
                "href":"https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/listings"
              },
              "owner":{
                "href":"https://api.tacc.utexas.edu/profiles/v2/$API_USERNAME"
              },
              "permissions":{
                "href":"https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/pems"
              },
              "history":{
                "href":"https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/history"
              },
              "metadata":{
                "href":"https://api.tacc.utexas.edu/meta/v2/data/?q=%7b%22associationIds%22%3a%220001414144065563-5056a550b8-0001-007%22%7d"
              },
              "notifications":{
                "href":"https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=0001414144065563-5056a550b8-0001-007"
              }
            }
          },
          {
            "internalUsername":null,
            "lastModified":"2014-09-03T10:28:09.943-05:00",
            "name":"picksumipsum.txt",
            "nativeFormat":"raw",
            "owner":"nryan",
            "path":"/home/nryan/picksumipsum.txt",
            "source":"http://127.0.0.1/picksumipsum.txt",
            "status":"STAGING_QUEUED",
            "systemId":"data.iplantcollaborative.org",
            "uuid":"0001409758089943-5056a550b8-0001-002",
            "_links":{
              "history":{
                "href":"https://api.tacc.utexas.edu/files/v2/history/system/data.iplantcollaborative.org/nryan/picksumipsum.txt"
              },
              "self":{
                "href":"https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org/nryan/picksumipsum.txt"
              },
              "system":{
                "href":"https://api.tacc.utexas.edu/systems/v2/data.iplantcollaborative.org"
              }
            }
          }
        ]
|

Expansion also works when querying UUID in bulk. Simply add ``expand=true`` to the URL query in your request and the full resource representation of each UUID will be returned in an array with the original UUID request order maintained. If any of the resolutions fail due to permission violation or server error, the error response object will be provided rather than resource representation.
