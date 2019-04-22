.. role:: raw-html-m2r(raw)
   :format: html



.. raw:: html

   <aside class="notice">Many of the concepts discussed in this tutorial build on lessons learned in the Data Management, System Management, and System Roles Tutorials. To get the most out of this tutorial, we highly recommend you review those tutorials to get a solid understanding of system path and account resolution, user roles, public, private, and readonly system scopes, and the concept of ownership in Tapis (Agave).</aside>


Introduction
------------


.. raw:: html

   <ul>
   <li>File permissions in Tapis (Agave) are are fine-grained access controls available on every file and directory accessible through Agave.</li>
   </ul>


Tapis (Agave) overlays its own permission model on top of the underlying storage and execution systems.

Permission values
^^^^^^^^^^^^^^^^^


.. raw:: html

   <pre>`Insert permissions table
   `</pre>


User roles vs permissions
^^^^^^^^^^^^^^^^^^^^^^^^^

Roles are system level and apply to everything on or interacting with a system. Permissions apply individually and recursively to files and directories.

Implicit and explicit permissions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Recursion and inheritance
^^^^^^^^^^^^^^^^^^^^^^^^^

Mirroring permissions
^^^^^^^^^^^^^^^^^^^^^

Permission hierarchy
--------------------


.. raw:: html

   <pre>`Insert hierarchy table of user role, system role, path, permission
   `</pre>


Managing Permissions
--------------------

You can list, add, update, and remove data permissions by making requests on the file or directory's URI.

Viewing permissions
^^^^^^^^^^^^^^^^^^^

Let's start by listing the permissions on our sample file from the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/data-management-tutorial/" title="Data Management Tutorial">Data Management tutorial</a>`.

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/files/v2/pems/data.agaveapi.co/$API_USERNAME/picksumipsum.txt

.. code-block:: plaintext

   files-list -v -S data.agaveapi.co $API_USERNAME

The response to this contains a summary listing all permissions on the

``javascript``

Granting permissions
^^^^^^^^^^^^^^^^^^^^

Updating permissions
^^^^^^^^^^^^^^^^^^^^

Permission arithmetic
^^^^^^^^^^^^^^^^^^^^^

Removing permissions
^^^^^^^^^^^^^^^^^^^^

Publishing data
---------------


.. raw:: html

   <ul>
   <li>Assign role `world` or `public` to file or folder. Must specify recursion to make contents accessible. Will apply to data copied into the folder subtree after the initial grant.</li>
   </ul>


Publishing data on Tapis (Agave) does open up the opportunity for you to turn any storage system into a web server. This is particularly handy for datasets that are centrally located or too large to copy to traditional hosting servers.

Tapis (Agave) does not currently have any policy restricting this behavior, however we reserve the right to change this policy in part or whole in the future in light of abuse or excessive strain on the system. We should also point out that in many situations, using Agave to serve up data from remote storage systems is not ideal from a performance perspective. Specifically when serving up many small files such as web assets, thumbnail images, or configuration files. In this situation, when end-to-end response time matters and the data is not prohibitively large, you are better served having Agave push your data to a cloud storage system like Dropbox, Amazon S3, Azure Storage, or Box and mirroring the public permissions to take advantage of their global CDN. For more information on interacting with these service providers through Agave, see the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/data-management-tutorial/leveraging-cloud-storage-tutorial/" title="Leveraging Cloud Storage Tutorial">Leveraging Cloud Storage</a>` tutorial.

Permission provenance
---------------------

As with all data management operations, a full provenance record is kept of every permission grant, revocation, and update made to a file and folder touched by Tapis (Agave). You can read more about how Agave tracks these things in the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/data-management-tutorial/data-provenance-tutorial/" title="Data Provenance Tutorial">Data Provenance Tutorial</a>`.
