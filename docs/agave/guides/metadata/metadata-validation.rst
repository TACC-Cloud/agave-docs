
Metadata Validation
===================

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
            -H 'Content-Type: application/json'
            --data-binary '{"schemaId": "4736020169528054246-242ac11f-0001-013", "value": {"title": "Example Metadata", "properties": {"description": "A model organism..."}}, "name": "some metadata"}'
            https://api.tacc.utexas.edu/meta/v2/data
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis CLI**

     .. code-block:: shell

        metadata-addupdate -v -F - <<<'{"schemaId": "4736020169528054246-242ac11f-0001-013", "value": {"title": "Example Metadata", "properties": {"description": "A model organism..."}}, "name": "some metadata"}'
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "status" : "error",
          "message" : "Metadata value does not conform to schema.",
          "version" : "2.1.8-r8bb7e86"
        }
|


Often times it is necessary to validate metadata for format or simple quality control. The Metadata service is capable of validating the ``value`` of a metadata item against a predefined JSON Schema definition. In order to leverage this feature, you must first register your JSON Schema definition with the Metadata Schemata service, then reference the UUID of that metadata schema resource in the ``schemaId`` field.

Given our previous example metadata schema object, the following request would fail due to a missing "species" value in the metadata item ``value`` field.
