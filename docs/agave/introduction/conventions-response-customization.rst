
Customizing Responses
=====================

..

   Returns the name, status, app id, and the url to the archived job output for every user job


.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**
   .. code-block:: shell

      curl -sk -H \
          "Authorization: Bearer ${API_KEY}" \
          "https://api.tacc.utexas.edu/jobs/v2/?limit=2&filter=name,status,appId,_links.archiveData.href

.. code-block:: plaintext

   tapis jobs list -v -l 2 -c name -c id -c status -c _links.archiveData

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
           "href": "https://api.tacc.utexas.edu/jobs/v2/0001414144065563-5056a550b8-0001-007/outputs/listings"
         }
       }
     },
     {
       "name": "demo-pyplot-demo-advanced test-1414270831",
       "status": "FINISHED",
       "appId" : "demo-pyplot-demo-advanced-0.1.0",
       "_links": {
         "archiveData": {
           "href": "https://api.tacc.utexas.edu/jobs/v2/3259859908028273126-242ac115-0001-007/outputs/listings"
         }
       }
     }
   ]

..

   Returns the system id, type, whether it is your default system, and the hostname from the system's storage config


.. container:: foldable

   .. container:: header

      :fa:`caret-right`
      **Show curl**

   .. code-block:: shell

      curl -sk -H \
          "Authorization: Bearer ${API_KEY}" \
          "https://api.tacc.utexas.edu/systems/v2/?filter=id,type,default,storage.host

.. code-block:: plaintext

   tapis systems list -v -l 2 -c id -c name -c type -c default -c storage.host

..

   The response would look something like the following:


.. code-block:: json

   [
     {
       "id": "user.storage",
       "type": "STORAGE",
       "default": false,
       "storage": {
         "host": "data.tacc.utexas.edu"
       }
     },
     {
       "id": "docker.tacc.utexas.edu",
       "type": "EXECUTION",
       "default": false,
       "storage": {
         "host": "129.114.6.50"
       }
     }
   ]

In many situations, Tapis may return back too much or too little information in the response to a query. For example, when searching jobs, the ``inputs`` and ``parameters`` fields are not included in the default summary response objects. You can customize the responses you receive from all the Science APIs using the ``filter`` query parameter.

The ``filter`` query parameter takes a comma-delimited list of fields to return for each object in the response. Each field may be referenced using JSON notation similar to the search syntax (minus the ``.[operation]`` suffix.
