.. role:: raw-html-m2r(raw)
   :format: html


Cloning systems
===============

Sharing systems through the use of roles allows other people to run jobs and access data on that system. When that happens, the users to whom you granted roles are accessing the system under your account. While they do :raw-html-m2r:`<em>NOT</em>` have access to your credentials, they do have access to the system using whatever account you use to authenticate. In most situations, this is not a problem. It is not uncommon to use a shared (or community account) within an application. However sometimes it is preferable for users to use their own account rather than yours. One way to do this is to simply re-send the same system description with a different ID. Another is to use the cloning feature of the Systems service.

Cloning an existing system will create a new system, with a new id, and all attributes copied over with the exception of the original system's authentication information and roles. You will be assigned owner of the system clone, but will still need to add your own credentials in order to do anything useful.

To clone a system, you make a PUT request on the system's url and pass it a new system id.

.. code-block:: plaintext

   systems-clone -v -I systest.demo.clone $SYSTEM_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"clone","id":"systest.demo.clone"}'
          https://api.tacc.utexas.edu/systems/v2/$SYSTEM_ID

   {: .solution}


The response will look something like the following:

.. code-block:: json

   {
     "site": null,
     "id": "systest.demo.clone",
     "revision": 1,
     "default": false,
     "lastModified": "2016-09-06T17:57:44.620-05:00",
     "status": "UP",
     "description": "My example storage system using SFTP to store data for testing",
     "name": "Example SFTP Storage System",
     "owner": "nryan",
     "globalDefault": false,
     "available": true,
     "uuid": "5950027791507722726-242ac117-0001",
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
       "rootDir": "/"
     },
     "_links": {
       "roles": {
         "href": "https://api.tacc.utexas.edu/systems/v2/systest.demo.clone/roles"
       },
       "owner": {
         "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
       },
       "credentials": {
         "href": "https://api.tacc.utexas.edu/systems/v2/systest.demo.clone/credentials"
       },
       "self": {
         "href": "https://api.tacc.utexas.edu/systems/v2/systest.demo.clone"
       },
       "metadata": {
         "href": "https://api.tacc.utexas.edu/meta/v2/data/?q=%7B%22associationIds%22%3A%225950027791507722726-242ac117-0001%22%7D"
       }
     }
   }
