
Metadata Permissions
====================

The Metadata service supports permissions for both Metadata and Schemata consistent with that of a number of other Agave services. If no permissions are explicitly set, only the owner of the Metadata and tenant administrators can access it.

The permissions available for Metadata and Metadata Schemata are listed in the following table. Please note that a user must have WRITE permissions to grant or revoke permissions on a metadata or schema item.

.. list-table::
   :header-rows: 1

   * - Name
     - Description
   * - READ
     - User can view the resource
   * - WRITE
     - User can edit, but not view the resource
   * - READ_WRITE
     - User can manage the resource
   * - ALL
     - User can manage the resource
   * - NONE
     - User can view the resource


:information_source: You need to change the uuids and usernames to for the queries below to work. 

Listing all permissions
-----------------------

..

   List the permissions on Metadata for a given user

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            https://public.tenants.agaveapi.co/meta/v2/data/7341557475441971686-242ac11f-0001-012/pems/rclemens?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Agave CLI**

     .. code-block:: shell

        metadata-pems-list -u rclemens \
            7341557475441971686-242ac11f-0001-012
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
          {
            "username": "rclemens",
            "permission": {
              "read": true,
              "write": true
            },
            "_links": {
              "self": {
                "href": "https://public.agaveapi.co/meta/v2/7341557475441971686-242ac11f-0001-012/pems/nryan"
              },
              "parent": {
                "href": "https://public.agaveapi.co/meta/v2/7341557475441971686-242ac11f-0001-012"
              },
              "profile": {
                "href": "https://public.agaveapi.co/meta/v2/nryan"
              }
            }
          }
        ]
|


To list all permissions for a metadata item, make a GET request on the metadata item's permission collection

List permissions for a specific user
------------------------------------

..

   List the permissions on Metadata for a given user

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            https://public.tenants.agaveapi.co/meta/v2/data/7341557475441971686-242ac11f-0001-012/pems/nryan?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Agave CLI**

     .. code-block:: shell

        metadata-pems-list -u rclemens \
            7341557475441971686-242ac11f-0001-012
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "username":"nryan",
          "permission":{
            "read":true,
            "write":true
          },
          "_links":{
            "self":{
              "href":"https://public.agaveapi.co/meta/v2/7341557475441971686-242ac11f-0001-012/pems/nryan"
            },
            "parent":{
              "href":"https://public.agaveapi.co/meta/v2/7341557475441971686-242ac11f-0001-012"
            },
            "profile":{
              "href":"https://public.agaveapi.co/meta/v2/nryan"
            }
          }
        }
|


Checking permissions for a single user is simply a matter of adding the username of the user in question to the end of the metadata permission collection.

Grant permissions
-----------------

..

   Grant read access to a metadata item

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
            --data '{"permission":"READ"}'
            https://public.tenants.agaveapi.co/meta/v2/data/7341557475441971686-242ac11f-0001-012/pems/rclemens?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Agave CLI**

     .. code-block:: plaintext

        metadata-pems-addupdate -u rclemens \
            -p READ 7341557475441971686-242ac11f-0001-012
|

   Grant read and write access to a metadata item

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
            --data '{"permission":"READ_WRITE"}'
            https://public.tenants.agaveapi.co/meta/v2/data/7341557475441971686-242ac11f-0001-012/pems/rclemens?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Agave CLI**

     .. code-block:: shell

        metadata-pems-addupdate -u rclemens \
            -p READ_WRITE 7341557475441971686-242ac11f-0001-012
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "username": "rclemens",
          "permission": {
            "read": true,
            "write": true
          },
          "_links": {
            "self": {
              "href": "https://public.agaveapi.co/meta/v2/7341557475441971686-242ac11f-0001-012/pems/rclemens"
            },
            "parent": {
              "href": "https://public.agaveapi.co/meta/v2/7341557475441971686-242ac11f-0001-012"
            },
            "profile": {
              "href": "https://public.agaveapi.co/meta/v2/jstubbs"
            }
          }
        }
|


To grant another user read access to your metadata item, assign them ``READ`` permission. To enable another user to update a metadata item, grant them ``READ_WRITE`` or ``ALL`` access.

Delete single user permissions
------------------------------

..

   Delete permission for single user on a Metadata item

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            -X DELETE
            https://public.tenants.agaveapi.co/meta/v2/data/7341557475441971686-242ac11f-0001-012/pems/rclemens?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Agave CLI**

     .. code-block:: shell

        metadata-pems-delete -u rclemens 7341557475441971686-242ac11f-0001-012
|

   An empty response will come back from the API.


Permissions may be deleted for a single user by making a DELETE request on the metadata user permission resource. This will immediately revoke all permissions to the metadata item for that user.

:information_source: Please note that ownership cannot be revoked or reassigned. The user who created the metadata item will always have ownership of that item.

Deleting all permissions
------------------------

..

   Delete all permissions on a Metadata item

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            -X DELETE
            https://public.tenants.agaveapi.co/meta/v2/data/7341557475441971686-242ac11f-0001-012/pems?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Agave CLI**

     .. code-block:: shell

        metadata-pems-delete 7341557475441971686-242ac11f-0001-012
|

   An empty response will be returned from the service.


Permissions may be deleted for a single user by making a DELETE request on the metadata resource permission collection.

:warning: The above operation will delete all permissions for a Metadata item, such that only the owner will be able to access it. Use with care.
