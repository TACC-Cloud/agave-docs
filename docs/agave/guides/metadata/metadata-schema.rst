.. role:: raw-html-m2r(raw)
   :format: html


Metadata Schemata
=================

Schema can be provided in JSON Schema form. The service will validate that the schema is valid JSON and store it. To validate Metadata against it, the schema UUID should be given as a parameter, ``schemaId``\ , when uploading Metadata. If no `schemaId`` is provided, the Metadata service will accept any JSON Object or plain text string and store it accordingly. This flexible approach allows Tapis (Agave) a high degree of flexibility in handling structured and unstructured metadata alike.

For more on JSON Schema please see :raw-html-m2r:`<a title="JSON Schema" href="http://json-schema.org/">http://json-schema.org/</a>`

:information_source: The metadata service supports both JSON Schema v3 and v4. No additional work is needed on your part to specify which version you want to use, the service will autodetect the version and validate it accordingly. 

To add a metadata schema to the repository:

Creating schemata
-----------------

..

   Example JSON Schema document, schema.json


.. code-block:: json

   {
     "title": "Example Schema",
     "type": "object",
     "properties": {
       "species": {
         "type": "string"
       }
     },
     "required": [
       "species"
     ]
   }

..

   Creating a new metadata schema

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            -X POST -H "Content-Type: application/json"
            --data-binary '{ "title": "Example Schema", "type": "object", "properties": { "species": { "type": "string" } },"required": ["species"] }'
            https://api.tacc.utexas.edu/meta/v2/schemas/
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis (Agave) CLI**

     .. code-block:: shell

        metadata-schema-addupdate -v -F schema.json
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "uuid": "4736020169528054246-242ac11f-0001-013",
          "internalUsername": null,
          "lastUpdated": "2016-08-29T04:52:11.474-05:00",
          "schema": {
            "title": "Example Schema",
            "type": "object",
            "properties": {
              "species": {
                "type": "string"
              }
            },
            "required": [
              "species"
            ]
          },
          "created": "2016-08-29T04:52:11.474-05:00",
          "owner": "nryan",
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/meta/v2/schemas/4736020169528054246-242ac11f-0001-013"
            },
            "permissions": {
              "href": "https://papi.tacc.utexas.edu/meta/v2/schemas/4736020169528054246-242ac11f-0001-013/pems"
            },
            "owner": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
            }
          }
        }
|


To create a new metadata schema that can be used to validate metadata items upon addition or updating, POST a JSON Schema document to the service.

More JSON Schema examples can be found in the `Tapis (Agave) Samples <https://bitbucket.org/agaveapi/science-api-samples>`_ project.

Updating schema
---------------

..

   Update a metadata schema

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
            -H 'Content-Type: application/json'
            --data-binary '{ "title": "Example Schema", "type": "object", "properties": { "species": { "type": "string" }, "description": {"type":"string"} },"required": ["species"] }'
            https://api.tacc.utexas.edu/meta/v2/data/4736020169528054246-242ac11f-0001-013
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis (Agave) CLI**

     .. code-block:: shell

        metadata-addupdate -v -F - 4736020169528054246-242ac11f-0001-013 <<< '{ "title": "Example Schema", "type": "object", "properties": { "species": { "type": "string" }, "description": {"type":"string"} },"required": ["species"] }'
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "uuid": "4736020169528054246-242ac11f-0001-013",
          "internalUsername": null,
          "lastUpdated": "2016-08-29T04:52:11.474-05:00",
          "schema": {
            "title": "Example Schema",
            "type": "object",
            "properties": {
              "species": {
                "type": "string"
              }
            },
            "required": [
              "species"
            ]
          },
          "created": "2016-08-29T04:52:11.474-05:00",
          "owner": "nryan",
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/meta/v2/schemas/4736020169528054246-242ac11f-0001-013"
            },
            "permissions": {
              "href": "https://api.tacc.utexas.edu/meta/v2/schemas/4736020169528054246-242ac11f-0001-013/pems"
            },
            "owner": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
            }
          }
        }
|


Updating metadata schema is done by POSTing an updated schema object to the existing resource. When updating, it is important to note that it is not possible to change the schema ``uuid``\ , ``owner``\ , ``lastUpdated`` or ``created`` fields. Those fields are managed by the service.

Deleting schema
---------------

..

   Delete a metadata schema

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            -X DELETE
            https://api.tacc.utexas.edu/meta/v2/data/4736020169528054246-242ac11f-0001-013
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis (Agave) CLI**

     .. code-block:: plaintext

        metadata-schema-delete 4736020169528054246-242ac11f-0001-013
|

   An empty response will be returned from the service.


To delete a metadata schema, simply make a DELETE request on the metadata schema resource.

:warning: Deleting a metadata schema will permanently delete the schema and all its history, permissions, etc. Once the schema is deleted, the remaining metadata items will not be automatically updated, thus it is important to know that updates to metadata items that still reference the schema will fail.

Specifying schemata as $ref
---------------------------

When building new JSON Schema definitions, it is often helpful to break each object out into its own definition and use ``$ref`` fields to reference them. The metadata service supports such references between metadata schema resources. Simply provide the fully qualified URL of another valid metadata schema resources as the value to a ``$ref`` field and Tapis (Agave) will resolve the reference internally, applying the appropriate authentication and authorization for the requesting user to the request to the referenced resource.

:warning: When using Tapis (Agave) Metadata Schema as external references in a JSON Schema definition, make sure you grant at READ permission or greater to every referenced Agave Metadata Schema resource needed to resolved the JSON Schema definition. 
