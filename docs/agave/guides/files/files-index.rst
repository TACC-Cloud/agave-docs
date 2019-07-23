.. role:: raw-html-m2r(raw)
   :format: html


File indexing
=============

The file indexing service is currently in :raw-html-m2r:`<strong>early access mode</strong>` and should not be used for your production applications. The API and behavior are both likely to change before the final release. We encourage you to try out the API, share your use cases, and provide any feedback you have over the coming months. Your input is helping us shape the direction of this service, so please don't hold back your impressions.

Tapis is reactive in its interactions with a remote file system. That is an advantage in that it does not place additional load on the system, however it creates challenges in situations where Tapis is just one of many ways users are accessing the system. The file indexing service provides a bridge by which users can "refresh" Tapis's knowledge of the data on a system.

File indexing use cases
-----------------------

This service was driven by user requests over the last year. Some of the most common use cases are described below. If you have a use case that you would like to share, we'd love to hear about it in our :raw-html-m2r:`<a href="https://support.agaveapi.co/" target="_blank">Help Desk</a>`.

UUID generation
^^^^^^^^^^^^^^^

The Files API does not return UUID for file items unless they are the target of an API request. That can force an excessive number of calls to the Files API just to get the UUID for all the file items in a directory. Users requested a way to assign uuid to each file item up front so they could subscribe to events, assign metadata, etc. 

Directory syncrhronization
^^^^^^^^^^^^^^^^^^^^^^^^^^

It is not uncommon for users to access file items on a system registered with Tapis outside of the File API. When this happens, Tapis has no way of knowing the data has changed and throwing the appropriate events. Users requested a way to manually alert Tapis about changes to the data on their systems so everything stayed in sync.

Event propagation
^^^^^^^^^^^^^^^^^

When a modification is made to a directory, the change event must be propagated to all the children under that directory. If the children are not previously known by Tapis, there is no way for users to subscribe or Tapis to alert them of the change impacting that file item. Users requested a way to inject a directory traveral into the event chain so they could ensure that every file created during one operation would be known and have a valid uuid in a subsequent operation.

Task Automation
^^^^^^^^^^^^^^^

Storage systems are often created by users explicitly to share with other users. While Tapis provides quota enforcement on execution systems, there is no such mechanism on storage systems due to the information Tapis has about the disk utilization on the system. Users requested a way to force a directory traversal so they could automate disk usage calculations for use in quota calculations.

The File Indexing Lifecycle
---------------------------

When a directory is indexed, Tapis performs a directory listing on the requested path. It then compares the listing from the system with the  metadata it has about the directory from previous interactions with the system. Deletion events are thown for file items that are no longer present in the directory. Creation events are thrown for newly discovered file items. Once existence is established, Tapis collects the metadata for each file item by generating a UUID, assigning permissions, ownership, and timestamps, and persisting the metadata for use by the file listing service. 

The full file indexing lifecycle is repeated every time the index service is requested on a path.

Indexing a directory
--------------------

Index a directory

.. code-block:: plaintext

   files-index -S data.agaveapi.co nryan

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
         'https://public.agaveapi.co/files/v2/index/system/data.agaveapi.co/nryan?pretty=true''

   {: .solution}


The semantics for indexing a directory are nearly identical to listing a directory. Simply replace ``listing`` in the URL with ``index`` and an indexing task will be started. Once complete, a respnose with the indexed directory contents will be returned. Keep in mind that this can be a time consuming operation, so for large directories, your request may time out before a response is sent. As we covered in the section on :raw-html-m2r:`<a href="#the-file-indexing-lifecycle">The File Indexing Lifecycle</a>`\ , the operation will still complete and provide unique events to which you can subscribe for each file item indexed. 

Indexing a file item
--------------------

.. code-block:: plaintext

   files-index -S data.agaveapi.co nryan/picksumipsum.txt

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
         'https://public.agaveapi.co/files/v2/index/system/data.agaveapi.co/nryan/picksumipsum.txt?pretty=true''

   {: .solution}


Indexing a file item is the same as indexing a directory. Single file indexing should return nearly instantly, so it is sufficient to call when you just need to index a few items. In practice, it will be faster to index the parent directory than to call each file item individually due to the overhead involved in making a connection to the remote system.
