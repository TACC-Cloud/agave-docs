.. role:: raw-html-m2r(raw)
   :format: html


Managing Data
=============

In the last beginner's guide on system discovery we found several public systems we could use to test out the APIs. One of the great things about Tapis is that it takes care of all the protocol management and account juggling so you can focus on :raw-html-m2r:`<em>what</em>` you want to do rather than :raw-html-m2r:`<em>how</em>` to do it. Let's look at the storage system ``data.agaveapi.co`` to see how we can interact with data in Tapis.

Directory listing
-----------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/files/v2/listings/data.agaveapi.co/$API_USERNAME

.. code-block:: plaintext

   files-list -v -S data.agaveapi.co $API_USERNAME

.. code-block:: json

   [
       {
           "format": "folder",
           "lastModified": "2012-08-03T06:30:12.000-05:00",
           "length": 0,
           "mimeType": "text/directory",
           "name": ".",
           "path": "systest",
           "permisssions": "ALL",
           "system": "data.agaveapi.co",
           "type": "dir",
           "_links": {
               "self": {
                   "href": "https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest"
               },
               "system": {
                   "href": "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
               }
           }
       }
   ]

Browsing files and folders with Tapis's Files service is the same regardless of the type, location, or protocols used by the underlying storage system. Let's list our home directory to see how it's done.`

The response to this contains a summary listing of the contents of our home directory on ``data.agaveapi.co``. Appending a file path to our commands above would give information on a specific file.

Uploading data
--------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -F "fileToUpload=@files/picksumipsum.txt" https://public.tenants.agaveapi.co/files/v2/media/data.agaveapi.co/$API_USERNAME

.. code-block:: plaintext

   files-upload -v -F files/picksumipsum.txt -S data.agaveapi.co $API_USERNAME

.. code-block:: json

   {
       "_links": {
           "history": {
               "href": "https://public.tenants.agaveapi.co/files/v2/history/system/data.agaveapi.co/systest/picksumipsum.txt"
           },
           "self": {
               "href": "https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest/picksumipsum.txt"
           },
           "system": {
               "href": "https://public.tenants.agaveapi.co/systems/v2/data.agaveapi.co"
           }
       },
       "internalUsername": null,
       "lastModified": "2014-09-03T10:28:09.943-05:00",
       "name": "picksumipsum.txt",
       "nativeFormat": "raw",
       "owner": "systest",
       "path": "/iplant/home/systest/picksumipsum.txt",
       "source": "http://129.114.60.211/picksumipsum.txt",
       "status": "STAGING_QUEUED",
       "systemId": "data.agaveapi.co",
       "uuid": "0001409758089943-5056a550b8-0001-002"
   }

You may upload data to a remote systems by performing a multipart POST on the FILES service. Using the CLI, recursive directory uploads are supported. If you are manually calling curl, you will need to manually create the directories and upload the local contents one at a time. You can take a look in the ``files-upload`` script to see how this is done. Let's keep moving forward with our lesson by uploading a file we can use in the rest of this section. 

You will see a progress bar while the file uploads, followed by a response from the server with a description of the uploaded file. Tapis does not block during data movement operations, so it may be just a second before the file physically shows up on the remote system.

Importing data from a URL
-------------------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" 
       -H "Content-Type: application/json" 
       -X POST -F "fileToUpload=@" 
       https://public.tenants.agaveapi.co/files/v2/media/data.agaveapi.co/$API_USERNAME
   { 
     "url": "https://bitbucket.org/agaveapi/science-api-samples/raw/master/README.md" 
   }

.. code-block:: plaintext

   files-import -U "https://bitbucket.org/agaveapi/science-api-samples/raw/master/README.md" -S data.agaveapi.co $API_USERNAME

You can also import data from an external URL. Rather than making a multipart file upload request, you can pass in JSON object with the URL and an optional target file name, file type, and array of notifications which should be made when the import completes. The next example will import a the README.md file from the Tapis Samples git repository in Bitbucket.  in the  Let's keep moving forward with our lesson by uploading a file we can use in the rest of this section.

Importing data from a third party is done offline as an asynchronous activity, so the response from the server will come right away. One thing worth noting is that the file length given in the response will always be -1. This is because Tapis does not know what the actual file size is yet. That will be updated later on, after the transfer has finished.

For this exercise, the file we just imported is just a few KB, so you should see it appear in your home folder on ``data.agaveapi.co`` almost immediately. If you were importing larger datasets, the transfer could take significantly longer depending on the network quality between Tapis and the source location. In this case, you would see the file size continue to increase until it completed. In the event of a failed transfer, Tapis will retry 3 times before canceling the transfer.

Transferring data between systems
---------------------------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -F "fileToUpload=@" https://public.tenants.agaveapi.co/files/v2/media/data.agaveapi.co/$API_USERNAME
   { 
     "url": "agave://stampede.tacc.utexas.edu//etc/motd"
   }

.. code-block:: plaintext

   files-import -v -U "agave://stampede.tacc.utexas.edu//etc/motd" -S data.agaveapi.co $API_USERNAME

Much like importing data, Tapis can manage transfer of data between registered systems. This is, in fact, how data is staged prior to running a simulation. Data transfers are fire and forget, so you can simply start a transfer and go about your business. Tapis will ensure it completes. If you would like a notification when the transfer completes, you can subscribe for one or more emails and/or webhooks and Tapis will alert them upon completion.

In the example below, we will transfer a file from ``stampede.tacc.utexas.edu`` to ``data.agaveapi.co``. While the request looks pretty basic, there's a lot going on behind the scenes. Tapis will authenticate to both systems, check permissions, stream data out of Stampede using SFTP and proxy it into ``data.agaveapi.co`` using the IRODS protocol, adjusting the transfer buffer size along the way to optimize throughput. Doing this by hand is both painful and error prone. Doing it with Tapis is nearly identical to copying a file from one directory to another on your local system.

The response from the service will be nearly identical to the one we received importing a file. This process is identical whether we copy a file or directory. If the source URL is a directory, it will recursively copy the contents until all contents have been copied.

Performing operations on your data
----------------------------------

Standard data management tasks are supported as well. Tapis gives you a common interface for interacting with your data.

Creating directories
^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   curl -sk -H "Authorization: Bearer 35ed548df42cb551e7a5dbbc28a37d32" -X PUT -d "action=mkdir&path=foo/biz" https://public.agaveapi.co/files/v2/media/nryan?pretty=true&naked=true

.. code-block:: plaintext

   files-mkdir -N foo/biz -V nryan

.. code-block:: json

   {
       "name" : "biz",
       "uuid" : "4639785346841317861-e0bd34dffff8de6-0001-002",
       "owner" : "nryan",
       "internalUsername" : null,
       "lastModified" : "2016-01-11T11:39:23.054-06:00",
       "source" : "nryan/foo/biz",
       "path" : "nryan/foo/biz",
       "status" : "TRANSFORMING_COMPLETED",
       "systemId" : "data.agaveapi.co",
       "nativeFormat" : "dir",
       "_links" : {
         "self" : {
           "href" : "https://public.agaveapi.co/files/v2/media/system/data.agaveapi.co/nryan/foo/biz"
         },
         "system" : {
           "href" : "https://public.agaveapi.co/systems/v2/data.agaveapi.co"
         },
         "history" : {
           "href" : "https://public.agaveapi.co/files/v2/history/system/data.agaveapi.co/nryan/foo/biz"
         }
       }
   }

Creating a single directory or a nested directory hierarchy is identical. Simply supply the new directory list as the new directory name. The appropriate result will be created relative to the path you specify.

Copying data
^^^^^^^^^^^^

.. code-block:: shell

   $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -F "fileToUpload=@files/picksumipsum.txt" https://public.tenants.agaveapi.co/files/v2/media/data.agaveapi.co/$API_USERNAME $API_USERNAME/foo/picksumipsum.txt -S data.agaveapi.co $ $API_USERNAME/picksumipsum.txt

.. code-block:: plaintext

   $ files-copy -D $API_USERNAME/foo/picksumipsum.txt -S data.agaveapi.co $ $API_USERNAME/picksumipsum.txt

Moving data
^^^^^^^^^^^

.. code-block:: shell

   # Move a file or folder
   $ files-move -D $API_USERNAME/foo/picksumipsum2.txt -S data.agaveapi.co $API_USERNAME/foo/picksumipsum.txt

.. code-block:: plaintext

   files-list -S data.agaveapi.co $API_USERNAME/foo

.. code-block:: json



Rename a file or folder
=======================

$ files-rename -N picksumipsum.txt -S data.agaveapi.co $API_USERNAME/foo/picksumipsum2.txt
Successfully renamed $API_USERNAME/foo/picsumipsum2.txt to $API_USERNAME/foo/picsumipsum.txt

.. code-block::


   ```plaintext
   # Create a directory
   $ files-mkdir -N foo -S data.agaveapi.co $API_USERNAME

   # Copy a file or folder
   $ files-copy -D $API_USERNAME/foo/picksumipsum.txt -S data.agaveapi.co $ $API_USERNAME/picksumipsum.txt
   Successfully copied $API_USERNAME/picsumipsum.txt to $API_USERNAME/foo/picsumipsum.txt
   $ files-list -S data.agaveapi.co $API_USERNAME/foo
   .
   picksumipsum.txt

   # Move a file or folder
   $ files-move -D $API_USERNAME/foo/picksumipsum2.txt -S data.agaveapi.co $API_USERNAME/foo/picksumipsum.txt
   Successfully moved $API_USERNAME/foo/picsumipsum.txt to $API_USERNAME/foo/picsumipsum2.txt
   $ files-list -S data.agaveapi.co $API_USERNAME/foo
   .
   picksumipsum2.txt

   # Rename a file or folder
   $ files-rename -N picksumipsum.txt -S data.agaveapi.co $API_USERNAME/foo/picksumipsum2.txt
   Successfully renamed $API_USERNAME/foo/picsumipsum2.txt to $API_USERNAME/foo/picsumipsum.txt

Similar to the POSIX paradigm, we can create, copy, move, rename, and delete files and folders. Let's try these out on one of the files we just uploaded. For brevity, we omitted the ``-v`` option from the CLI calls to get abbreviated output.

Accessing your data's provenance
--------------------------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/files/v2/media/data.agaveapi.co/$API_USERNAME/foo/picksumipsum.txt

.. code-block:: plaintext

   files-history -S data.agaveapi.co $API_USERNAME/foo/picksumipsum.txt

.. code-block:: json

   [
       {
           "created": "2014-09-03T13:13:37.000-05:00",
           "description": "File item copied from https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest/foo/picksumipsum.txt",
           "status": "CREATED"
       },
       {
           "created": "2014-09-03T13:14:30.000-05:00",
           "description": "Moved from https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest/foo/picksumipsum.txt to https://public.tenants.agaveapi.co/files/v2/media/system/data.agaveapi.co/systest/foo/picksumipsum2.txt",
           "status": "MOVED"
       },
       {
           "created": "2014-09-03T13:15:19.000-05:00",
           "description": "Renamed path from systest/foo/picksumipsum2.txt to systest/foo/picksumipsum.txt",
           "status": "RENAME"
       }
   ]

Before we delete our sample data, let's briefly point out one other feature of the Files service that can come in handy. By default, Tapis will keep track of every file operation that it performs or observes on your data. Let's query the Files service to see what we've done to our file thus far. The response will be a JSON array with the events on this file thus far.


.. raw:: html

   <aside class="notice">Tapis will keep track of everything it has done, but it does not own the underlying systems, thus if you or another user manually alter data on the underlying file system, no provenance information will be available from Tapis other than its observance that the data has changed. If you need full journaling support, we suggest either using Tapis as the exclusive point of interaction with your storage system or seeking another system-level solution.</aside>


Deleting data
-------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/files/v2/media/data.agaveapi.co/$API_USERNAME/foo

.. code-block:: plaintext

   files-delete -S data.agaveapi.co $API_USERNAME/foo

Now that we've finished up our look at data operations, we will delete the ``foo`` directory with our copied file. (We will leave the original file we uploaded for later on when we get to our section on job submission.) By default Tapis will perform recursive deletion on folders, so we just need to make the one call to delete the folder and all its contents. The response from this call is empty, so we'll skip showing the output.
