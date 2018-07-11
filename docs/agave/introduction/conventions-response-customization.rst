
Customizing Responses
=====================

..

   Returns the user id, name, and email for the authenticated user  


.. code-block:: shell

   curl -sk -H \
       "Authorization: Bearer ${API_KEY}" \
       "https://public.tenants.agaveapi.co/profiles/v2/me?filter=username,email

.. code-block:: plaintext

   profiles-list -v --filter=username,email me

..

   The response would look something like the following:  


.. code-block:: json

   {
     "username": "nryan",
     "email": "nryan@rangers.mlb.com"
   }

..

   Returns the name, status, app id, and the url to the archived job output for every user job   


.. code-block:: shell

   curl -sk -H \
       "Authorization: Bearer ${API_KEY}" \
       "https://public.tenants.agaveapi.co/jobs/v2/?limit=2&filter=name,status,appId,_links.archiveData.href

.. code-block:: plaintext

   jobs-list -v --limit=2 --filter=name,status,appId,_links.archiveData

..

   The response would look something like the following:  


.. code-block:: json

   [
     {
       "name" : "demo-pyplot-demo-advanced test-1414139896",
       "status": "FINISHED",
       "appId" : "demo-pyplot-demo-advanced-0.1.0",
       "_links": {
         "archiveData": {
           "href": "https://agave.iplantc.org/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/listings"
         }
       }
     },
     {
       "name": "demo-pyplot-demo-advanced test-1414270831",
       "status": "FINISHED",
       "appId" : "demo-pyplot-demo-advanced-0.1.0",
       "_links": {
         "archiveData": {
           "href": "https://agave.iplantc.org/jobs/v2/3259859908028273126-242ac115-0001-007/outputs/listings"
         }
       }
     }
   ]

..

   Returns the system id, type, whether it is your default system, and the hostname from the system's storage config  


.. code-block:: shell

   /systems/v2/?filter=id,type,default,storage.host

.. code-block:: plaintext

   systems-list -v --limit=2 --filter=id,type,default,storage.host

..

   The response would look something like the following:  


.. code-block:: json

   [
     {
       "id": "data.agaveapi.co",
       "type": "STORAGE",
       "default": true,
       "storage": {
         "host": "dtn01.prod.agaveapi.co"
       }
     },
     {
       "id": "docker.tacc.utexas.edu",
       "type": "EXECUTION",
       "default": true,
       "storage": {
         "host": "129.114.6.50"
       }
     }
   ]

In many situations, Agave may return back too much or too little information in the response to a query. For example, when searching jobs, the ``inputs`` and ``parameters`` fields are not included in the default summary response objects. You can customize the responses you receive from all the Science APIs using the ``filter`` query parameter.   

The ``filter`` query parameter takes a comma-delimited list of fields to return for each object in the response. Each field may be referenced using JSON notation similar to the search syntax (minus the ``.[operation]`` suffix. 
