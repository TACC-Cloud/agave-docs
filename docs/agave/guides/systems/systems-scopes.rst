.. role:: raw-html-m2r(raw)
   :format: html


System scope
============

Throughout these tutorials and :raw-html-m2r:`<a href="https://tacc.github.io/developer.tacc.cloud/docs/guides/introduction.html" title="Beginner’s Guides">Beginner's Guides</a>`\ , we have referred to both public and private systems. In addition to roles, systems have a concept of scope associated with them. Not to be confused with OAuth scope mentioned in the :raw-html-m2r:`<a href="https://tacc.github.io/developer.tacc.cloud/docs/guides/authorization/introduction.html" title="Authorization Guide">Authentication Guide</a>`\ , system scope refers to the availability of a system to the general user community. The following table lists the available scopes and their meanings.


.. raw:: html

   <table>
       <thead>
           <tr>
               <th>Scope</th>
               <th>Required role</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>private</td>
               <td>Admin</td>
               <td>System is visible and available for use to the owner and to anyone whom they grant a role.</td>
           </tr>
           <tr>
               <td>read only</td>
               <td>Tenant admin</td>
               <td>Storage system is visible and available for data browsing and download by any API user. Write access is restricted unless explicitly granted to a specific user.</td>
           </tr>
           <tr>
               <td>public</td>
               <td>Tenant admin</td>
               <td>System is visible and available to all users for reading and writing. Virtual user home directories are enforced and write access outside of a user's home directory is restricted unless explicitly granted by a system admin.</td>
           </tr>
       </tbody>
   </table>


Private systems
===============

All systems are private by default. This means that no one can use a system you register without you or another user with "admin" permissions granting them a role on that system. Most of the time, unless you are configuring a tenant for your organization, all the systems you register will stay private. Do not mistake the term private for isolated. Private simply means not public. Another way to think of private systems is as "invitation only." You are free to share your system as many or as few people as you want and it will still remain a private system.

Readonly systems
----------------

Readonly systems are systems who have granted a GUEST role to the ``world`` group. Once this grant is made, any user will be able to browse the system's entire file system regardless of individual permissions. Be careful when making a system readonly. Usually, the only reason you would do this is because you have configured the system ``rootDir`` to point to a dataset or volume that you want to publish for others to use. Carelessly making systems readonly can expose personal data stored on the system to every other API user. While your intentions may be pure, theirs may not be, so think through the implications of this action before you take it.

Public systems
--------------

Public systems are available for use by every API user within your tenant. Once public, systems inherit specific behavior unique to their ``type``. We will cover each system type in turn.

Public Storage Systems
----------------------

Public storage systems enforce a virtual user home directory with implied user permissions. The following table gives a brief summary of the permission implications. You can read more about data permissions in the :raw-html-m2r:`<a href="http://agaveapi.co/documentation/tutorials/data-management-tutorial/data-permissions-tutorial/" title="Data Permissions Tutorial">Data Permissions</a>` tutorial.


.. raw:: html

   <table>
       <thead>
           <tr>
               <th><code>rootDir</code></th>
               <th><code>homeDir</code></th>
               <th>URL path</th>
               <th>User permission</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>/</td>
               <td>/home</td>
               <td>&mdash;</td>
               <td>READ</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home</td>
               <td>/</td>
               <td>READ</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home</td>
               <td>/var</td>
               <td>READ</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home</td>
               <td>systest</td>
               <td>ALL</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home</td>
               <td>systest/some/subdir</td>
               <td>ALL</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home</td>
               <td>rjohnson</td>
               <td>NONE</td>
           </tr>
       </tbody>
   </table>


Notice in the above example that on public systems, users will have implied ownership of a folder matching their username in the system's ``homeDir``. In the table, this means that user "systest" will have ownership of the physical home directory ``/home/systest`` on the system after it's public. It is important that, before publishing a system, you make sure that the account used to access the system can actually write to these folders. Otherwise, users will not be able to access their data on the system you make public.

Before making a system public, make sure that you have a strategy for mapping API users to directories on the system you want to expose. If mapping to the ``/home`` folder on a Unix system, make sure the account used to access the system has write access to all user directories.

Public Execution Systems
------------------------

Public execution systems do not share the same behavior as public storage systems. Unless explicit permission has been given, public execution systems are not accessible for data access by non-privileged users. This is because public systems allow all users to run applications on them and granting public access to the file system would expose user job data to all users. If you do need to expose the data on a public execution system, either register it again as a storage system (using an appropriate ``rootDir`` outside of the system ``scratchDir`` and ``workDir`` paths), or grant specific users a role on the system.

Publishing a system
-------------------

To publish a system and make it public, you make a PUT request on the system's url.

.. code-block:: plaintext

   systems-publish -v $SYSTEM_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"publish"}'
          https://public.tenants.agaveapi.co/systems/v2/$SYSTEM_ID

   {: .solution}


The response from the service will be the same system description we saw before, this time with the public attribute set to :raw-html-m2r:`<em>true</em>`.

Unpublishing a system
---------------------

.. code-block:: plaintext

   systems-unpublish -v $SYSTEM_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"unpublish"}'
          https://public.tenants.agaveapi.co/systems/v2/$SYSTEM_ID

   {: .solution}


The response from the service will be the same system description we saw before, this time with the public attribute set to :raw-html-m2r:`<em>false</em>`.

To unpublish a system, make the same request with the ``action`` attribute set to :raw-html-m2r:`<em>unpublish</em>`.

Default systems
===============

As you continue to use Agave over time, it will not be uncommon for you to accumulate additional storage and execution systems through both self-registration and other people sharing their systems with you. It may even be the case that you have multiple public systems available to you. In this situation, it is helpful for both you and your users to specify what the default systems should be.

Default systems are the systems that are used when the user does not specify a system to use when performing a remote action in Agave. For example, specifying an ``archivePath`` in a job request, but no ``archiveSystem``\ , or specifying a ``deploymentPath`` in an app description, but no ``deploymentSystem``. In these situations, Agave will use the user's default storage system.

Four types of default systems are possible. The following table describes them.


.. raw:: html

   <table>
       <thead>
           <tr>
               <th>Type</th>
               <th>Scope</th>
               <th>Role needed to set</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>storage</td>
               <td>user default</td>
               <td>USER</td>
               <td>Default storage system for an individual user. This takes priority over any global defaults and will be used in all data operations in leu of a system being specified for this user.</td>
           </tr>
           <tr>
               <td>storage</td>
               <td>global default</td>
               <td>Tenant admin</td>
               <td>Default storage system for an entire tenant. This will be used as the default storage system whenever a user has not explicitly specified another. Only public systems may be made the global default.</td>
           </tr>
           <tr>
               <td>execution</td>
               <td>user default</td>
               <td>USER</td>
               <td>Default execution system for an individual user. This takes priority over any global defaults and will be used in all app and job operations in leu of an execution system being specified for this user. In the case of app registration, normal user role requirements apply.</td>
           </tr>
           <tr>
               <td>execution</td>
               <td>global default</td>
               <td>Tenant admin</td>
               <td>Default execution system for an entire tenant. This will be used as the default execution system whenever a user has not explicitly specified another. Only public systems may be made the global default.</td>
           </tr>
       </tbody>
   </table>


As a best practice, it is recommended to always specify the system you intend to use when interacting with Agave. This will eliminate ambiguity in each request and make your actions more repeatable over time as the availability and configuration of the global and user default systems may change.

Setting user default system
---------------------------

To set a system as the user's default, you make a PUT request on the system's url. Only systems the user has access to may be used as their default.

.. code-block:: plaintext

   systems-setdefault $SYSTEM_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"setDefault"}'
          https://public.tenants.agaveapi.co/systems/v2/$SYSTEM_ID

   {: .solution}


The response from the service will be the same system description we saw before, this time with the ``default`` attribute set to :raw-html-m2r:`<em>true</em>`.

Unsetting user default system
-----------------------------

.. code-block:: plaintext

   systems-unsetdefault $SYSTEM_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"unsetDefault"}'
          https://public.tenants.agaveapi.co/systems/v2/$SYSTEM_ID

   {: .solution}


The response from the service will be the same system description we saw before, this time with the ``default`` attribute set to :raw-html-m2r:`<em>false</em>`.

To remove a system as the user's default, make the same request with the ``action`` attribute set to :raw-html-m2r:`<em>unsetDefault</em>`. Keep in mind that you cannot remove the global default system from being the user's default. You can only set a different one to replace it.

Setting global default system
-----------------------------

Tenant administrators may wish to set default storage and execution systems for an entire tenant. These are called global default systems. There may be at most one system of each type set as a global default. To set a global default system, first make sure that the system is public. Only public systems may be set as a global default. Next, make sure you have administrator permissions for your tenant. Only tenant admins may publish systems and manage the global defaults. Lastly, make a PUT request on the system's url with an ``action`` attribute in the body set to :raw-html-m2r:`<em>unsetGlobalDefault</em>`.

.. code-block:: plaintext

   systems-setdefault -G $SYSTEM_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"setGlobalDefault"}'
          https://public.tenants.agaveapi.co/systems/v2/$SYSTEM_ID

   {: .solution}


The response from the service will be the same system description we saw before, this time with both the ``default`` and ``public`` attributes set to :raw-html-m2r:`<em>true</em>`.

Setting global default systems does not preclude users from manually setting their own default systems. Any user-defined default systems will trump the global default system setting for that user.

To remove a system from being the global default, make the same request with the ``action`` attribute set to :raw-html-m2r:`<em>unsetGlobalDefault</em>`.

.. code-block:: plaintext

   systems-unsetdefault -G $SYSTEM_ID

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -H "Content-Type: application/json"
          -X PUT
          --data-binary '{"action":"unsetGlobalDefault"}'
          https://public.tenants.agaveapi.co/systems/v2/$SYSTEM_ID

   {: .solution}


This time the response from the service will have ``default`` set to :raw-html-m2r:`<em>false</em>` and ``public`` set to :raw-html-m2r:`<em>true</em>`.
