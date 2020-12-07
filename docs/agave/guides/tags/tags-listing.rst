.. role:: raw-html-m2r(raw)
   :format: html


Tag details
^^^^^^^^^^^

..

   Fetching tag details


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2/demo


..

   The response will look something like the following:


.. code-block:: json

   {
     "id": "3042501574756462105-242ac113-0001-048",
     "name": "demo",
     "associationIds": [
       "576158795084066330-242ac119-0001-007",
       "1557538007895839206-242ac119-0001-007"
     ],
     "lastUpdated": "2017-03-13T12:38:14.000-05:00",
     "created": "2017-03-13T12:38:14.000-05:00",
     "_links": {
       "self": {
         "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048"
       },
       "associationIds": {
         "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/associations"
       },
       "permissions": {
         "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems"
       },
       "owner": {
         "href": "https://public.agaveapi.co/profiles/v2/nryan"
       }
     }
   }

To fetch a detailed description of a tag, make a GET request on the resource URL. You can use either the tag name or id when querying for the tag. The response will be the full tag representation. Unlike the Metadata API, the URL of each UUID in the ``associationIds`` are not resolved in the response. This is because assocations can be managed with their own API.


.. raw:: html

   <aside class="info">In the event you need the entire resource representations for each `associationIds` value, you can simply explode the json array into a comma-separated string and call the <a href="#uuid">UUID API</a> with `expand=true` in the query. </aside>


Tag browsing
^^^^^^^^^^^^

..

   Listing your tags


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2?limit=1


..

   The response will look something like the following:


.. code-block:: json

   [
     {
       "id": "3042501574756462105-242ac113-0001-048",
       "name": "demo",
       "associationIds": [
         "576158795084066330-242ac119-0001-007",
         "1557538007895839206-242ac119-0001-007"
       ],
       "lastUpdated": "2017-03-13T12:38:14.000-05:00",
       "created": "2017-03-13T12:38:14.000-05:00",
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048"
         },
         "associationIds": {
           "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/associations"
         },
         "permissions": {
           "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems"
         },
         "owner": {
           "href": "https://public.agaveapi.co/profiles/v2/nryan"
         }
       }
     }
   ]

To browse your Tags, make a GET request against the ``/tags/v2`` collection. This will return all the tags you created and to which you have been granted READ access. This includes any tags that have been shared with the ``public`` or ``world`` users. In practice, users will have many tags created and shared with them as part of normal use of the platform, so pagination and :raw-html-m2r:`<a href="#tag-search">search</a>` become important aspects of interacting with the service.

For admins, who have implicit access to all tags, the default listing response will be a paginated list of every tag in the tenant. To avoid such a scenario, admin users can append ``privileged=false`` to bypass implicit permissions and only return the metadata queries to which they have ownership or been granted explicit access.


.. raw:: html

   <aside class="info">Admin users can append `privileged=false` to bypass implicit permissions and only return the metadata queries to which they have ownership or been granted explicit access.</aside>
