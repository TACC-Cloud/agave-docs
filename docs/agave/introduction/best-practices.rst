
Best Practices
==============

General
-------


.. raw:: html

   <ul>
   <li>Alway use SSL. Agave services will force SSL if you don't specify it, but it's best to protect your application with SSL as a best practice.</li>
   </ul>


Systems Service
---------------


.. raw:: html

   <ul>
   <li>Use restricted SSH keys whenever possible.</li>
   <li>Use SSH keys rather than passwords whenever possible.</li>
   <li>Use a MyProxy Gateway service whenever available rather than a stock MyProxy service to avoid password exposure.</li>
   <li>Always configure a default storage system for your organization. This provides tremendous benefit to users who don't want to think about the makeup of your infrastructure.</li>
   <li>Use contextual naming for systems. <code>nryan-vm-sftp-prod</code> is favorable to <code>my-vm</code>. DNS is also a good approach to naming, but you will still need to contextualize it with something like a username since multiple users may want to register the same system.</li>
   <li>Grant the minimum sufficient role for a user that enables them to do what you want them to do. Don't grant a PUBLISHER role when a GUEST role will suffice. Don't grant an ADMIN role when a USER role will get the job done. </li>
   <li>Always explicitly specify a <code>scratchDir</code> for your execution systems. This will allow you easily see where your job data will go and avoids systems where your home directory has a smaller quota than other areas of your system.</li>
   </ul>


Files Service
-------------


.. raw:: html

   <ul>
   <li>Always favor the full canonical URL over assuming default systems. Default systems may change on a user-to-user basis, but canonical URLs will always be the same.</li>
   <li>Error on the side of privacy by granting permissions to single users and groups over making data public.</li>
   <li>Avoid over-sharing by granting permissions on specific files or minimum subtrees rather than sharing entire home folders.</li>
   </ul>


PostIts
-------


.. raw:: html

   <ul>
   <li>Always limit the lifetime of a postit by specifying either the maximum number of uses or an expiration date. This will prevent people from accessing resources long after you intended for them to do so.</li>
   </ul>

