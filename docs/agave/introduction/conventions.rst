.. role:: raw-html-m2r(raw)
   :format: html


Conventions
===========

Throughout the documentation you will regularly encounter the following variables. These represent user-specific values that should be replaced when attempting any of the calls using your account.


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Variable</th>
       <th>Description</th>
       <th align="left">Example</th>
     </tr><tr>
       <td>${API_HOST}</td>
       <td align="center">Base hostname of the API</td>
       <td>public.agaveapi.co</td>
     <tr></tr>
       <td>${API_VERSION}</td>
       <td align="center">Version of the API endpoint</td>
       <td>v2.2.8</td>
     <tr></tr>
       <td>${API_USERNAME}</td>
       <td align="center"> Username of the current user</td>
       <td>nryan</td>
     <tr></tr>
       <td>${API_KEY}</td>
       <td align="center">Client key used to request an access token from the Agave Auth service</td>
       <td>hZ_z3f4Hf3CcgvGoMix0aksN4BOD6</td>
     <tr></tr>
       <td>${API_SECRET}</td>
       <td align="center">Client secret used to request an access token from the Agave Auth service</td>
       <td>gTgpCecqtOc6Ao3GmZ_FecVSSV8a</td>
     <tr>
     </tr>
       <td>${API_TOKEN}</td>
       <td align="center">Client unique identifier of an application requesting access to Agave Auth service</td>
       <td>de32225c235cf47b9965997270a1496c</td>
     </tr> 
   </table>


JSON Notation
-------------

.. code-block:: json

   {
       "active": true,
       "created": "2014-09-04T16:59:33.000-05:00",
       "frequency": 60,
       "id": "0001409867973952-5056a550b8-0001-014",
       "internalUsername": null,
       "lastCheck": [
         {
           "created": "2014-10-02T13:03:25.000-05:00",
           "id": "0001412273000497-5056a550b8-0001-015",
           "message": null,
           "result": "PASSED",
           "type": "STORAGE"
         },
         {
           "created": "2014-10-02T13:03:25.000-05:00",
           "id": "0001411825368981-5056a550b8-0001-015",
           "message": null,
           "result": "FAILED",
           "type": "LOGIN"
         }
       ],
       "lastSuccess": "2014-10-02T11:03:13.000-05:00",
       "lastUpdated": "2014-10-02T13:03:25.000-05:00",
       "nextUpdate": "2014-10-02T14:03:15.000-05:00",
       "owner": "systest",
       "target": "demo.storage.example.com",
       "updateSystemStatus": false,
       "_links": {
           "checks": {
               "href": "https://public.tenants.agaveapi.co/monitor/v2/0001409867973952-5056a550b8-0001-014/checks"
           },
           "notifications": {
               "href": "https://public.tenants.agaveapi.co/notifications/v2/?associatedUuid=0001409867973952-5056a550b8-0001-014"
           },
           "owner": {
               "href": "https://public.tenants.agaveapi.co/profiles/v2/systest"
           },
           "self": {
               "href": "https://public.tenants.agaveapi.co/monitor/v2/0001409867973952-5056a550b8-0001-014"
           },
           "system": {
               "href": "https://public.tenants.agaveapi.co/systems/v2/demo.storage.example.com"
           }
       }
   }

Javascript dot notation will be used to refer to individual properties of JSON objects. For example, consider the following JSON object.


* ``active`` refers to the top level ``active`` attribute in the response object.
* ``lastCheck.[].result`` generically refers to the result attribute contained within any of the objects contained in the ``lastCheck`` array.
* ``lastCheck.[0].result`` specifically refers to the result attribute contained within the first object in the ``lastCheck`` array.
* ``_links.self.href`` refers to the href attribute in the checks object within the ``_links`` object.

Versioning
----------

The current major version of Agave is given in the URI immediately following the API resource name. For example, if the endpoint is ``https://public.tenants.agaveapi.co/jobs/v2/``\ , the API version would be ``v2``. The current major version of Agave is v2. (Full version: 2.2.8)

Special Character Handling
--------------------------

In certain situations, usually where file system paths and names are involved in some way, Agave will generate sanitized object names ("slugs") to make them safe to use. Slugs will be created on the fly by applying the following rules:


#. Lowercase the string
#. Replace spaces with a dash
#. Remove any special characters and punctuation that might require encoding in the URL. Allowed characters are alphanumeric characters, numbers, underscores, and periods.

Secure communication
--------------------

Agave uses SSL to secure communication with the clients. If HTTPS is not specified in the request, the request will be redirected to a secure channel.

Requests
--------

The Agave API is based on :raw-html-m2r:`<a title="REST" href="http://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank">REST</a>` principles: data resources are accessed via standard HTTPS requests in UTF-8 format to an API endpoint. The API uses appropriate HTTP verbs for each action whenever possible.


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Verb</th>
       <th align="left">Description</th>
     </tr><tr>
       <td>GET</td>
       <td>Used for retrieving resources</td>
     <tr></tr>
       <td>POST</td>
       <td>Used for creating resources</td>
     <tr></tr>
       <td>PUT</td>
       <td>Used for manipulating resources or collections</td>
     <tr></tr>
       <td>DELETE</td>
       <td>Used for deleting resources</td>
     </tr> 
   </table>


Common API query parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Several URL query parameters are common across all services. The following table lists them for reference


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Name</th>
       <th>Values</th>
       <th align="left">Purpose</th>
     </tr><tr>
       <td>offset</td>
       <td align="center">integer (zero based)</td>
       <td>Skips the first offset results in the response</td>
     <tr></tr>
       <td>limit</td>
       <td align="center">integer</td>
       <td>Limits the number of responses to, at most, this number</td>
     <tr></tr>
       <td>pretty</td>
       <td align="center">boolean</td>
       <td>If true, pretty prints the response. Default false</td>
     <tr></tr>
       <td>naked</td>
       <td align="center">boolean</td>
       <td>If true, returns only the value of the result attribute in the standard response wrapper</td>
     <tr></tr>
       <td>filter</td>
       <td align="center">string</td>
       <td>A comma-delimited list of fields to return for each object in the response. Each field may be referenced using JSON notation</td>
     </tr> 
   </table>


Experimental query parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Starting with the 2.1.10 release, two new query parameters have been introduced into the jobs API as an experimental feature. The following table lists them for reference


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Name</th>
       <th>Values</th>
       <th align="left">Purpose</th>
     </tr><tr>
       <td>sort</td>
       <td align="center">asc,desc</td>
       <td>The sort order of the response. asc by default</td>
     <tr></tr>
       <td>sortBy</td>
       <td align="center">string</td>
       <td>The field by which to sort the response. Any field present in the full representation of the resource that you are querying is supported. Multiple values are not currently supported</td>
     </tr> 
   </table>


Responses
---------

All data is received and returned as a JSON object.

Response Details
^^^^^^^^^^^^^^^^

.. code-block:: json

   {
       "status": "error",
       "message": "Permission denied. You do not have permission to view this system",
       "version": "2.1.16-r8228",
       "result": {}
   }

Apart from the response code, all responses from Agave are in the form of a json object. The object takes the following form.


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Key</th>
       <th>Value Type</th>
       <th align="left">Value Description</th>
     </tr><tr>
       <td>status</td>
       <td align="center">string</td>
       <td>User will see message=null on status "success"</td>
     </tr><tr>
       <td>message</td>
       <td align="center">string</td>
       <td>A short description of the cause of the error</td>
     </tr><tr>
       <td>result</td>
       <td align="center">object,array</td>
       <td>The JSON response object or array</td>
     <tr></tr>
       <td>version</td>
       <td align="center">string</td>
       <td>The current full release version of Agave. Ex “2.1.16-r8228”</td>
     </tr> 
   </table>


Here, for example, is the response that occurs when trying to fetch information for system to which you do not have access:

Naked Responses
^^^^^^^^^^^^^^^

In situations where you do not care to parse the wrapper for the raw response data, you may request a *naked* response from the API by adding ``naked=true`` in to the request URL. This will return just the value of the ``result`` attribute in the response wrapper.

naked=true 

.. code-block:: json

   {
     "id" : "data.iplantcollaborative.org",
     "name" : "CyVerse Data Store",
     "type" : "STORAGE",
     "description" : "CyVerse's petabyte-scale, cloud-based data management service.",
     "status" : "UP",
     "public" : true,
     "lastUpdated" : "2017-10-10T00:00:00.000-05:00",
     "default" : true,
     "_links" : {
       "self" : {
         "href" : "https://agave.iplantc.org/systems/v2/data.iplantcollaborative.org"
       }
     }
   }

naked=false

.. code-block:: json

   {
     "status" : "success",
     "message" : null,
     "version" : "2.2.8-rff32e62",
     "result" : [ {
       "id" : "data.iplantcollaborative.org",
       "name" : "CyVerse Data Store",
       "type" : "STORAGE",
       "description" : "CyVerse's petabyte-scale, cloud-based data management service.",
       "status" : "UP",
       "public" : true,
       "lastUpdated" : "2017-10-10T00:00:00.000-05:00",
       "default" : true,
       "_links" : {
         "self" : {
           "href" : "https://agave.iplantc.org/systems/v2/data.iplantcollaborative.org"
         }
       }
     } ]
   }

Formatting
----------

By default, all responses are serialized JSON. To receive pre-formatted JSON, add ``pretty=true`` to any query string.

Pagination
----------

..

   Pagination using ``limit`` and ``offset`` query parameters.


.. code-block:: shell

   curl -sk -H \
       "Authorization: Bearer ${API_KEY}" \
       "https://public.tenants.agaveapi.co/jobs/v2/?offset=50&limit=25"

.. code-block:: plaintext

   jobs-list -o 50 -l 25

All resource collections support a way of paging the dataset, taking an ``offset`` and ``limit`` as query parameters:

Note that offset numbering is zero-based and that omitting the offset parameter will return the first X elements. By default, all search and listing responses from the Science APIs are paginated in groups of 250 objects. The lone exception being the Files API which will return all results by default.

Check the documentation for the specific endpoint to see specific information.

Timestamps
----------

Timestamps are returned in \ :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/ISO_8601" target="_blank">ISO 8601</a>`\  format offset for Central Standard Time (-05:00) \ ``YYYY-MM-DDTHH:MM:SSZ-05:00``.

Cross Origin Resource Sharing (CORS)
------------------------------------

Many modern applications choose to implement client-server communication exclusively in Javascript. For this reason, Agave provides :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/Cross-origin_resource_sharing" title="CORS" target="_blank">cross-origin resource sharing (CORS)</a>` support so AJAX requests from a web browser are not constrained by cross-origin requests and can safely make GET, PUT, POST, and DELETE requests to the API.

Hypermedia
----------

.. code-block:: always

   {
       "associationIds": [],
       "created": "2013-11-16T11:25:38.900-06:00",
       "internalUsername": null,
       "lastUpdated": "2013-11-16T11:25:38.900-06:00",
       "name": "color",
       "owner": "nryan",
       "uuid": "0001384622738900-5056a550b8-0001-012",
       "value": "red",
       "_links": {
           "self": {
               "href": "https://public.tenants.agaveapi.co/meta/v2/data/0001384622738900-5056a550b8-0001-012"
           },
           "owner": {
               "href": "https://public.tenants.agaveapi.co/profiles/v2/nryan"
           }
       }
   }

Agave is a fully descriptive hypermedia API. Given any point, you should be able to run API through the links provided in the ``_links`` object in each resource representation. The following user metadata object contains two referenced objects. The first, ``self`` is common to all objects, and contains the URL of that object. The second, ``owner`` contains the URL to the profile of the user who created the object.
