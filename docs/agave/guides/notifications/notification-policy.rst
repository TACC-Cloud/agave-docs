
Retry Policies
--------------

In some situations, Tapis (Agave) may be unable to publish a specific notification. When this happens, Agave will immediately retry the notification 5 times in an attempt to deliver it successfully. When delivery fails for a 5th time, the notification is abandoned. If your application requires a more tenacious or methodical approach to retry delivery, you may provide a notification policy.

Example notification subscription object with custom retry policy:

.. code-block:: json

   {
     "url" : "$REQUEST_BIN?path=${PATH}&system=${SYSTEM}&event=${EVENT}",
     "event" : "*",
     "persistent": true,
     "policy": {
         "retryStrategy": "IMMEDIATE",
         "retryLimit": 20,
         "retryRate": 5,
         "retryDelay": 0,
         "saveOnFailure": true
       }
   }


.. raw:: html

   <p></p>   
   <p></p>   
   <table border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Name</th>
   <th>Type</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>retryStrategy</td>
   <td>NONE, IMMEDIATE, DELAYED, EXPONENTIAL</td>
   <td>The retry strategy to employ. Default is IMMEDIATE</td>
   </tr>
   <tr>
   <td>retryRate</td>
   <td>int; 0:86400</td>
   <td>The frequency with which attempts should be made to deliver the message.</td>
   </tr>
   <tr>
   <td>retryLimit</td>
   <td>int; 0:1440</td>
   <td>The maximum attempts that should be made to delivery the message. </td>
   </tr>
   <tr>
   <td>retryDelay</td>
   <td>int; 0:86400</td>
   <td>The initial delay between the initial delivery attempt and the first retry.</td>
   </tr>
   <tr>
   <td>saveOnFailure</td>
   <td>boolean</td>
   <td>Whether the failed message should be persisted if unable to be delivered within the retryLimit</td>
   </tr>
   </tbody>
   </table>
   <p></p>   
   <p></p>   
   <p></p>


Notification retry policies describe the strategy, frequency, delay, limit, and persistence to be applied when publishing an individual event for a given notification. The example above is our previous example with a notification policy included.

Failed deliveries
-----------------

By providing a retry policy where ``saveOnFailure`` is true, failed messages will be persisted and made available for querying at a later time. This is a great way to handled missed work due to a server failure, maintenance downtime, etc. 

To query failed attempts for a specific notification, enter the following CLI command:

.. code-block:: plaintext

   notifications-list-failures 229681451607921126-8e1831906a8e-0001-042"

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
        https://$API_BASE_URL/notifications/$API_VERSION/229681451607921126-8e1831906a8e-0001-042"/attempts
|

A list of notification attempts will be returned.

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
        {
          "id" : "229681451607921126-8e1831906a8e-0001-042",
          "url" : "https://httpbin.org/status/500",
          "event" : "SENT",
          "associatedUuid" : "5833036796741676570-b0b0b0bb0b-0001-011",
          "startTime" : "2016-06-19T22:21:02.266-05:00",
          "endTime" : "2016-06-19T22:21:03.268-05:00",
          "response" : {
            "code" : 500,
            "message" : ""
          },
          "_links" : {
            "self" : {
              "href" : "https://$API_BASE_URL/notifications/$API_VERSION/229123105859441126-8e1831906a8e-0001-011/attempts/229681451607921126-8e1831906a8e-0001-042"
            },
            "notification" : {
              "href" : "https://$API_BASE_URL/notifications/$API_VERSION/5833036796741676570-b0b0b0bb0b-0001-011"
            },
            "profile" : {
              "href" : "https://$API_BASE_URL/profiles/$API_VERSION/ipcservices"
            }
          }
        }
        ]
|


Note: There is no way to save successful notification deliveries.
