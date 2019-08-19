
File permissions
================

Tapis has a fine-grained permission model supporting use cases from creating and exposing readonly storage systems to sharing individual files and folders with one or more users. The permissions available for files items are listed in the following table. Please note that a user must have WRITE permissions to grant or revoke permissions on a file item.

.. list-table::
   :header-rows: 1

   * - Name
     - Description
   * - READ
     - User can view, but not edit or execute the resource
   * - WRITE
     - User can edit, but not view or execute the resource
   * - EXECUTE
     - User can execute, but not view or edit the resource
   * - READ_WRITE
     - User can view and write the resource, but not execute
   * - READ_EXECUTE
     - User can view and execute the resource, but not edit it
   * - WRITE_EXECUTE
     - User can edit and execute the resource, but not view it
   * - ALL
     - User has full control over the resource
   * - NONE
     - User has all permissions revoked on the given resource


Listing all permissions
-----------------------

List the permissions on a file item

.. code-block:: plaintext

   files-pems-list -S api.tacc.cloud nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          'https://tacc.cloud/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?pretty=true''
|


The response will look something like the following:

.. code-block:: json

   [
     {
       "username": "nryan",
       "internalUsername": null,
       "permission": {
         "read": true,
         "write": true,
         "execute": true
       },
       "recursive": true,
       "_links": {
         "self": {
           "href": "https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?username.eq=nryan"
         },
         "file": {
           "href": "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan/picksumipsum.txt"
         },
         "profile": {
           "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
         }
       }
     }
   ]

To list all permissions for a file item, make a GET request on the file item's permission collection

List permissions for a specific user
------------------------------------

List the permissions on a file item for a given user

.. code-block:: plaintext

   files-pems-list -u rclemens -S api.tacc.cloud nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?username=rclemens
|


The response will look something like the following:

.. code-block:: json

   {
     "username":"rclemens",
     "permission":{
       "read":true,
       "write":true
     },
     "_links":{
       "self":{
         "href":"https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?username=rclemens"
       },
       "parent":{
         "href":"https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt"
       },
       "profile":{
         "href":"https://api.tacc.utexas.edu/profiles/v2/rclemens"
       }
     }
   }

Checking permissions for a single user is done using Tapis URL query search syntax.

Grant permissions
-----------------

Grant read access to a file item

.. code-block:: plaintext

   files-pems-update -u rclemens -p READ -S api.tacc.cloud nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "Content-Type: application/json" \
          -X POST \
          --data '{"username":"rclemens", "permission":"READ"}' \
          https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt
|


Grant read and write access to a file item

.. code-block:: plaintext

   files-pems-update -u rclemens -p READ_WRITE -S api.tacc.cloud nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "Content-Type: application/json" \
          -X POST \
          --data '{"username","rclemens", "permission":"READ_WRITE"}' \
          https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt
|


The response will look something like the following

.. code-block:: json

   [
     {
       "username": "rclemens",
       "internalUsername": null,
       "permission": {
         "read": true,
         "write": true,
         "execute": false
       },
       "recursive": false,
       "_links": {
         "self": {
           "href": "https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?username.eq=rclemens"
         },
         "file": {
           "href": "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan/picksumipsum.txt"
         },
         "profile": {
           "href": "https://api.tacc.utexas.edu/profiles/v2/rclemens"
         }
       }
     }
   ]

To grant another user read access to your metadata item, assign them ``READ`` permission. To enable another user to update a file item, grant them ``READ_WRITE`` or ``ALL`` access.

Delete single user permissions
------------------------------

Delete permission for single user on a file item

.. code-block:: plaintext

   files-pems-update -u rclemens -p 'NONE' -S api.tacc.cloud nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST \
            --data '{"username","rclemens", "permission":"NONE"}' \
            https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt
|


A response similiar to the following will be returned

.. code-block:: json

   [
     {
       "username": "rclemens",
       "internalUsername": null,
       "permission": {
         "read": false,
         "write": false,
         "execute": false
       },
       "recursive": false,
       "_links": {
         "self": {
           "href": "https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?username.eq=rclemens"
         },
         "file": {
           "href": "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan/picksumipsum.txt"
         },
         "profile": {
           "href": "https://api.tacc.utexas.edu/profiles/v2/rclemens"
         }
       }
     }
   ]

Permissions may be deleted for a single user by making a DELETE request on the metadata user permission resource. This will immediately revoke all permissions to the file item for that user.

Please note that ownership cannot be revoked or reassigned. The user who created the metadata item will always have ownership of that item.

Deleting all permissions
------------------------

Delete all permissions on a file item

.. code-block:: plaintext

   files-pems-delete -S api.tacc.cloud nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST \
            --data '{"username","*", "permission":"NONE"}' \
            https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X DELETE \
            https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt
|


An empty response will be returned from the service. Permissions may be cleared for all users on a file item by making a DELETE request on the file item permission collection. 

The above operation will delete all permissions for a file item, such that only the owner will be able to access it. Use with care.

Recursive operations
--------------------

Recursively delete all permissions on a directory

.. code-block:: plaintext

   files-pems-delete -S api.tacc.cloud nryan/directory

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST \
            --data '{"username","*", "permission":"READ_WRITE", "recursive": true}' \
            https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/directory/

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X DELETE \
            https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?recursive=true
|


An empty response will be returned from the service on delete. Update will return something like the following.

.. code-block:: json

   [
     {
       "username": "nryan",
       "internalUsername": null,
       "permission": {
         "read": true,
         "write": true,
         "execute": true
       },
       "recursive": true,
       "_links": {
         "self": {
           "href": "https://api.tacc.utexas.edu/files/v2/pems/system/api.tacc.cloud/nryan/picksumipsum.txt?username.eq=nryan"
         },
         "file": {
           "href": "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan/picksumipsum.txt"
         },
         "profile": {
           "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
         }
       }
     }
   ]

When dealing with directories, the permission operations you perform will apply onto to the directory item itself. Permissions will not automatically propagate to the directory contents. In cases where you want to recursively apply permissions to the entire directory tree, you can do so by including the ``recursive`` attribute in your permission objects or to your URL query parameters when making a DELETE request.
