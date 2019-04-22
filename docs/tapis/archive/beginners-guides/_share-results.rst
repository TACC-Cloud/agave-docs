
Thus far we have done some work, obtained some results, and created some metadata. We have successfully conducted science in a closet. Rather than keep our discovery to ourself, let's use the PostIts service to share our metadata and results with a colleague.

A PostIt is a pre-authenticated, disposable URL, similar to a Bit.ly URL that you can share with others. You have control over the lifetime and number of times the URL can be redeemed and can expire it at any time. Let's create a PostIt for our "project" metadata that will expire after two requests.

.. code-block:: javascript

   {
     "url": "https://public.tenants.agaveapi.co/meta/v2/data/0001409792924730-5056a550b8-0001-012",
     "maxUses": 2,
     "method": "GET"
   }

Creating PostIts
----------------

To create a PostIt, send a POST request with the above JSON object to the PostIts service.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -F "fileToUpload=@postit.json" https://public.tenants.agaveapi.co/postits/v2/

.. code-block:: plaintext

   postits-create -v -m 2 https://public.tenants.agaveapi.co/meta/v2/data/0001409792924730-5056a550b8-0001-012

This will return a JSON object with a reference to the URL we are sharing and PostIt URL we can hand out to others. Notice that, in this example, the PostIt we created is valid for two uses. You can verify this limit with your browser if you're following along. Visit the URL, refresh your browser. That should max out the request limit. The next time you refresh your browser, you will get a permission denied error.

.. code-block:: javascript

   {
       "authenticated": true,
       "created": "2014-09-03T20:31:30-05:00",
       "creator": "systest",
       "expires": "2014-10-03T20:31:30-05:00",
       "internalUsername": null,
       "method": "GET",
       "noauth": false,
       "postit": "a6804886706aec2cf5a9fb51cb52e016",
       "remainingUses": 2,
       "url": "https://public.tenants.agaveapi.co/meta/v2/data/0001409792924730-5056a550b8-0001-012",
       "_links": {
           "profile": {
               "href": "https://public.tenants.agaveapi.co/profiles/v2/systest"
           },
           "self": {
               "href": "https://public.tenants.agaveapi.co/postits/v2/a6804886706aec2cf5a9fb51cb52e016"
           }
       }
   }

Let's also create a PostIt of our output data that we can email to our colleague so they can download the file directly from our email message. The following JSON object will do the trick.

.. code-block:: javascript

   {
     "url": "https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest/picksumipsum.txt",
     "maxUses": 2,
     "method": "GET"
   }

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -F "fileToUpload=@output.json" https://public.tenants.agaveapi.co/postits/v2/

.. code-block:: plaintext

   postits-create -v -m 2 https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest/picksumipsum.txt

.. code-block:: javascript

   {
       "authenticated": true,
       "created": "2014-09-03T20:36:27-05:00",
       "creator": "systest",
       "expires": "2014-10-03T20:36:27-05:00",
       "internalUsername": null,
       "method": "GET",
       "noauth": false,
       "postit": "14e86bb1a039a03a2463e6e0f0a4421f",
       "remainingUses": 2,
       "url": "https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest/picksumipsum.txt",
       "_links": {
           "profile": {
               "href": "https://public.tenants.agaveapi.co/profiles/v2/systest"
           },
           "self": {
               "href": "https://public.tenants.agaveapi.co/postits/v2/14e86bb1a039a03a2463e6e0f0a4421f"
           }
       }
   }

Revoking PostIts
----------------

Now that you have created these URLs, you can share them freely with whoever you wish. If, at any time, you need to delete them before they expire, you can do so by issuing a DELETE on the URL.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/postits/v2/14e86bb1a039a03a2463e6e0f0a4421f

.. code-block:: plaintext

   postits-delete -v https://public.tenants.agaveapi.co/postits/v2/14e86bb1a039a03a2463e6e0f0a4421f
