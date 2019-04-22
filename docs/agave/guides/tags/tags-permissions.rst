
Tag Permissions
^^^^^^^^^^^^^^^

The Tags service supports permissions fconsistent with that of a number of other Tapis (Agave) services. If no permissions are explicitly set, only the owner of the Tag and tenant administrators can access it.

The permissions available for Tags listed in the following table. Please note that a user must have WRITE permissions to grant or revoke permissions on a tag.

<%= partial "includes/tables/89-tag-pems" %>

Listing all permissions
~~~~~~~~~~~~~~~~~~~~~~~

..

   List the permissions on a Tag for a given user


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2/demo/pems/rclemens

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems/rclemens

.. code-block:: plaintext

   tags-pems-list -u rclemens demo

   tags-pems-list -u rclemens \
       3042501574756462105-242ac113-0001-048

..

   The response will look something like the following:


.. code-block:: json

   [
     {
       "username": "nryan",
       "permission": {
         "read": true,
         "write": true
       },
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems/nryan"
         },
         "parent": {
           "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048"
         },
         "profile": {
           "href": "https://public.agaveapi.co/tags/v2/nryan"
         }
       }
     }
   ]

To list all permissions for a tag, make a GET request on the tag's permission collection

List permissions for a specific user
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

..

   List the permissions on Metadata for a given user


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       https://public.tenants.agaveapi.co/tags/v2/data/3042501574756462105-242ac113-0001-048/pems/nryan

.. code-block:: plaintext

   tags-pems-list -u rclemens \
       3042501574756462105-242ac113-0001-048

..

   The response will look something like the following:


.. code-block:: json

   {
     "username":"nryan",
     "permission":{
       "read":true,
       "write":true
     },
     "_links":{
       "self":{
         "href":"https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems/nryan"
       },
       "parent":{
         "href":"https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048"
       },
       "profile":{
         "href":"https://public.agaveapi.co/tags/v2/nryan"
       }
     }
   }

Checking permissions for a single user is simply a matter of adding the username of the user in question to the end of the tag permission collection.

Grant permissions
~~~~~~~~~~~~~~~~~

..

   Grant read access to a tag


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
       --data '{"permission":"READ"}'
       https://public.tenants.agaveapi.co/tags/v2/data/3042501574756462105-242ac113-0001-048/pems/rclemens

.. code-block:: plaintext

   tags-pems-addupdate -u rclemens \
       -p READ 3042501574756462105-242ac113-0001-048

..

   Grant read and write access to a tag


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
       --data '{"permission":"READ_WRITE"}'
       https://public.tenants.agaveapi.co/tags/v2/data/3042501574756462105-242ac113-0001-048/pems/rclemens

.. code-block:: plaintext

   tags-pems-addupdate -u rclemens \
       -p READ_WRITE 3042501574756462105-242ac113-0001-048

..

   The response will look something like the following:


.. code-block:: json

   {
     "username": "rclemens",
     "permission": {
       "read": true,
       "write": true
     },
     "_links": {
       "self": {
         "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems/rclemens"
       },
       "parent": {
         "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048"
       },
       "profile": {
         "href": "https://public.agaveapi.co/tags/v2/jstubbs"
       }
     }
   }

To grant another user read access to your tag, assign them ``READ`` permission. To enable another user to update a tag, grant them ``READ_WRITE`` or ``ALL`` access.

Delete single user permissions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

..

   Delete permission for single user on a Metadata item


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X DELETE
       https://public.tenants.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems/rclemens

.. code-block:: plaintext

   tags-pems-delete -u rclemens 3042501574756462105-242ac113-0001-048

..

   An empty response will come back from the API.


Permissions may be deleted for a single user by making a DELETE request on the tag's user permission resource. This will immediately revoke all permissions to the tag for that user.


.. raw:: html

   <aside class="info">Please note that ownership cannot be revoked or reassigned. The user who created the tag will always have ownership of that item.</aside>


Deleting all permissions
~~~~~~~~~~~~~~~~~~~~~~~~

..

   Delete all permissions on a Metadata item


.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X DELETE
       https://public.tenants.agaveapi.co/tags/v2/demo/pems

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
       -X DELETE
       https://public.tenants.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems

.. code-block:: plaintext

   tags-pems-delete demo
   tags-pems-delete 3042501574756462105-242ac113-0001-048

..

   An empty response will be returned from the service.


Permissions may be deleted for a single user by making a DELETE request on the tag resource permission collection.


.. raw:: html

   <aside class="info">The above operation will delete all permissions for a tag, such that only the owner will be able to access it. Use with care.</aside>

