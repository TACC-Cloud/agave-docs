
Tag Searching
^^^^^^^^^^^^^

..

   Search all tags for a given resource uuid


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2?associationIds.eq=179338873096442342-242ac113-0001-002z

.. code-block:: plaintext

   tags-search -v associationIds.like=179338873096442342-242ac113-0001-002

..

   The response will be an array of matching tag objects


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

Standard JSON sql syntax used across the rest of the Science APIs is available in the Tags service. All fields in the Tag object are available for querying.
