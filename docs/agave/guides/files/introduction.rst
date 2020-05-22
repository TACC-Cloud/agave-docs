.. role:: raw-html-m2r(raw)
   :format: html


Files
=====

The Tapis Files service allows you to manage data across multiple storage systems using multiple protocols. It supports traditional file operations such as directory listing, renaming, copying, deleting, and upload/download that are traditional to most file services. It also supports file importing from arbitrary locations, metadata assignment, and a full access control layer allowing you to keep your data private, share it with your colleagues, or make it publicly available.

Files service URL structure
---------------------------

Canonical URL for all file items accessible in the Platform

.. code-block:: plaintext

   https://api.tacc.utexas.edu/files/v2/media/system/$SYSTEM_ID/$PATH

Every file and directory referenced through the Files service has a canonical URL show in the first example. The following table defines each component:


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Token</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>$SYSTEM_ID</td>
               <td>The id of the system where the file or directory lives. The correspond to the ids returned from the Systems service.</td>
           </tr>
           <tr>
               <td>$PATH</td>
               <td>(<i>Optional:</i>) The path on the remote system. By default, all paths are relative to the home directory defined in the system description. To specify an absolute path, prefix the path with a `/`. For more on path resolution, see the next section.</td>
           </tr>
       </tbody>
   </table>
|

Tapis also supports the concept of *default systems*. Excluding the ``/system/$SYSTEM_ID`` segments from the above URL, the Files service will automatically assume you are referencing your default storage system. Thus, if your default system was ``api.tacc.cloud``\ , the following two examples would be identical.

If ``api.tacc.cloud`` is your default storage system then

.. code-block:: plaintext

   https://api.tacc.utexas.edu/files/v2/media/shared

is equivalent to this:

.. code-block:: plaintext

   https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/shared

This comes in especially handy when referencing your default system paths in other contexts such as job requests and when interacting with the Tapis CLI. A good example of this situation is when you have a global default storage system accessible to all your users. In this case, most users will use that for all of their data staging and archiving needs. These users may find it easier not to even think about the system they are using. The default system support in the Files service allows them to do just that.

When building applications against the Files service, it is considered a best practice to always specify the intended system ID when constructing URL paths to avoid situations where users change their default systems. This will also provide long-term stability to your data references and make debugging much easier. You can read more about default systems in the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/systems/introduction.html" title="System Management">Systems Guide</a>`.

Understanding file paths
------------------------

One powerful, but potentially confusing feature of Tapis is its support for virtualizing systems paths. Every registered system specifies both a root directory, ``rootDir``\ , and a home directory, ``homeDir`` attribute in its storage configuration. ``rootDir`` tells Tapis the absolute path on the remote system that it should treat as ``/``. Similar to the Linux ``chroot`` command; no requests made to Tapis will ever be resolved to locations outside of ``rootDir``.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Type of storage system</th>
               <th>Examples of rootDir values</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>Linux</td>
               <td><ul><li>Actual system root directory, `/`</li><li>RAID array physically attached to the system</li><li>NSF mount you want to share</li><li>An arbitrary file path, such as your `$HOME` directory from which you want to server application data.</li></ul></td>
           </tr>
           <tr>
               <td>Cloud</td>
               <td><ul><li>A bucket on S3</li><li>A folder/marker file in your object store</li></ul></td>
           </tr>
           <tr>
               <td>iRODS</td>
               <td><ul><li>A specific resource or zone you want to expose.</li><li>A collection you want to publish for use</li><li>Your personal home folder</li></ul></td>
           </tr>
       </tbody>
   </table>
|

``homeDir`` specifies the path, relative to ``rootDir``\ , that Tapis should use for relative paths. Since Tapis is stateless, there is no concept of a current working directory. Thus, when you specify a path to Tapis that does not begin with a ``/``\ , Tapis will always prefix the path with the value of ``homeDir``. The following table gives several examples of how different combinations of ``rootDir``\ , ``homeDir``\ , and URL paths will be resolved by Tapis.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>"rootDir" value</th>
               <th>"homeDir" value</th>
               <th>Tapis URL path</th>
               <th>Resolved path on system</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>/</td>
               <td>/</td>
               <td>--</td>
               <td>/</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/</td>
               <td>..</td>
               <td>/</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/</td>
               <td>home</td>
               <td>/home</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/</td>
               <td>/home</td>
               <td>/home</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>--</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>/</td>
               <td>/</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>..</td>
               <td>/home</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>nryan</td>
               <td>/home/nryan/nryan</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>/nryan</td>
               <td>/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/</td>
               <td>--</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/</td>
               <td>..</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/home</td>
               <td>/</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/home</td>
               <td>..</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/home</td>
               <td>home</td>
               <td>/home/nryan/home/home</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/home</td>
               <td>/bgibson</td>
               <td>/home/nryan/bgibson</td>
           </tr>
       </tbody>
   </table>
|

Transferring data
=================

Before we talk about how to do basic operations on your data, let's first talk about how you can move your data around. You already have a storage system available to you, so we will start with the "hello world" of data movement, uploading a file.

Uploading data
--------------

Uploading a file

.. code-block:: plaintext

   tapis files upload agave://tacc.work.taccuser files/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X POST \
            -F "fileToUpload=@files/picksumipsum.txt" \
            https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan
|


The response will look something like this:

.. code-block:: json

   {
       "internalUsername": null,
       "lastModified": "2014-09-03T10:28:09.943-05:00",
       "name": "picksumipsum.txt",
       "nativeFormat": "raw",
       "owner": "nryan",
       "path": "/home/nryan/picksumipsum.txt",
       "source": "http://127.0.0.1/picksumipsum.txt",
       "status": "STAGING_QUEUED",
       "systemId": "api.tacc.cloud",
       "uuid": "0001409758089943-5056a550b8-0001-002",
       "_links": {
           "history": {
               "href": "https://api.tacc.utexas.edu/files/v2/history/system/api.tacc.cloud/nryan/picksumipsum.txt"
           },
           "self": {
               "href": "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan/picksumipsum.txt"
           },
           "system": {
               "href": "https://api.tacc.utexas.edu/systems/v2/api.tacc.cloud"
           }
       }
   }

You may upload data to a remote systems by performing a multipart POST on the FILES service. If you are using the Tapis CLI, you can perform recursive directory uploads. If you are manually calling curl or building an app with the Tapis SDK, you will need to implement the recursion yourself. You can take a look in the ``files-upload`` script to see how this is done. The following is an example of how to upload a file that we will use in the remainder of this tutorial.

You will see a progress bar while the file uploads, followed by a response from the server with a description of the uploaded file. Tapis does not block during data movement operations, so it may be just a moment before the file physically shows up on the remote system.

Importing data
--------------

You can also have Tapis download data from an external URL. Rather than making a multipart file upload request, you can pass in a JSON object with the URL and an optional target file name, type, and array of notifications subscriptions. Tapis supports several protocols for ingestion listed in the next table.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Schema</th>
               <th>Details</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>http</td>
               <td>Supported with and without user info</td>
           </tr>
           <tr>
               <td>https</td>
               <td>Supported with and without user info</td>
           </tr>
           <tr>
               <td>ftp</td>
               <td>Anonymous FTP only</td>
           </tr>
           <tr>
               <td>sftp</td>
               <td>User info required in URL</td>
           </tr>
           <tr>
               <td>agave</td>
               <td>No user info supported.</td>
           </tr>
       </tbody>
   </table>
|

To demonstrate how this works, we will import a README.md file from the :raw-html-m2r:`<a href="https://bitbucket.org/agaveapi/science-api-samples" title="Tapis Samples" target="_blank">Tapis Samples</a>` git repository in Bitbucket.

Download a file from a web accessible URL

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
            -- data &#039;{ "url":"https://bitbucket.org/agaveapi/science-api-samples/raw/master/README.md"}&#039;
            https://api.tacc.utexas.edu/files/v2/media/api.tacc.cloud/nryan
|


The response will look something like this:

.. code-block:: json

   {
       "name" : "README.md",
       "uuid" : "0001409758713912-5056a550b8-0001-002",
       "owner" : "nryan",
       "internalUsername" : null,
       "lastModified" : "2014-09-10T20:00:55.266-05:00",
       "source" : "https://bitbucket.org/agaveapi/science-api-samples/raw/master/README.md",
       "path" : "/home/nryan/README.md",
       "status" : "STAGING_QUEUED",
       "systemId" : "api.tacc.cloud",
       "nativeFormat" : "raw",
       "_links" : {
         "self" : {
           "href" : "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan/README.md"
         },
         "system" : {
           "href" : "https://api.tacc.utexas.edu/systems/v2/api.tacc.cloud"
         },
         "history" : {
           "href" : "https://api.tacc.utexas.edu/files/v2/history/system/api.tacc.cloud/nryan/README.md"
         }
       }
   }

Downloading data from a third party is done offline as an asynchronous activity, so the response from the server will come right away. One thing worth noting is that the file length given in the response will always be -1. This is because, generally speaking, Tapis does not know what the actual source file size is until after the repsonse is send back. The file size will be updated as the download progresses. You can track the progress by querying the destination file item's history. An entry will be present showing the progress of the download.

For this exercise, the file we just downloaded is just a few KB, so you should see it appear in your home folder on ``api.tacc.cloud`` almost immediately. If you were importing larger datasets, the transfer could take significantly longer depending on the network quality between Tapis and the source location. In this case, you would see the file size continue to increase until it completed. In the event of a failed transfer, Tapis will retry several times before canceling the transfer.

Tapis attempts to make smart decisions about how and when to transfer data. This includes leveraging third-party transfers whenever possible, scaling directory copies out horizontally, and taking advantage of chunked or parallel uploads. As a result, data may arrive in a non-deterministic way on the target system. This is normal and should be expected.

Transferring data
-----------------

Transferring data between systems

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST \
            --data-binary '{"url":"agave://stampede.tacc.utexas.edu//etc/motd"}' \
            https://api.tacc.utexas.edu/files/v2/media/api.tacc.cloud/nryan
|


The response from the service will be the same as the one we received importing a file.

Much like downloading data, Tapis can manage the transfer of data between registered systems. This is, in fact, how data is staged prior to running a simulation. Data transfers are carried out asynchronously, so you can simply start a transfer and go about your business. Tapis will ensure it completes. If you would like a notification when the transfer completes or reaches a certain stage, you can subscribe for one or more emails, :raw-html-m2r:`<a href="http://webhooks.org" title="Webhooks" target="_blank">webhooks</a>`\ , and/or realtime notifications, and Tapis will alert them when as the transfer progresses. The following table lists the available file events. For more information about the events and notifications systems, please see the :raw-html-m2r:`<a href="#notifications" title="Notifications Guide" target="_blank">Notifications Guide</a>` and :raw-html-m2r:`<a href="#event-reference" title="Event Reference" target="_blank">Event Reference</a>`.

In the example below, we will transfer a file from ``stampede.tacc.utexas.edu`` to ``api.tacc.cloud``. While the request looks pretty basic, there is a lot going on behind the scenes. Tapis will authenticate to both systems, check permissions, stream data out of Stampede using GridFTP and proxy it into ``api.tacc.cloud`` using the SFTP protocol, adjusting the transfer buffer size along the way to optimize throughput. Doing this by hand is both painful and error prone. Doing it with Tapis is nearly identical to copying a file from one directory to another on your local system.

One of the benefits of the Files service is that it frees you up to work in parallel and scale with your application demands. In the next example we will use the Files service to create redundant archives of a shared project directory.


.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST \
            --data-binary '{"url":"agave://api.tacc.cloud/nryan/foo_project"}' \
            https://api.tacc.utexas.edu/files/v2/media/system/nryan.storage1/
|


.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST \
            --data-binary '{"url":"agave://api.tacc.cloud/nryan/foo_project"}' \
            https://api.tacc.utexas.edu/files/v2/media/system/nryan.storage2/
|


Notice in the above examples that the Files services works identically regardless of whether the source is a file or directory. If the source is a file, it will copy the file. If the source is a directory, it will recursively process the contents until everything has been copied.

Basic data operations
=====================

Now that we understand how to move data into, out of, and between systems, we will look at how to perform file operations on the data. Again, remember that the Files service gives you a common REST interface to all your storage and execution systems regardless of the authentication mechanism or protocol they use. The examples below will use your default public storage system, but they would work identically with any storage system you have access to.

Directory listing
-----------------

Listing a file or directory

.. code-block:: plaintext

   tapis files list -v agave://tacc.work.taccuser/

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            https://api.tacc.utexas.edu/files/v2/listings/api.tacc.cloud/nryan
|


The response would look something like this:

.. code-block:: json

   [
       {
           "format": "folder",
           "lastModified": "2012-08-03T06:30:12.000-05:00",
           "length": 0,
           "mimeType": "text/directory",
           "name": ".",
           "path": "nryan",
           "permisssions": "ALL",
           "system": "api.tacc.cloud",
           "type": "dir",
           "_links": {
               "self": {
                   "href": "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan"
               },
               "system": {
                   "href": "https://api.tacc.utexas.edu/systems/v2/api.tacc.cloud"
               }
           }
       },
       {
       "format": "raw",
       "lastModified": "2014-09-10T19:47:44.000-05:00",
       "length": 3235,
       "mimeType": "text/plain",
       "name": "picksumipsum.txt",
       "path": "nryan/picksumipsum.txt",
       "permissions": "ALL",
       "system": "api.tacc.cloud",
       "type": "file",
       "_links": {
               "self": {
                   "href": "https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/nryan/picksumipsum.txt"
           },
           "system": {
               "href": "https://api.tacc.utexas.edu/systems/v2/api.tacc.cloud"
           }
       }
       }
   ]

Obtaining a directory listing, or information about a specific file is done by making a GET request on the ``/files/v2/listings/`` resource.

The response to this contains a summary listing of the contents of your home directory on  ``api.tacc.cloud``. Appending a file path to your commands above would give information on a specific file.

Move, copy, rename, delete
--------------------------

Basic file operations are available by sending a POST request the the ``/files/v2/media/`` collection with the following parameters.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Attribute</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>action</td>
               <td>The action you want to perform. Select one of "move", "copy", "rename", "mkdir".</td>
           </tr>
           <tr>
               <td>path</td>
               <td>Full path to the destination file or folder. This may be the name of a new directory or renamed file, or an absolute or relative Tapis path where the file or directory should be copied/moved.</td>
           </tr>
       </tbody>
   </table>
|

Copying files and directories
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

..

   Copy a file item within the same system.


.. code-block:: plaintext

   tapis files copy AGAVE_URI, DESTINATION

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X PUT \
            --data-binary '{"action":"copy","path":"$DESTPATH"}' \
            https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/$PATH
|


The response from a copy operation will be a JSON object describing the new file or folder.

Copying can be performed on any remote system. Unlike the Unix ``cp`` command, all copy invocations in Tapis will overwrite the destination target if it exists. In the event of a directory collision, the contents of the two directory trees will be merged with the source overwriting the destination. Any overwritten files will maintain their provenance records and have an additional entry added to record the copy operation.

Moving files and directories
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: plaintext

   tapis files move AGAVE_URI DESTINATION

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X PUT \
            --data-binary '{"action":"move","path":"$DESTPATH"}' \
            https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/$PATH
|


Moving can be performed on any remote system. Moving a file or directory will overwrite the destination target if it exists. Unlike copy operations, the destination will be completely replaced by the source in the event of a collision. No merge will take place. Further, the provenance of the source will replace that of the target.

Renaming files and directories
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X PUT \
            --data-binary '{"action":"rename","path":"$NEWNAME"}' \
            https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/$PATH
|


Renaming, like copying and moving, is only applicable within the context of a single system. Unlike on Unix systems, renaming and moving are not synonymous. When specifying a new name for a file or directory, the new name is relative to the parent directory of the original file or directory. Also, If a file or directory already exists with that name, the operation will fail and an error message will be returned. All provenance information will follow the renamed file or directory.

Creating a new directory
^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: plaintext

   tapis files mkdir AGAVE_URI DIRECTORY

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X PUT \
            --data-binary '{"action":"mkdir","path":"$NEWDIR"}' \
            https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/$PATH
|


Creating a new directory is a recursive action in Tapis. If the parent directories do not exist, they will be created on the fly. If a file or directory already exists with that name, the operation will fail and an error message will be returned.

Deleting a file item
^^^^^^^^^^^^^^^^^^^^

.. code-block:: plaintext

   tapis files delete AGAVE_URI

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X DELETE \
            https://api.tacc.utexas.edu/files/v2/media/system/api.tacc.cloud/$PATH
|


A standard Tapis response with an empty result value will be returned. As with creating a directory, deleting a file or directory is a recursive action in Tapis. No prompt or warning will be given once the request is sent. It is up to you to implement such checks in your application logic and/or user interface.
