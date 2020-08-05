.. role:: raw-html-m2r(raw)
   :format: html


PostIts
=======

The PostIts service is a URL shortening service similar to `bit.ly <https://bit.ly>`_\ , `goo.gl <https://goo.gl/>`_\ , and `t.co <http://t.co>`_. It allows you to create pre-authenticated, disposable URLs to any resource in the Tapis Platform. You have control over the lifetime and number of times the URL can be redeemed, and you can expire a PostIt at any time. As with all Science API resources, a full set of events is available for you to track usage and integrate the lifecycle of a PostIt into external applications as needed.

The most common use of PostIts is to create URLs to files and folders you can share with others without having to upload them to a third-party service. Other uses cases for the PostIts service include creating "drop" folders to which anyone with the link can upload data, allowing a job to be reproducibly rerun for peer review, publishing metadata for public consumption, publishing a canonical reference to your user profile. The possibilities go on and on. Anytime you need to share your science with your world, PostIts can help you.

Aloe Postits Service (Coming soon!)
-----------------------------------
The Aloe Postits service will replace the current Tapis Postits service. The new service will not break any existing interfaces, but will add on additional features and improve performace & security.

The new Aloe Postits service will roll out in two parts. Part one will replace the legacy endpoints. Part two will add in additional endpoints.  

A new version of the Postits service documentation is being developed.  Until the unified documentation is ready and the new service is in place, please see the current Tapis Postits service documentation (below) for a basic understanding of the interface.

The following links discuss details of the new production Postits service:

`New Postits Service <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/postits/postits_new.html>`_

`Postits Tester Guide <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/postits/postits_test_guide.html>`_


Creating PostIts
----------------

To create a PostIt, send a POST request to the PostIts service with the target url you want to share. In this example, we are sharing a file we have in Tapis's cloud storage account.

In the response you see standard fields such as ``created`` timestamp and the ``postit`` token. You also see several fields that lead into the discussion of another aspect of PostIts, the ability to restrict usage and expire them on demand.

CLI command to create a PostIt:

.. code-block:: plaintext

   tapis postits create \
   -m 10 \
   -L 86400 \
   https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org/nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
          -X POST \
          -d "lifetime=3600" \
          -d "maxUses=10" \
          -d "method=GET" \
          -d "url=https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org/nryan/picksumipsum.txt" \
          'https://api.tacc.utexas.edu/postits/v2/?pretty=true'
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "creator":"nryan",
        "internalUsername":null,
        "authenticated":true,
        "created":"2016-09-30T21:51:31-05:00",
        "expires":"2016-10-01T00:14:51-05:00",
        "remainingUses":10,
        "postit":"f61256c53bf3744185de4ac6c0c839b4",
        "noauth":false,
        "url":"https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org//home/nryan/picksumipsum.txt",
        "method":"GET",
        "_links":{
          "self":{
            "href":"https://api.tacc.utexas.edu/postits/v2/f61256c53bf3744185de4ac6c0c839b4"
          },
          "profile":{
            "href":"https://api.tacc.utexas.edu/profiles/v2/nryan"
          },
          "file":{
            "href":"https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org//home/nryan/picksumipsum.txt"
          }
        }
        }
|


Restricting PostIt usage
------------------------

When creating a PostIt, you have the ability to limit the lifespan, number of uses, and HTTP method used to connect to the target resource. The following table shows the fields available for this purpose. Not specifying any of these fields results in a single-use PostIt that remains valid for 1 calendar month.

:raw-html-m2r:`<table border="1px" cellpadding="5">`

:raw-html-m2r:`<thead>`

:raw-html-m2r:`<tr>`

:raw-html-m2r:`<th>Attribute</th>`

:raw-html-m2r:`<th>Type</th>`

:raw-html-m2r:`<th>Description</th>`


:raw-html-m2r:`<tbody>`

:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>maxUses</td>`

:raw-html-m2r:`<td>JSON object</td>`

:raw-html-m2r:`<td>The maximum number of times the postit may be redeemed. Defaults to 1.</td>`


:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>maxLifetime</td>`

:raw-html-m2r:`<td>string</td>`

:raw-html-m2r:`<td>The maximum lifetime in seconds over which the postit may be redeemed. Defaults to 1 month.</td>`


:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>method</td>`

:raw-html-m2r:`<td>GET,POST,PUT,DELETE</td>`

:raw-html-m2r:`<td>The HTTP method to be used to request the target resource when redeeming a postit. Defaults to GET</td>`


:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>noauth</td>`

:raw-html-m2r:`<td>boolean</td>`

:raw-html-m2r:`<td>Whether the request to the target resource should be authenticated. Defaults to true.</td>`



.. raw:: html

   <p></p>
   <p></p>
   <p></p>


..

   :warning: If you intend and using a PostIt as a link in a web page or a messaging service like Slack, HipChat, Facebook, Twitter, etc, which unfurl URL for display, then you should set the maximum uses greater than 4 due to the number of preflight requests made to the URL for display. Failing to do so will result in the URL showing up in the feed, but failing to resolve when clicked to download.


Listing Active PostIts
----------------------

To list all currently active PostIts, enter the following CLI command:

.. code-block:: plaintext

   tapis postits list -v

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
          'https://api.tacc.utexas.edu/postits/v2/?pretty=true'
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
        {
          "creator":"nryan",
          "internalUsername":null,
          "authenticated":true,
          "created":"2016-09-30T21:51:31-05:00",
          "expires":"2016-10-01T00:14:51-05:00",
          "remainingUses":10,
          "postit":"f61256c53bf3744185de4ac6c0c839b4",
          "noauth":false,
          "url":"https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org//home/nryan/picksumipsum.txt",
          "method":"GET",
          "_links":{
            "self":{
              "href":"https://api.tacc.utexas.edu/postits/v2/f61256c53bf3744185de4ac6c0c839b4"
            },
            "profile":{
              "href":"https://api.tacc.utexas.edu/profiles/v2/nryan"
            },
            "file":{
              "href":"https://api.tacc.utexas.edu/files/v2/media/system/data.iplantcollaborative.org//home/nryan/picksumipsum.txt"
            }
          }
        }
        ]
|


Redeeming PostIts
-----------------

You redeem a PostIt by making a non-authenticated HTTP request on the PostIt URL. In the above example, that would be ``https://api.tacc.utexas.edu/postits/v2/ead227bace394790e56beb07e7c3ff4d``. Every time you make a get request on the PostIt, the ``remainingUses`` field decrements by 1. This continues until the value hits 0 or the PostIt outlives its ``expires`` field.

cURL command for redeeming a PostIt:

.. code-block:: plaintext

   curl -s -o picksumipsum.txt 'https://api.tacc.utexas.edu/postits/v2/f61256c53bf3744185de4ac6c0c839b4'

Which would download the ``picksumipsum.txt`` file from your storage system.

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -s -o picksumipsum.txt 'https://api.tacc.utexas.edu/postits/v2/f61256c53bf3744185de4ac6c0c839b4'
|

   :warning: There will be no response for redeeming PostIts, even if the redemption fails.


Forcing PostIt browser downloads
--------------------------------

If you are using PostIts in a browser environment, you can force a file download by adding ``force=true`` to the PostIt URL query. If the target URL is a file item, the name of the file item will be included in the ``Content-Disposition`` header so the downloaded file has the correct file name. You may also add the same query parameter to any target file item to force the ``Content-Disposition`` header from the Files API.

Expiring PostIts
----------------

In addition to setting expiration parameters when you create a PostIt, you can manually expire a PostIt at any time by making an authenticated DELETE request on the PostIt URL. This will instantly expire the PostIt from further use and remove it from your listing results.

Manually expiring a PostIt with CLI:

.. code-block:: plaintext

   tapis postits delete f61566c53bf3744185de4ac6c0c839b4

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
        -X DELETE
        'https://api.tacc.utexas.edu/postits/v2/f61566c53bf3744185de4ac6c0c839b4?pretty=true'
|


Which will result in an empty response from the server.
