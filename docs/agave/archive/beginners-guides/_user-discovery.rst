.. role:: raw-html-m2r(raw)
   :format: html


User Discovery Tutorial
=======================

Nothing great is ever accomplished alone. In the course of conducting your research, you will want to share your systems, results, data, etc with other people if for no other reason than to verify that Agave works as advertised. You can use the Profiles service to lookup other users by name, username, or email address.

Finding others
--------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/profiles/v2/?email=nryan?naked=true

.. code-block:: plaintext

   profiles-list -v -E nryan

.. code-block:: javascript

   [ 
     {
       "username" : "tilefish2",
       "email" : "nryan@adelphi.edu",
       "firstName" : "james",
       "lastName" : "nryan",
       "position" : "null",
       "institution" : "null",
       "phone" : null,
       "fax" : null,
       "researchArea" : null,
       "department" : null,
       "city" : null,
       "state" : null,
       "country" : null,
       "gender" : "",
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/tilefish2"
         },
         "users" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/tilefish2/users"
         }
       }
     }, 
     {
       "username" : "nryan",
       "email" : "nryan@tacc.utexas.edu",
       "firstName" : "Rion",
       "lastName" : "Dooley",
       "position" : "null",
       "institution" : "University of Texas Austin",
       "phone" : null,
       "fax" : null,
       "researchArea" : null,
       "department" : null,
       "city" : null,
       "state" : null,
       "country" : null,
       "gender" : "",
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/nryan"
         },
         "users" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/nryan/users"
         }
       }
     }, 
     {
       "username" : "systest",
       "email" : "nryan@iplantcollaborative.org",
       "firstName" : "Systest",
       "lastName" : "Account",
       "position" : "null",
       "institution" : "null",
       "phone" : null,
       "fax" : null,
       "researchArea" : null,
       "department" : null,
       "city" : null,
       "state" : null,
       "country" : null,
       "gender" : "",
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/systest"
         },
         "users" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/systest/users"
         }
       }
     } 
   ]

To search for other users, make a GET request to the Profiles service with the search type and value in the URL query.

The response to this call is a JSON array of users who email addresses match the search term ``nryan`` in some way.
:raw-html-m2r:`<br/>`
:raw-html-m2r:`<br/>`
:raw-html-m2r:`<br/>`
:raw-html-m2r:`<br/>`
:raw-html-m2r:`<br/>`
:raw-html-m2r:`<br/>`
:raw-html-m2r:`<br/>`

Finding yourself
----------------

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/profiles/v2/me?naked=true

.. code-block:: plaintext

   profiles-list -v me

.. code-block:: javascript

   {
       "username" : "systest",
       "email" : "$API_USERNAME@iplantcollaborative.org",
       "firstName" : "Systest",
       "lastName" : "Account",
       "position" : "null",
       "institution" : "null",
       "phone" : null,
       "fax" : null,
       "researchArea" : null,
       "department" : null,
       "city" : null,
       "state" : null,
       "country" : null,
       "gender" : "",
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/systest"
         },
         "users" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/systest/users"
         }
       }
   }

You can also lookup your own profile using the special ``me`` username.
