.. role:: raw-html-m2r(raw)
   :format: html


Permissions
===========

Apps have fine grained permissions similar to those found in the `Jobs <../jobs/job-permissions>`_ and `Files <../files/files-permissions>`_ services. Using these, you can share your app other Agave users. App permissions are private by default, so when you first POST your app to the Apps service, you are the only one who can see it. You may share your app with other users by granting them varying degrees of permissions. The full list of app permission values are listed in the following table.


.. raw:: html

   <table>
   <thead>
   <tr>
   <th>Permission</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>READ</td>
   <td>Gives the ability to view the app description.</td>
   </tr>
   <tr>
   <td>WRITE</td>
   <td>Gives the ability to update the app.</td>
   </tr>
   <tr>
   <td>EXECUTE</td>
   <td>Gives the ability to submit jobs using the app</td>
   </tr>
   <tr>
   <td>ALL</td>
   <td>Gives full READ and WRITE and EXECUTE permissions to the user.</td>
   </tr>
   <tr>
   <td>READ_WRITE</td>
   <td>Gives full READ and WRITE permissions to the user</td>
   </tr>
   <tr>
   <td>READ_EXECUTE</td>
   <td>Gives full READ and EXECUTE permissions to the user</td>
   </tr>
   <tr>
   <td>WRITE_EXECUTE</td>
   <td>Gives full WRITE and EXECUTE permissions to the user</td>
   </tr>
   </tbody>
   </table>


App permissions are distinct from all other roles and permissions and do not have implications outside the Apps service. This means that if you want to allow someone to run a job using your app, it is not sufficient to grant them READ_EXECUTE permissions on your app. They must also have an appropriate user role on the execution system on which the app will run. Similarly, if you do not have the right to publish on the ``executionSystem`` or access the ``deploymentPath`` on the ``deploymentSystem`` in your app description, you will not be able to publish your app.

Listing permissions
-------------------

App permissions are managed through a set of URLs consistent with the permission operations elsewhere in the API. To query for a user's permission for an app, perform a GET on the user's unique app permissions url.

You can use the following CLI command:

.. code-block:: plaintext

   apps-pems-list -v -u $USERNAME $APP_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
      https://agave.iplantc.org/apps/v2/$APP_ID/pems/$USERNAME?pretty=true

   {: .solution}


The response from the service will be a JSON object representing the user permission. If the user does not have a permission for that app, the permission value will be NONE. By default, only you have permission to your private apps. Public apps will return a single permission for the :raw-html-m2r:`<em>public</em>` meta user rather than return a permissions for every user.

..

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
       "username": "$USERNAME",
       "permission": {
         "read": true,
         "write": true,
         "execute": true
       },
       "_links": {
         "self": {
           "href": "https://agave.iplantc.org/apps/v2/$APP_ID/pems/$USERNAME"
         },
         "app": {
           "href": "https://agave.iplantc.org/apps/v2/$APP_ID"
         },
         "profile": {
           "href": "https://agave.iplantc.org/profiles/v2/$USERNAME"
         }
       }
      }

   {: .solution}


You can also query for all permissions granted on a specific app by making a GET request on the app's permission collection.

.. code-block:: plaintext

   apps-pems-list -v $APP_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
      https://agave.iplantc.org/apps/v2/$APP_ID/pems?pretty=true

   {: .solution}


This time the service will respond with a JSON array of permission objects.

..

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      [
       {
         "username": "$USERNAME",
         "permission": {
           "read": true,
           "write": true,
           "execute": true
         },
         "_links": {
           "self": {
             "href": "https://agave.iplantc.org/apps/v2/$APP_ID/pems/$USERNAME"
           },
           "app": {
             "href": "https://agave.iplantc.org/apps/v2/$APP_ID"
           },
           "profile": {
             "href": "https://agave.iplantc.org/profiles/v2/$USERNAME"
           }
         }
       }

   {: .solution}


Adding and updating permissions
-------------------------------

Setting permissions is done by posting a JSON object containing a permission and username. Alternatively, you can POST just the permission and append the username to the URL.

.. code-block:: plaintext

   apps-pems-update -v -u bgibson -p READ $APP_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      # Standard syntax to grant permissions to a specific user
      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "username=bgibson&permission=READ" https://agave.iplantc.org/apps/v2/$APP_ID/pems?pretty=true

      # Abbreviated POST data to grant permission to a single user
      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "permission=READ" https://agave.iplantc.org/apps/v2/$APP_ID/pems/bgibson?pretty=true

   {: .solution}
   The response will contain a JSON object representing the permission that was just created.

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
       "username": "bgibson",
       "permission": {
         "read": true,
         "write": false,
         "execute": false
       },
       "_links": {
         "self": {
           "href": "https://agave.iplantc.org/apps/v2/$APP_ID/pems/bgibson"
         },
         "app": {
           "href": "https://agave.iplantc.org/apps/v2/$APP_ID"
         },
         "profile": {
           "href": "https://agave.iplantc.org/profiles/v2/bgibson"
         }
       }
      }

   {: .solution}


Deleting permissions
--------------------

Permissions can be deleted on a user-by-user basis, or all at once. To delete an individual user permission, make a DELETE request on the user's app permission URL.

.. code-block:: plaintext

   apps-pems-delete -u bgibson $APP_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://agave.iplantc.org/apps/v2/$APP_ID/pems/bgibson?pretty=true

   {: .solution}

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   The CLI response will be:

   .. code-block::

      Successfully removed permission for bgibson on app $APP_ID

   And the cURL response will be an empty result object.
   {: .solution}


You can accomplish the same thing by updating the user permission to an empty value.

.. code-block:: plaintext

   apps-pems-update -v -u bgibson $APP_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      # Delete permission for a single user by updating with an empty permission value
      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"  \
          -X POST -d "username=bgibson" -d "permission=NONE" \
          https://agave.iplantc.org/apps/v2/$APP_ID/pems?pretty=true

      # Delete permission for a single user by updating with an empty permission value
      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -X POST -d "permission=" \
          https://agave.iplantc.org/apps/v2/$APP_ID/pems/bgibson?pretty=true

   {: .solution}


Since this is an update operation, the resulting JSON permission object will be returned showing the user has no permissions to the app anymore.

..

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
       "username": "bgibson",
       "permission": {
         "read": false,
         "write": false,
         "execute": false
       },
       "_links": {
         "self": {
           "href": "https://agave.iplantc.org/apps/v2/$APP_ID/pems/bgibson"
         },
         "app": {
           "href": "https://agave.iplantc.org/apps/v2/$APP_ID"
         },
         "profile": {
           "href": "https://agave.iplantc.org/profiles/v2/bgibson"
         }
       }
      }

   {: .solution}


To delete all permissions for an app, make a DELETE request on the app's permissions collection.

.. code-block:: plaintext

   apps-pems-delete $APP_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -X DELETE \
          https://agave.iplantc.org/apps/v2/$APP_ID/pems?pretty=true

   {: .solution}


The response will be an empty result object.

App Publishing
--------------

In addition to traditional permissions, apps also have a concept of scope. Unless otherwise configured, apps are private to the owner and the users they grant permission. Applications can, however move from the private space into the public space for use any anyone. Moving an app into the public space is called *publishing*. Publishing an app gives it much greater exposure and results in increased usage by the user community. It also comes with increased responsibilities for the original owner as well as the API administrators. Several of these are listed below:


* Public apps must run on public systems. This makes the app available to everyone.
* Public apps must be vetted for performance, reliability, and security by the API administrators.
* The original app author must remain available via email for ongoing support.
* Public apps must be copied into a public repository and checksummed.
* Updates to public apps must result in a snapshot of the original app being created and stored with its resulting checksum in a separate location.
* API administrators must maintain and support the app throughout its lifetime.

..

   :information_source: If you have an app you would like to see published, please contact your API administrators for more information.


Publishing an app
-----------------

To publish an app, make a PUT request on the app resource. In this example, we publish the ``wc-osg-1.00`` app.

.. code-block:: plaintext

   apps-publish -e condor.opensciencegrid.org wc-osg-1.00

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"publish","executionSystem":"condor.opensciencegrid.org"}'
          https://agave.iplantc.org/apps/v2/wc-osg-1.00?pretty=true

   {: .solution}

   The response from the service will resemble the following:

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
       "id": "wc-osg-1.00u1",
       "name": "wc-osg",
       "icon": null,
       "uuid": "8734854070765284890-242ac116-0001-005",
       "parallelism": "SERIAL",
       "defaultProcessorsPerNode": 1,
       "defaultMemoryPerNode": 1,
       "defaultNodeCount": 1,
       "defaultMaxRunTime": null,
       "defaultQueue": null,
       "version": "1.00",
       "revision": 1,
       "isPublic": false,
       "helpURI": "http://www.gnu.org/s/coreutils/manual/html_node/wc-invocation.html",
       "label": "wc condor",
       "shortDescription": "Count words in a file",
       "longDescription": "",
       "tags": [
         "gnu",
         "textutils"
       ],
       "ontology": [
         "http://sswapmeet.sswap.info/algorithms/wc"
       ],
       "executionType": "CONDOR",
       "executionSystem": "condor.opensciencegrid.org",
       "deploymentPath": "/agave/apps/wc-1.00",
       "deploymentSystem": "public.storage.agave",
       "templatePath": "/wrapper.sh",
       "testPath": "/wrapper.sh",
       "checkpointable": true,
       "lastModified": "2016-09-15T04:48:17.000-05:00",
       "modules": [
         "load TACC",
         "purge"
       ],
       "available": true,
       "inputs": [
         {
           "id": "query1",
           "value": {
             "validator": "",
             "visible": true,
             "required": false,
             "order": 0,
             "enquote": false,
             "default": [
               "read1.fq"
             ]
           },
           "details": {
             "label": "File to count words in: ",
             "description": "",
             "argument": null,
             "showArgument": false,
             "repeatArgument": false
           },
           "semantics": {
             "minCardinality": 1,
             "maxCardinality": -1,
             "ontology": [
               "http://sswapmeet.sswap.info/util/TextDocument"
             ],
             "fileTypes": [
               "text-0"
             ]
           }
         }
       ],
       "parameters": [],
       "outputs": [
         {
           "id": "outputWC",
           "value": {
             "validator": "",
             "order": 0,
             "default": "wc_out.txt"
           },
           "details": {
             "label": "Text file",
             "description": "Results of WC"
           },
           "semantics": {
             "minCardinality": 1,
             "maxCardinality": 1,
             "ontology": [
               "http://sswapmeet.sswap.info/util/TextDocument"
             ],
             "fileTypes": []
           }
         }
       ],
       "_links": {
         "self": {
           "href": "https://public.agaveapi.co/apps/v2/wc-osg-1.00u1"
         },
         "executionSystem": {
           "href": "https://public.agaveapi.co/systems/v2/condor.opensciencegrid.org"
         },
         "storageSystem": {
           "href": "https://public.agaveapi.co/systems/v2/public.storage.agave"
         },
         "history": {
           "href": "https://public.agaveapi.co/apps/v2/wc-osg-1.00u1/history"
         },
         "metadata": {
           "href": "https://public.agaveapi.co/meta/v2/data/?q=%7B%22associationIds%22%3A%228734854070765284890-242ac116-0001-005%22%7D"
         },
         "owner": {
           "href": "https://public.agaveapi.co/profiles/v2/nryan"
         },
         "permissions": {
           "href": "https://public.agaveapi.co/apps/v2/wc-osg-1.00u1/pems"
         }
       }
      }

   {: .solution}


Notice a few things about the response.


#. Both the ``executionSystem`` and ``deploymentSystem`` have changed. **Public apps must run and store their assets on public systems.**
#. We did not specify the ``deploymentSystem`` where the public app assets should be stored, so Agave placed them on the default public storage system, ``public.storage.agave``.
#. We did not specify the ``deploymentPath`` where the public app assets should be stored, so Agave placed them in the ``publicAppsDir`` of the ``deploymentPath``.
#. The ``deploymentPath`` is now a zip archive rather than a folder. Agave does this because once, published, the app can no longer be updated, so the assets are frozen and stored in a separate location, removed from user access.
#. The ``id`` of the app has changed. It now has a ``u1`` appended to the original app id. This indicates that it is a public app and that it has been updated a single time. If we were to publish the app again, the resulting ``id`` would be ``wc-osg-1.00u2``. This differs from unpublished apps whose revision number increments without impacting the app id. **Every time you publish an app, the id of the resulting public app will change.**

Disabling an App
----------------

Unpublishing a public system is equivalent to disabling it.

Unlike systems, it is not possible to unpublish an app. Once published, a deep copy of the app is store in an external location with its own provenance trail. If you would like to remove a published app from further use, simply disable it.

.. code-block:: plaintext

   apps-disable -v $APP_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -X PUT -d "action=disable"
          https://agave.iplantc.org/apps/v2/$APP_ID?pretty=true

   {: .solution}


The response will look identical to before, but with ``available`` set to *false*

Cloning an app
--------------

Often times you will want to copy an existing app for use on another system, or simply to obtain a private copy of the app for your own use. This can be done using the clone functionality in the Apps service. The following tabs show how to do this using the unix ``curl`` command as well as with the Agave CLI.

.. code-block:: plaintext

   apps-clone -N my-pyplot-demo -V 2.2 demo-pyplot-demo-advanced-0.1.0

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -X PUT 'https://agave.iplantc.org/apps/v2/$APP_ID?pretty=true' \
          --data-urlencode action=clone \
          --data-urlencode name=$NEW_APP_NAME \
          --data-urlencode version=0.1.2 \
          --data-urlencode deploymentSystem= $STORAGE_SYSTEM \
          --data-urlencode executionSystem= $EXECUTION_SYSTEM

   {: .solution}

   :information_source: When cloning public apps, the entire app bundle will be recreated on the ``deploymentSystem`` you specify or your default storage system. The same is not true for private apps. Cloning a private app will copy the job description, but not the app bundle. This is to honor the original ownership of the assets and prevent them from leaking out to the public space without the owner's permission. If you need direct access to the app's assets, request that the owner give you read access to the folder listed as the deploymentPath in the app description.

