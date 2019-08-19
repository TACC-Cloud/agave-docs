.. role:: raw-html-m2r(raw)
   :format: html


Introduction
------------

The Tapis Metadata service allows you to manage metadata and associate it with Tapis entities via associated UUIDs. It supports JSON schema for structured JSON metadata; it also accepts any valid JSON-formatted metadata or plain text String when no schema is specified. As with a number of other Tapis services, a full access control layer is supported enabling you to keep your metadata private or share it with your colleagues.

UUID
^^^^

All metadata and schemata referenced through the Metadata service have canonical URIs defined via their identifying UUIDs:

.. code-block:: shell

   https://public.tenants.agaveapi.co/meta/v2/data/$UUID

and

.. code-block:: shell

   https://public.tenants.agaveapi.co/meta/v2/schemas/$UUID

Both Metadata and Schemata with a given UUID can be retrieved, updated or deleted via a GET, POST or DELETE operation respectively upon the appropriate endpoint. Please see the Quick Start guide for more information and examples.

New Metadata or Schemata are created in the repository via a POST to either

.. code-block:: shell

   https://public.tenants.agaveapi.co/meta/v2/data/

or

.. code-block:: shell

   https://public.tenants.agaveapi.co/meta/v2/schemas/

Adding new Metadata or Schemata to the system results in the Metadata service generating a new UUID for the object and returning it to the client, for example:

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST  
       -H &#039;Content-Type: application/x-www-form-urlencoded&#039;  
       --data &#039;{"value": {"title": "Example Metadata", "properties": {"species": "arabidopsis", "description": "A model organism..."}}, "name": "some metadata"}&#039;  
       https://public.tenants.agaveapi.co/meta/v2/data

.. code-block:: plaintext

   metadata-addupdate -v -d &#039;{"value": {"title": "Example Metadata", "properties": {"species": "arabidopsis", "description": "A model organism..."}}, "name": "some metadata"}&#039;

Submitting the above will result in a message like the following:

.. code-block:: javascript

   {  
      "uuid":"0001381522769680-8002797ffffddcd-0001-012",
      "owner":"nryan",
      "internalUsername":null,
      "associationIds":[  

      ],
      "lastUpdated":"2013-10-11T15:19:27.822-05:00",
      "name":"some metadata",
      "value":{  
         "title":"Example Metadata",
         "properties":{  
            "species":"arabidopsis",
            "description":"A model organism..."
         }
      },
      "created":"2013-10-11T15:19:27.822-05:00",
      "_links":{  
         "self":{  
            "href":"https://public.tenants.agaveapi.co/meta/v2/0001381522769680-8002797ffffddcd-0001-012"
         }
      }
   }

Further, UUIDs are used to link Metadata to the relevant Tapis entities. The UUIDs for each Tapis entity to which the Metadata refers or is linked should be entered as an AssociationId in the Metadata object.

JSON Schema
^^^^^^^^^^^

Schemata can be provided in JSON Schema form. The service will validate that the schema is valid JSON and store it. To validate Metadata against it, the schema UUID should be given as a parameter, SchemaId, when uploading Metadata. If no SchemaId is provided, the Metadata service will accept any JSON Object or plain text string and store it accordingly. This flexible approach enabled Tapis to handle different levels of structure of Metadata from completely unstructured, to highly structured with complex JSON schemata.

For more on JSON Schema please see :raw-html-m2r:`<a title="JSON Schema" href="http://json-schema.org/">http://json-schema.org/</a>`

To add a metadata schema to the repository:

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST  
       -H &#039;Content-Type: application/x-www-form-urlencoded&#039;  
       --data &#039;{ "title": "Example Schema", "type": "object", "properties": { "species": { "type": "string" } }, "required": ["species"] }&#039; 
   https://public.tenants.agaveapi.co/meta/v2/schemas/

.. code-block:: plaintext

   metadata-schema-addupdate -v -d &#039;{ "title": "Example Schema", "type": "object", "properties": { "species": { "type": "string" } }, "required": ["species"] }&#039;

Submitting the above will result in the following sort of message from the Metadata service:

.. code-block:: javascript

   {
      "status":"success",
      "message":null,
      "version":"2.1.8-SNAPSHOT-r8548",
      "result":{
         "uuid":"0001381781874558-8002797ffffddcd-0001-013",
         "owner":"nryan",
         "internalUsername":null,
         "lastUpdated":"2013-10-14T15:12:54.552-05:00",
         "schema":{
            "schema":{
               "title":"Example Schema",
               "type":"object",
               "properties":{
                  "species":{
                     "type":"string"
                  }
               }
            },
            "required":[
               "species"
            ]
         },
         "created":"2013-10-14T15:12:54.552-05:00",
         "_links":[
            {
               "self":{
                  "href":"https://public.tenants.agaveapi.co/meta/v2/schemas/0001381781874558-8002797ffffddcd-0001-013"
               }
            }
         ]
      }
   }

Some other example schemata:

An example user profile schema:

.. code-block:: javascript

   {
      "title":"profile",
      "type":"object",
      "properties":{
         "firstName":{
            "type":"string"
         },
         "lastName":{
            "type":"string"
         },
         "city":{
            "type":"string"
         },
         "state":{
            "type":"string"
         },
         "email":{
            "type":"string"
         }
      },
      "required":[
         "firstName",
         "lastName",
         "email"
      ]
   }

A project schema:

.. code-block:: javascript

   {
      "title":"project",
      "type":"object",
      "properties":{
         "name":{
            "type":"string"
         },
         "associatedUsernames":{
            "type":"array"
         },
         "fileIds":{
            "type":"array"
         }
      },
      "required":[
         "name",
         "associatedUsernames",
         "fileIds"
      ]
   }

Retrieving Metadata via JSON Query
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In addition to retrieving Metadata via its UUID, the Metadata service supports JSON queries. If you wanted to look up Metadata corresponding to a specific value within its JSON Metadata value, you can specify this as something like:

.. code-block:: shell

   q={"name": "mustard plant"}

To use with curl, the query must be url-encoded. Then you can send a request something like the following:

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/meta/v2/data?q=%7B%22name%22%3A%22mustard+plant%22%7D

.. code-block:: plaintext

   metadata-list -i -v -Q &#039;%7B%22name%22%3A%22mustard+plant%22%7D&#039;

And this will find all metadata with name, "mustard plant" that you have permission to access. For example:

.. code-block:: javascript

   {
      "status":"success",
      "message":null,
      "version":"2.1.8-SNAPSHOT-r8560",
      "result":[
         {
            "uuid":"0001378482703225-8002797ffffddcd-0001-metadata-",
            "owner":"nryan",
            "internalUsername":null,
            "associationIds":null,
            "lastUpdated":"2013-09-06T10:51:10.072-05:00",
            "name":"mustard plant",
            "value":{
               "type":"a plant"
            },
            "created":"2013-09-06T10:51:10.072-05:00",
            "_links":[
               {
                  "self":{
                     "href":"https://public.tenants.agaveapi.co/meta/v2/0001378482703225-8002797ffffddcd-0001-metadata-"
                  }
               }
            ]
         }
      ]
   }

Metadata Permissions
^^^^^^^^^^^^^^^^^^^^

The metadata service supports permissions for both Metadata and Schemata consistent with that of a number of other Tapis services. If no permissions are explicitly set, only the owner of the Metadata and Tapis administrators can access it.

To list the permissions on Metadata for a given user:

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/meta/v2/data/0001381781409939-8002797ffffddcd-0001-012/pems/$USER_TO_SHARE_METADATA_WITH

The following response confirms that the user does not have permissions on that Metadata:

.. code-block:: javascript

   {
       "status":"error",
       "message":"No permissions found for user anotherTapisUser",
       "version":"2.1.8-SNAPSHOT-r8560"
   }

To share Metadata with that user:

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST  
       --data "permission=READ"  
           https://public.tenants.agaveapi.co/meta/v2/data/0001381781409939-8002797ffffddcd-0001-012/pems/$USER_TO_SHARE_METADATA_WITH

To delete all permissions on a Metadata object:

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X DELETE https://public.tenants.agaveapi.co/meta/v2/data/0001381781409939-8002797ffffddcd-0001-012/pems/

Please note that the above will delete all permissions for Metadata, such that only the owner will be able to access it. To remove a specific user, send a POST with permissions set to "NONE" for that user.

Permissions are supported for schemata in a similar manner:

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/meta/v2/schemas/0001381781409939-8002797ffffddcd-0001-012/pems/$USER_TO_SHARE_METADATA_WITH
