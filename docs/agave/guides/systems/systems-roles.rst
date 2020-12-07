
System roles
============

Systems you register are private to you and you alone. You can, however, allow other Tapis clients to utilize the system you define by granting them a role on the system using the systems roles services. The available roles are given in the table below.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Role</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>GUEST</td>
               <td>Gives any authenticated user readonly access to the system. No file operations or job executions are allowed for users with GUEST access.</td>
           </tr>
           <tr>
               <td>USER</td>
               <td>Gives a user the ability to run jobs and access data on the system.</td>
           </tr>
           <tr>
               <td>PUBLISHER</td>
               <td>All the rights of USER as well as the ability to publish applications listing the system as an execution host.</td>
           </tr>
           <tr>
               <td>ADMIN</td>
               <td>All the rights of PUBLISHER as well as the ability to edit and grant roles on the system details. Admins may use the system to access data and run jobs using the default credential assigned to the system, but they may not view or update any of the credentials stored by the system owner. It is not possible for anyone but the system owner to assign or leverage internal user credentials on a system.</td>
           </tr>
           <tr>
               <td>OWNER</td>
               <td>Reserved for the user that originally created the system. This role is non-revokable.</td>
           </tr>
       </tbody>
   </table>
|

Please see the Systems Roles tutorial for a deep discussion of system roles and how they are used.
