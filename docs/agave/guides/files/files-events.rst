
File events
===========

Tapis throws file events on every content change, permission change, and file item access request in the platform. A list of the file events thrown is given in the following table.


.. raw:: html

   <table>
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
               <td>INDEX_START</td>
               <td>Indexing of file/folder started</td>
           </tr>
           <tr>
               <td>INDEX_COMPLETE</td>
               <td>Indexing of file/folder completed</td>
           </tr>
           <tr>
               <td>INDEX_FAILED</td>
               <td>Indexing of file/folder failed</td>
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
               <td>UPLOAD</td>
               <td>New content was uploaded to the file.</td>
           </tr>
           <tr>
               <td>CONTENT_CHANGED</td>
               <td>Content changed within this file/folder. If a folder, this event will be thrown whenever content changes in any file within this folder at most one level deep.</td>
           </tr>
           <tr>
               <td>DOWNLOAD</td>
               <td>The file item was downloaded.</td>
           </tr>
       </tbody>
   </table>


File events do not happen in a vaccuum. A file item only exists within the context of a System, so enable aggregate listeners across an entire system, a corresponding system event is thrown for each file event. System event names are constructed by prefixing the file event name with ``SYSTEM_``.
