.. role:: raw-html-m2r(raw)
   :format: html


PostIts
=======

The PostIts service is a URL shortening service similar to `bit.ly <https://bit.ly>`_\ , `goo.gl <https://goo.gl/>`_\ , and `t.co <http://t.co>`_. It allows you to create pre-authenticated, disposable URLs to any resource in the Tapis Platform. You have control over the lifetime and number of times the URL can be redeemed, and you can expire a PostIt at any time. The most common use of PostIts is to create URLs to files so that you can share with others without having to upload them to a third-party service. Anytime you need to share your science with your world, PostIts can help you.


Creating PostIts
^^^^^^^^^^^^^^^^

To create a PostIt, send a POST request to the PostIts service with the target url you want to share. In this example, we are sharing a file we have in Tapis's cloud storage account.

In the response you see standard fields such as ``created`` timestamp and the ``postit`` token. You also see several fields that lead into the discussion of another aspect of PostIts, such as the ability to restrict usage and expire them on demand.

When creating a postit, one has an option to create a postit with a specified number of allowed uses and expiration, or to create an unlimited postit. If max uses or lifetime is not provided, the default values will be applied regardless if the postit is unlimited. If postit is unlimited, these values will just act as placeholders but will not be used when redeeming.

Default parameters:

* maxUses - 1
* lifetime - 30 days 
* unlimited - false
* force (query parameter) - false -- discussed below 

You can create a postit with either content type 'application/json' or 'application/x-www-form-urlencoded'. The target URL must contain the base URL for the correct tenant. The url must also point to one of the following Tapis services: JOBS, FILES, APPS or SYSTEMS.

*JSON examples*

Creating a postit with maxUses and lifetime:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d '{"maxUses": 3, "lifetime": 600", "url": "<target_url>"}' -H "Content-Type: application/json" https://api.tacc.utexas.edu/postits/v2?pretty=true"
|

Creating unlimited postit:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d '{"unlimited": true, "url": "<target_url>"}' -H "Content-Type: application/json" https://api.tacc.utexas.edu/postits/v2?pretty=true"
|

*X-WWW-FORM-URLENCODED examples*

Creating a postit with maxUses and lifetime:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "maxUses=3&lifetime=600&url=<target_url>"} https://api.tacc.utexas.edu/postits/v2pretty=true"
|

Creating unlimited postit:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "unlimited=true&url=<target_url>" https://api.tacc.utexas.edu/postits/v2?pretty=true"
|


*CLI example* 

Note: CLI does not currently support unlimited postits
.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show CLI Command**

     .. code-block:: plaintext

           tapis postits create \
            -m 10 \
            -L 86400 \
            https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org/nryan/picksumipsum.txt
|

*Example Creation Response* 

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show JSON Response**

     .. code-block:: json

        {
        "creator": "jstubbs"
        "createdAt": "2020-09-30T21:51:31-05:00",
        "expiresAt": "2020-10-01T00:14:51-05:00",
        "remainingUses": 10,
        "postit": "0feb1aa5-01aa-4445-b580-a008064a4c44-010",
        "numberIsed": 0,
        "tenantId": "tacc.prod",
        "status": "ACTIVE"
        "noauth": false,
        "method": "GET"
        "url": "https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org//home/jstubbs/picksumipsum.txt",
        "method": "GET",
        "_links":{
          "self":{
            "href":"https://api.tacc.utexas.edu/postits/v2/0feb1aa5-01aa-4445-b580-a008064a4c44-010"
          },
          "profile":{
            "href":"https://api.tacc.utexas.edu/profiles/v2/jstubbs"
          },
          "file":{
            "href":"https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org//home/jstubbs/picksumipsum.txt"
          },
          "update":{
            "href":"https://api.tacc.utexas.edu/postits/v2/update/0feb1aa5-01aa-4445-b580-a008064a4c44-010"
          },
          "list":{
            "href":"https://api.tacc.utexas.edu/postits/v2/listing/0feb1aa5-01aa-4445-b580-a008064a4c44-010"
          }
        }
      }
|

**Available parameters to create a postit.**  

+----------------------+-----------+-------------------------------+
| *JSON Parameter*     |*JSON Type*| *Description*                 +
+======================+===========+===============================+ 
| maxUses              | integer   | The number of times a postit  +
|                      |           | can be redeemed. Must be      +
|                      |           | at least 1. Negative values   +
|                      |           | are not allowed.              +
+----------------------+-----------+-------------------------------+
| lifetime             | integer   | How long the postit will live,+
|                      |           | in seconds. This number is    +
|                      |           | used to generate the          +
|                      |           | expiration time and date by   +
|                      |           | adding the seconds to the     +
|                      |           | current date and time. The    +
|                      |           | resulting expiration time must+
|                      |           | be before date 1/19/2038.     +
+----------------------+-----------+-------------------------------+
| force                | boolean   | Appends the force argument to +
|                      |           | the curl command.             +
+----------------------+-----------+-------------------------------+
| unlimited            | boolean   | True to create a postit that  +
|                      |           | does not have an expiration   +
|                      |           | date or max uses.             +
+----------------------+-----------+-------------------------------+
| url                  | string    | The url to be redeemed by the +
|                      |           | postit. *Always required.     +
+----------------------+-----------+-------------------------------+
| noauth               | boolean   | Legacy parameter that will be +
|                      |           | accepted, but ignored by the  +
|                      |           | new Aloe service.             +
+----------------------+-----------+-------------------------------+
| internalUsername     | string    | Legacy parameter that will be +
|                      |           | accepted, but ignored by the  +
|                      |           | new Aloe service.             +
+----------------------+-----------+-------------------------------+
| method               | string    | Legacy parameter that will be +
|                      |           | accepted, but ignored by the  +
|                      |           | new Aloe service.             +
+----------------------+-----------+-------------------------------+


    :warning: If you intend and using a PostIt as a link in a web page or a messaging service like Slack, HipChat, Facebook, Twitter, etc, which unfurl URL for display, then you should set the maximum uses greater than 4 due to the number of preflight requests made to the URL for display. Failing to do so will result in the URL showing up in the feed, but failing to resolve when clicked to download.


Listing Active PostIts
^^^^^^^^^^^^^^^^^^^^^^

To list all currently active PostIts, see the following commands:
   
.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: plaintext

        tapis postits list -v

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" 'https://api.tacc.utexas.edu/postits/v2/?pretty=true'
|

The curl interface also allows listing postits by status. Just use `?status=<status>` at the end of the URL. For example, the following curl would return all expired postits. See the table below for other status options. 

``curl -sk -H "Authorization: Bearer $AUTH_TOKEN" 'https://api.tacc.utexas.edu/postits/v2/?pretty=true&status=expired'``

**Status Fields**

+---------------------+-----------------------------+
| *Status*            |*Description*                |
+=====================+=============================+ 
| ACTIVE              | Postit is redemeemable.     |
+---------------------+-----------------------------+
| EXPIRED_AND_NO_USES | Postit is both expired and  |
|                     | out of remaining uses.      |
+---------------------+-----------------------------+
| EXPIRED             | Postit has expired.         |
+---------------------+-----------------------------+
| NO_USES             | Postit is out of remaining  |
|                     | uses.                       |
+---------------------+-----------------------------+
| REVOKED             | The postit has been revoked.|
|                     | Can no longer redeem nor    |
|                     | update this postit.         |
+---------------------+-----------------------------+
| NOT_FOUND           | (Not a status) Indicates    |
|                     | status could not be         |
|                     | calculated.                 |
+---------------------+-----------------------------+
| ALL                 | (Not a status) Indicates to |
|                     | include all statuses.       |
+---------------------+-----------------------------+

Listing Single PostIt
^^^^^^^^^^^^^^^^^^^^^

You can list the information for any PostIt UUID, as long as it is on the same tenant. 

List a single postit

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        curl -H "Authorization: Bearer $AUTH_TOKEN"'https://api.tacc.utexas.edu/postits/v2/listing/0feb1aa5-01aa-4445-b580-a008064a4c44-010'
|

Updating PostIts
^^^^^^^^^^^^^^^^

The creator of a postit and tenant admins can update a postit. One may update maxUses, lifetime and unlimited. If a postit transitions from unlimited to limited without maxUses and lifetime, the current expiration and remaining uses is used. When updating the lifetime, a new expiration time will be calculated based on the lifetime sent in. It does not add on to the current expiration time. 

If you need to update other fields, such as url, you will need to revoke this postit and create a new one. 

Update a postit from unlimited to limited, in JSON format

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        curl -H "Authorization: Bearer $AUTH_TOKEN"'https://api.tacc.utexas.edu/postits/v2/update/0feb1aa5-01aa-4445-b580-a008064a4c44-010' \
            -X POST -d '{"maxUses": 100, "lifetime": 2000, "unlimited": false}' -H "Content-type: application/json"
|


Update a postit from limited to unlimited, in XML format

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        curl -H "Authorization: Bearer $AUTH_TOKEN"'https://api.tacc.utexas.edu/postits/v2/update/0feb1aa5-01aa-4445-b580-a008064a4c44-010' \
            -X POST -d "unlimited=true"
|

Redeeming PostIts
^^^^^^^^^^^^^^^^^

You redeem a PostIt by making a non-authenticated HTTP request on the PostIt URL. In the above example, that would be ``https://api.tacc.utexas.edu/postits/v2/0feb1aa5-01aa-4445-b580-a008064a4c44-010``. Every time you make a get request on the PostIt, the ``remainingUses`` field decrements by 1 and the ``numberUsed`` field increments by 1. This continues until the value hits 0 or the PostIt outlives its ``expiresAt`` field. If a postit is unlimited, the ``remainingUses`` field does not decrement, and the ``expiresAt`` field is not used. However, the postit will retain these original values for the case that a postit is reverted to a limited postit. 

cURL command for redeeming a PostIt, which would download the ``picksumipsum.txt`` file from your storage system to the user's machine:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        curl -s -o picksumipsum.txt 'https://api.tacc.utexas.edu/postits/v2/0feb1aa5-01aa-4445-b580-a008064a4c44-010'
|

   :warning: There will be no response for redeeming PostIts, even if the redemption fails.


Forcing PostIt Browser Downloads
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you are using PostIts in a browser environment, you can force a file download by adding ``force=true`` to the PostIt URL query. If the target URL is a file item, the name of the file item will be included in the ``Content-Disposition`` header so the downloaded file has the correct file name. You may also add the same query parameter to any target file item to force the ``Content-Disposition`` header from the Files API.

Expiring PostIts
^^^^^^^^^^^^^^^^

In addition to setting expiration parameters when you create a PostIt, you can manually expire a PostIt at any time by making an authenticated DELETE request on the PostIt URL. This will instantly expire, or revoke, the PostIt from further use. A revoked postit cannot be updated. 

Manually expiring a PostIt with CLI:
   
.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show CLI Command**

     .. code-block:: shell

        tapis postits delete 0feb1aa5-01aa-4445-b580-a008064a4c44-010
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show cURL**

     .. code-block:: shell

        curl -k -H "Authorization: Bearer $AUTH_TOKEN" -X DELETE 'https://api.tacc.utexas.edu/postits/v2/0feb1aa5-01aa-4445-b580-a008064a4c44-010?pretty=true'
|


