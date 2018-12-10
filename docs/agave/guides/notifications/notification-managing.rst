
Creating
--------

Create a new notification subscription with the following CLI command:

.. code-block:: plaintext

   notifications-addupdate -F notification.json

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST \
          -H "Content-Type: application/json" \
          --data-binary '{"associatedUuid": "7554973644402463206-242ac114-0001-007", "event": "FINISHED", "url": "http://requestbin.agaveapi.co/zyiomxzy?path=${PATH}&system=>{SYSTEM}&event=${EVENT}" }' \
          https://api.tacc.utexas.edu/notifications/v2?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "id": "7612526206168863206-242ac114-0001-011",
        "owner": "nryan",
        "url": "http://requestbin.agaveapi.co/zyiomxzy?path=${PATH}&system=${SYSTEM}&event=${EVENT}",
        "associatedUuid": "7554973644402463206-242ac114-0001-007",
        "event": "FINISHED",
        "responseCode": null,
        "attempts": 0,
        "lastSent": null,
        "success": false,
        "persistent": false,
        "status": "ACTIVE",
        "lastUpdated": "2016-08-24T10:07:03.000-05:00",
        "created": "2016-08-24T10:07:03.000-05:00",
        "policy": {
          "retryLimit": 5,
          "retryRate": 5,
          "retryDelay": 0,
          "saveOnFailure": true,
          "retryStrategy": "NONE"
        },
        "_links": {
          "self": {
            "href": "https://api.tacc.utexas.edu/notifications/v2/7612526206168863206-242ac114-0001-011"
          },
          "history": {
            "href": "https://api.tacc.utexas.edu/notifications/v2/7612526206168863206-242ac114-0001-011/history"
          },
          "attempts": {
            "href": "https://api.tacc.utexas.edu/notifications/v2/7612526206168863206-242ac114-0001-011/attempts"
          },
          "owner": {
            "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
          },
          "job": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/7554973644402463206-242ac114-0001-007"
          }
        }
        }
|


Updating
--------

Updating a subscription is done identically to creation except that the form or JSON is POSTed to the existing subscription URL. An example of doing this using curl as well as the CLI is given below. 

The updated notification subscription object:

.. code-block:: json

   {
   "associatedUuid": "7554973644402463206-242ac114-0001-007",
   "event": "*",
   "url": "http://requestbin.agaveapi.co/zyiomxzy?path=${PATH}&system=${SYSTEM}&event=${EVENT}"
   }

CLI command to update subscription, using the above JSON:

.. code-block:: plaintext

   notifications-addupdate -F notification.json 2699130208276770330-242ac114-0001-011

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST \
          -H "Content-Type: application/json" \
          -F "fileToUpload=@notification.json" \
          https://api.tacc.utexas.edu/notifications/v2/2699130208276770330-242ac114-0001-011
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "id": "7612526206168863206-242ac114-0001-011",
        "owner": "nryan",
        "url": "http://requestbin.agaveapi.co/zyiomxzy?path=${PATH}&system=${SYSTEM}&event=${EVENT}",
        "associatedUuid": "7554973644402463206-242ac114-0001-007",
        "event": "*",
        "responseCode": null,
        "attempts": 0,
        "lastSent": null,
        "success": false,
        "persistent": false,
        "status": "ACTIVE",
        "lastUpdated": "2016-08-24T10:07:03.000-05:00",
        "created": "2016-08-24T10:07:03.000-05:00",
        "policy": {
          "retryLimit": 5,
          "retryRate": 5,
          "retryDelay": 0,
          "saveOnFailure": true,
          "retryStrategy": "NONE"
        },
        "_links": {
          "self": {
            "href": "https://api.tacc.utexas.edu/notifications/v2/7612526206168863206-242ac114-0001-011"
          },
          "history": {
            "href": "https://api.tacc.utexas.edu/notifications/v2/7612526206168863206-242ac114-0001-011/history"
          },
          "attempts": {
            "href": "https://api.tacc.utexas.edu/notifications/v2/7612526206168863206-242ac114-0001-011/attempts"
          },
          "owner": {
            "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
          },
          "job": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/7554973644402463206-242ac114-0001-007"
          }
        }
        }
|


Listing
-------

You can get a list of your current notification subscriptions by performing a GET operation on the base /notifications collection. Adding the UUID of a notification will return just that notification. You can also query for all notifications assigned to a specific UUID by adding ``associatedUuid=$uuid``. An example of querying all notifications using curl as well as the CLI is given below.

List all notificaiton subscriptions with the following CLI command:

.. code-block:: plaintext

   notifications-list -V

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
        https://api.tacc.utexas.edu/notifications/v2/2699130208276770330-242ac114-0001-011
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
        {
          "id": "7612526206168863206-242ac114-0001-011",
          "url": "http://requestbin.agaveapi.co/zyiomxzy?path=${PATH}&system=${SYSTEM}&event=${EVENT}",
          "associatedUuid": "7554973644402463206-242ac114-0001-007",
          "event": "*",
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/notifications/v2/7612526206168863206-242ac114-0001-011"
            },
            "profile": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
            },
            "job": {
              "href": "https://api.tacc.utexas.edu/jobs/v2/7554973644402463206-242ac114-0001-007"
            }
          }
        },
        {
          "id": "7404907487080223206-242ac114-0001-011",
          "url": "nryan@rangers.texas.mlb.com",
          "associatedUuid": "6904887394479903206-242ac114-0001-007",
          "event": "FINISHED",
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/notifications/v2/7404907487080223206-242ac114-0001-011"
            },
            "profile": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
            },
            "job": {
              "href": "https://api.tacc.utexas.edu/jobs/v2/6904887394479903206-242ac114-0001-007"
            }
          }
        },
        {
          "id": "3676815741209931290-242ac114-0001-011",
          "url": "nryan@rangers.texas.mlb.com",
          "associatedUuid": "3717016635100491290-242ac114-0001-007",
          "event": "FINISHED",
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/notifications/v2/3676815741209931290-242ac114-0001-011"
            },
            "profile": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
            },
            "job": {
              "href": "https://api.tacc.utexas.edu/jobs/v2/3717016635100491290-242ac114-0001-007"
            }
          }
        }
        ]
|


Unsubscribing
-------------

To unsubscribe from an event, perform a DELETE on the notification URL. Once deleted, you can not restore a subscription. You can, however create a new one. Keep in mind that if you do this, the UUID of the new notification will be different that that of the deleted one. An example of deleting a notification using curl as well as the CLI is given below.

Unsubscribe from a notification subscription with the following CLI command:

.. code-block:: plaintext

   notifications-delete -V

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X DELETE \
            https://api.tacc.utexas.edu/notifications/v2/2699130208276770330-242ac114-0001-011
|


A standard Agave response with an empty result will be returned.
