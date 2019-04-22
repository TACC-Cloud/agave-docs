.. role:: raw-html-m2r(raw)
   :format: html


File history
============

A full history of changes, permissions changes, and access events made through the Files API is recorded for every file and folder on registered :raw-html-m2r:`<a href="https://tacc.github.io/developer.tacc.cloud/docs/guides/systems/introduction.html">Tapis (Agave) systems</a>`. The recorded history events represent a subset of the events thrown by the Files API. Generally speaking, the events saved in a file item's history represent mutations on the physical file item or its metadata.

Direct vs indirect events
-------------------------

Tapis (Agave) will record both direct and indirect events made on a file item. Examples of direct events are transferring a directory from one system to another or renaming a file. Examples of indirect events are a user manually deleting a file from the command line. The table below contains a list of all the provenance actions recorded.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Event</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>CREATED</td>
               <td>File or directory was created</td>
           </tr>
           <tr>
               <td>DELETED</td>
               <td>The file was deleted</td>
           </tr>
           <tr>
               <td>RENAME</td>
               <td>The file was renamed</td>
           </tr>
           <tr>
               <td>MOVED</td>
               <td>The file was moved to another path</td>
           </tr>
           <tr>
               <td>OVERWRITTEN</td>
               <td>The file was overwritten</td>
           </tr>
           <tr>
               <td>PERMISSION_GRANT</td>
               <td>A user permission was added</td>
           </tr>
           <tr>
               <td>PERMISSION_REVOKE</td>
               <td>A user permission was deleted</td>
           </tr>
           <tr>
               <td>STAGING_QUEUED</td>
               <td>File/folder queued for staging</td>
           </tr>
           <tr>
               <td>STAGING</td>
               <td>File or directory is currently in flight</td>
           </tr>
           <tr>
               <td>STAGING_FAILED</td>
               <td>Staging failed</td>
           </tr>
           <tr>
               <td>STAGING_COMPLETED</td>
               <td>Staging completed successfully</td>
           </tr>
           <tr>
               <td>PREPROCESSING</td>
               <td>Prepairing file for processing
           </td>
           </tr>
           <tr>
               <td>TRANSFORMING_QUEUED</td>
               <td>File/folder queued for transform</td>
           </tr>
           <tr>
               <td>TRANSFORMING</td>
               <td>Transforming file/folder</td>
           </tr>
           <tr>
               <td>TRANSFORMING_FAILED</td>
               <td>Transform failed</td>
           </tr>
           <tr>
               <td>TRANSFORMING_COMPLETED</td>
               <td>Transform completed successfully</td>
           </tr>
           <tr>
               <td>UPLOADED</td>
               <td>New content was uploaded to the file.</td>
           </tr>
           <tr>
               <td>CONTENT_CHANGED</td>
               <td>Content changed within this file/folder. If a folder, this event will be thrown whenever content changes in any file within this folder at most one level deep.</td>
           </tr>
       </tbody>
   </table>


Out of band file system changes
-------------------------------

Tapis (Agave) does not own the storage and execution systems you access through the Science APIs, so it cannot guarantee that everything that every possible change made to the file system is recorded. Thus, Agave takes a best-effort approach to provenance allowing you to choose, through your own use of best practices, how thorough you want the provenance trail of your data to be.

Listing file history
--------------------

List the history of a file item

.. code-block:: plaintext

   files-history -v nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            https://api.tacc.utexas.edu/files/v2/history/nryan/picksumipsum.txt
|


The response to this contains a summary listing all permissions on the

.. code-block:: json

   [
     {
       "status": "DOWNLOAD",
       "created": "2016-09-20T19:47:56.000-05:00",
       "createdBy": "public",
       "description": "File was downloaded"
     },
     {
       "status": "STAGING_QUEUED",
       "created": "2016-09-20T19:48:12.000-05:00",
       "createdBy": "nryan",
       "description": "File/folder queued for staging"
     },
     {
       "status": "STAGING_COMPLETED",
       "created": "2016-09-20T19:48:16.000-05:00",
       "createdBy": "nryan",
       "description": "Staging completed successfully"
     },
     {
       "status": "TRANSFORMING_COMPLETED",
       "created": "2016-09-20T19:48:17.000-05:00",
       "createdBy": "nryan",
       "description": "Your scheduled transfer of http://129.114.97.92/picksumipsum.txt completed staging. You can access the raw file on iPlant Data Store at /home/nryan/picksumipsum.txt or via the API at https://api.tacc.utexas.edu/files/v2/media/system/data.agaveapi.co//nryan/picksumipsum.txt."
     }
   ]

Basic paginated listing of file item history events is available as shown in the example. Currently, the file history service is readonly. The only way to erase the history on a file item is to delete the file item through the API.
