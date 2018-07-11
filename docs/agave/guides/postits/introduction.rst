.. role:: raw-html-m2r(raw)
   :format: html


PostIts
=======

The PostIts service is a URL shortening service similar to `bit.ly <https://bit.ly>`_\ , `goo.gl <https://goo.gl/>`_\ , and `t.co <http://t.co>`_. It allows you to create pre-authenticated, disposable URLs to any resource in the Agave Platform. You have control over the lifetime and number of times the URL can be redeemed, and you can expire a PostIt at any time. As with all Science API resources, a full set of events is available for you to track usage and integrate the lifecycle of a PostIt into external applications as needed.

The most common use of PostIts is to create URLs to files and folders you can share with others without having to upload them to a third-party service. For example, using the PostIts service, you can share the output(s) of an experimental run, distribute materials for a class, submit data to a third-party service, and serve up assets for a static website like `Agave ToGo <https://togo.agaveapi.co/>`_.

Other uses cases for the PostIts service include creating "drop" folders to which anyone with the link can upload data, allowing a job to be reproducibly rerun for peer review, publishing metadata for public consumption, publishing a canonical reference to your user profile. The possibilities go on and on. Anytime you need to share your science with your world, PostIts can help you.

Creating PostIts
----------------

To create a PostIt, send a POST request to the PostIts service with the target url you want to share. In this example, we are sharing a file we have in Agave's cloud storage account.

In the response you see standard fields such as ``created`` timestamp and the ``postit`` token. You also see several fields that lead into the discussion of another aspect of PostIts, the ability to restrict usage and expire them on demand.

CLI command to create a PostIt:

.. code-block:: plaintext

   postits-create \
   -m 10 \
   -l 86400 \
   https://public.agaveapi.co/files/v2/media/system/data.agaveapi.co/nryan/picksumipsum.txt

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
         -X POST \
         -d "lifetime=3600" \
         -d "maxUses=10" \
         -d "method=GET" \
         -d "url=https://public.agaveapi.co/files/v2/media/system/data.agaveapi.co/nryan/picksumipsum.txt" \
         'https://public.agaveapi.co/postits/v2/?pretty=true'

   {: .solution}

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

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
       "url":"https://public.agaveapi.co/files/v2/media/system/data.agaveapi.co//home/nryan/picksumipsum.txt",
       "method":"GET",
       "_links":{
         "self":{
           "href":"https://public.agaveapi.co/postits/v2/f61256c53bf3744185de4ac6c0c839b4"
         },
         "profile":{
           "href":"https://public.agaveapi.co/profiles/v2/nryan"
         },
         "file":{
           "href":"https://public.agaveapi.co/files/v2/media/system/data.agaveapi.co//home/nryan/picksumipsum.txt"
         }
       }
      }

   {: .solution}


Restricting PostIt usage
------------------------

When creating a PostIt, you have the ability to limit the lifespan, number of uses, and HTTP method used to connect to the target resource. The following table shows the fields available for this purpose. Not specifying any of these fields results in a single-use PostIt that remains valid for 1 calendar month.

:raw-html-m2r:`<table>`

:raw-html-m2r:`<thead>`

:raw-html-m2r:`<tr>`

:raw-html-m2r:`<th>Attribute</th>`

:raw-html-m2r:`<th>Type</th>`

:raw-html-m2r:`<th>Description</th>`
</tr>
</thead>

:raw-html-m2r:`<tbody>`

:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>maxUses</td>`

:raw-html-m2r:`<td>JSON object</td>`

:raw-html-m2r:`<td>The maximum number of times the postit may be redeemed. Defaults to 1.</td>`
</tr>

:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>maxLifetime</td>`

:raw-html-m2r:`<td>string</td>`

:raw-html-m2r:`<td>The maximum lifetime in seconds over which the postit may be redeemed. Defaults to 1 month.</td>`
</tr>

:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>method</td>`

:raw-html-m2r:`<td>GET,POST,PUT,DELETE</td>`

:raw-html-m2r:`<td>The HTTP method to be used to request the target resource when redeeming a postit. Defaults to GET</td>`
</tr>

:raw-html-m2r:`<tr>`

:raw-html-m2r:`<td>noauth</td>`

:raw-html-m2r:`<td>boolean</td>`

:raw-html-m2r:`<td>Whether the request to the target resource should be authenticated. Defaults to true.</td>`
</tr>
</tbody>
</table>


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

   postits-list -v

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
         'https://public.agaveapi.co/postits/v2/?pretty=true'

   {: .solution}

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

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
         "url":"https://public.agaveapi.co/files/v2/media/system/data.agaveapi.co//home/nryan/picksumipsum.txt",
         "method":"GET",
         "_links":{
           "self":{
             "href":"https://public.agaveapi.co/postits/v2/f61256c53bf3744185de4ac6c0c839b4"
           },
           "profile":{
             "href":"https://public.agaveapi.co/profiles/v2/nryan"
           },
           "file":{
             "href":"https://public.agaveapi.co/files/v2/media/system/data.agaveapi.co//home/nryan/picksumipsum.txt"
           }
         }
       }
      ]

   {: .solution}


Redeeming PostIts
-----------------

You redeem a PostIt by making a non-authenticated HTTP request on the PostIt URL. In the above example, that would be ``https://public.agaveapi.co/postits/v2/ead227bace394790e56beb07e7c3ff4d``. Every time you make a get request on the PostIt, the ``remainingUses`` field decrements by 1. This continues until the value hits 0 or the PostIt outlives its ``expires`` field.

cURL command for redeeming a PostIt:

.. code-block:: plaintext

   curl -s -o picksumipsum.txt 'https://public.agaveapi.co/postits/v2/f61256c53bf3744185de4ac6c0c839b4'

Which would download the ``picksumipsum.txt`` file from your storage system.

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -s -o picksumipsum.txt 'https://public.agaveapi.co/postits/v2/f61256c53bf3744185de4ac6c0c839b4'

   {: .solution}

   :warning: There will be no response for redeeming PostIts, even if the redemption fails.


Forcing PostIt browser downloads
--------------------------------

If you are using PostIts in a browser environment, you can force a file download by adding ``force=true`` to the PostIt URL query. If the target URL is a file item, the name of the file item will be included in the ``Content-Disposition`` header so the downloaded file has the correct file name. You may also add the same query parameter to any target file item to force the ``Content-Disposition`` header from the Files API.

Expiring PostIts
----------------

In addition to setting expiration parameters when you create a PostIt, you can manually expire a PostIt at any time by making an authenticated DELETE request on the PostIt URL. This will instantly expire the PostIt from further use and remove it from your listing results.

Manually expiring a PostIt with CLI:

.. code-block:: plaintext

   postits-delete f61566c53bf3744185de4ac6c0c839b4

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
      -X DELETE
      'https://public.agaveapi.co/postits/v2/f61566c53bf3744185de4ac6c0c839b4?pretty=true'

   {: .solution}


Which will result in an empty response from the server.
