.. role:: raw-html-m2r(raw)
   :format: html


Disabling
=========

Disable a system

.. code-block:: plaintext

   systems-disable $SYSTEM_ID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN"
          -H "Content-Type: application/json"
          -X PUT --data-binary '{"action": "disable"}'
          https://public.agaveapi.co/systems/v2/$SYSTEM_ID
|


The response will look something like the following:

.. code-block:: json

   {
     "site": null,
     "id": "sftp.storage.example.com",
     "revision": 1,
     "default": false,
     "lastModified": "2016-09-06T17:46:42.621-05:00",
     "status": "UP",
     "description": "My example storage system using SFTP to store data for testing",
     "name": "Example SFTP Storage System",
     "owner": "nryan",
     "globalDefault": false,
     "available": false,
     "uuid": "4036169328045649434-242ac117-0001-006",
     "public": false,
     "type": "STORAGE",
     "storage": {
       "mirror": false,
       "port": 22,
       "homeDir": "/home/systest",
       "protocol": "SFTP",
       "host": "storage.example.com",
       "publicAppsDir": null,
       "proxy": null,
       "rootDir": "/",
       "auth": {
         "type": "PASSWORD"
       }
     },
     "_links": {
       "roles": {
         "href": "https://public.agaveapi.co/systems/v2/sftp.storage.example.com/roles"
       },
       "owner": {
         "href": "https://public.agaveapi.co/profiles/v2/nryan"
       },
       "credentials": {
         "href": "https://public.agaveapi.co/systems/v2/sftp.storage.example.com/credentials"
       },
       "self": {
         "href": "https://public.agaveapi.co/systems/v2/sftp.storage.example.com"
       },
       "metadata": {
         "href": "https://public.agaveapi.co/meta/v2/data/?q=%7B%22associationIds%22%3A%224036169328045649434-242ac117-0001-006%22%7D"
       }
     }
   }

There may be times when you need to disable a system. If your system has scheduled maintenance periods, you may want to disable the system until the maintenance period ends. You can do this by making a PUT request on a monitor with the a field name ``action`` set to "disabled", or simply updating the status to "MAINTENANCE". While disabled, all apps and jobs will be disabled. All file operations will be rejected during system downtimes as well. Once restored, all operations will pick back up.

Enabling a system
-----------------

Enable a system

.. code-block:: plaintext

   systems-enable $SYSTEM_ID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN"
          -H "Content-Type: application/json"
          -X PUT --data-binary '{"action": "enable"}'
          https://public.agaveapi.co/systems/v2/$SYSTEM_ID
|


The response will look something like the following:

.. code-block:: json

   {
     "site": null,
     "id": "sftp.storage.example.com",
     "revision": 1,
     "default": false,
     "lastModified": "2016-09-06T17:46:42.621-05:00",
     "status": "UP",
     "description": "My example storage system using SFTP to store data for testing",
     "name": "Example SFTP Storage System",
     "owner": "nryan",
     "globalDefault": false,
     "available": true,
     "uuid": "4036169328045649434-242ac117-0001-006",
     "public": false,
     "type": "STORAGE",
     "storage": {
       "mirror": false,
       "port": 22,
       "homeDir": "/home/systest",
       "protocol": "SFTP",
       "host": "storage.example.com",
       "publicAppsDir": null,
       "proxy": null,
       "rootDir": "/",
       "auth": {
         "type": "PASSWORD"
       }
     },
     "_links": {
       "roles": {
         "href": "https://public.agaveapi.co/systems/v2/sftp.storage.example.com/roles"
       },
       "owner": {
         "href": "https://public.agaveapi.co/profiles/v2/nryan"
       },
       "credentials": {
         "href": "https://public.agaveapi.co/systems/v2/sftp.storage.example.com/credentials"
       },
       "self": {
         "href": "https://public.agaveapi.co/systems/v2/sftp.storage.example.com"
       },
       "metadata": {
         "href": "https://public.agaveapi.co/meta/v2/data/?q=%7B%22associationIds%22%3A%224036169328045649434-242ac117-0001-006%22%7D"
       }
     }
   }

Similarly, to enable a monitor, make a PUT request with the a field name ``action`` set to "enabled". Once reenabled, the monitor will resume its previous check schedule as specified in the ``nextUpdate`` field, or immediately if that time has already expired.

Deleting systems
----------------

.. code-block:: plaintext

   systems-delete $SYSTEM_ID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/systems/v2/$SYSTEM_ID
|


The call will return an empty result.

In the event you wish to delete a system, you can make a DELETE request on the system URL. Deleting a system will disable the system and all applications published on that system from use. Any running jobs will be continue to run, but all pending, archiving, paused, and staged jobs will be killed, and any data archived on that system will no longer be available. Restoring a deleted system requires intervention from your tenant admin. Once deleted, the system id cannot be reused at a later time. Use this operation with care.

If you simply wish to remove a system from service, you can update the system :raw-html-m2r:`<strong>status</strong>` or :raw-html-m2r:`<strong>available</strong>` attributes depending on whether you want to disable user or visibility.

Multi-user environments
-----------------------

If your application supports a multi-user environment and those users do not have API accounts, then you may run into a situation where you are juggling multiple user credentials for a single system. Agave has a solution for this problem in the for of its Internal User feature. You can map your application users into a private user store Agave provides you and assign those users credentials on your systems. This allows you to move seamlessly from community users to private users and back without having to alter your application code. For a deep discussion on the mechanics and implications of credential management with internal users, see the :raw-html-m2r:`<a href="#internal-user-credential-management/" title="Internal User Credential Management">Internal User Credential Management</a>` guide.
