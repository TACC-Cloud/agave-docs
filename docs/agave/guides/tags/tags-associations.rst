
Tag associations
^^^^^^^^^^^^^^^^

..

   Fetching tagged resources


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/associations

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2/demo/associations

..

   The response will look something like the following:


.. code-block:: json

   [
     {
       "uuid": "576158795084066330-242ac119-0001-007",
       "type": "job",
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/demo/associations/576158795084066330-242ac119-0001-007"
         },
         "job": {
           "href": "https://public.agaveapi.co/jobs/v2/576158795084066330-242ac119-0001-007"
         }
       }
     },
     {
       "uuid": "1557538007895839206-242ac119-0001-007",
       "type": "job",
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/demo/associations/1557538007895839206-242ac119-0001-007"
         },
         "job": {
           "href": "https://public.agaveapi.co/jobs/v2/1557538007895839206-242ac119-0001-007"
         }
       }
     }
   ]

Because the focus of the Tags API is on establishing and maintaining these relationships, the Tags API exposes the ``associationIds`` as a managed subresource. This was a design choice due to the large number of associations that tend to develop over time. ``associationIds`` can be managed much like permissions are managed across the Science APIs.

Browsing tag associations
~~~~~~~~~~~~~~~~~~~~~~~~~

To fetch a list of the resources associated with a given tag, query the ``associations`` subcollection of a tag. This will return a response JSON array of objects similar to that returned from the UUIDS service. Each response object will contain the resource ``uuid`` and ``type``. In the hypermedia response, you will find the URL to the resource.


.. raw:: html

   <aside class="info">In the event you need the entire resource representations for each `associationIds` value, you can include `expand=true` in the URL query. This is identical to the way the UUIDS service expands resources. </aside>


Updating tag associations
~~~~~~~~~~~~~~~~~~~~~~~~~

..

   Tagging a resource


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X POST
       https://public.tenants.agaveapi.co/tags/v2/demo/associations/7322676215012195046-242ac114-0001-007

..

   The response will look something like the following:


.. code-block:: json

   {
       "uuid": "7322676215012195046-242ac114-0001-007",
       "type": "job",
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/demo/associations/7322676215012195046-242ac114-0001-007"
         }
         "job": {
           "href": "https://public.agaveapi.co/jobs/v2/7322676215012195046-242ac114-0001-007"
         }
       }
     }

To tag a single resource, you can make an empty POST request to the tagged resource details endpoint. If this resource is not already associated with the given tag, it will be associated when the request is made.

Removing tag associations
~~~~~~~~~~~~~~~~~~~~~~~~~

..

   Untagging a resource


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X DELETE
       https://public.tenants.agaveapi.co/tags/v2/demo/associations/7322676215012195046-242ac114-0001-007

..

   An empty response will be returned from the service


Bulk tagging resources
~~~~~~~~~~~~~~~~~~~~~~

..

   Tagging multiple resources


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X POST
       --data-binary '["911605847797535206-242ac114-0001-007",
                       "5369569074237730330-242ac114-0001-007",
                       "8333211822347981286-242ac114-0001-007"]'
       https://public.tenants.agaveapi.co/tags/v2/demo/associations


..

   The response will look something like the following:


.. code-block:: json

   [
     {
       "uuid": "911605847797535206-242ac114-0001-007",
       "type": "job",
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/demo/associations/911605847797535206-242ac114-0001-007"
         },
         "job": {
           "href": "https://public.agaveapi.co/jobs/v2/911605847797535206-242ac114-0001-007"
         }
       }
     },
     {
       "uuid": "5369569074237730330-242ac114-0001-007",
       "type": "job",
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/demo/associations/5369569074237730330-242ac114-0001-007"
         },
         "job": {
           "href": "https://public.agaveapi.co/jobs/v2/5369569074237730330-242ac114-0001-007"
         }
       }
     },
     {
       "uuid": "8333211822347981286-242ac114-0001-007",
       "type": "job",
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/demo/associations/8333211822347981286-242ac114-0001-007"
         },
         "job": {
           "href": "https://public.agaveapi.co/jobs/v2/8333211822347981286-242ac114-0001-007"
         }
       }
     }
   ]

To tag multiple resources at once, POST a JSON array of the resource UUID to the associations collection of the tag. If the resoures are already tagged, no change will be made. If they are not currently tagged they will be tagged. Resources already tagged, but not included in the array of UUID will remain unchanged.

Deleting metadata
^^^^^^^^^^^^^^^^^

..

   Delete a tag


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X DELETE
       https://public.tenants.agaveapi.co/tags/v2/demo/associations

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X DELETE
       https://public.tenants.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/associations


..

   An empty response will be returned from the service.


Untag all the resources associated with a tag at once, make a DELETE erquest on the assocations collection of the tag.


.. raw:: html

   <aside class="notice"> Clearing resources will remove the assocation, but not the resources themselves. </aside>
