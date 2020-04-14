.. role:: raw-html-m2r(raw)
   :format: html


Metadata
========

The Tapis Metadata service allows you to manage metadata and associate it with Tapis entities via associated UUIDs. It supports JSON schema for structured JSON metadata; it also accepts any valid JSON-formatted metadata or plain text String when no schema is specified. As with other Tapis services, a full access control layer is available, enabling you to keep your metadata private or share it with your colleagues.

Metadata Structure
------------------

..

   Key-value metadata item


.. code-block:: json

   {
     "name": "some metadata",
     "value": "A model organism...",
   }

..

   Structured metadata item, metadata.json


.. code-block:: json

   {
     "name":"some metadata",
     "value":{
       "title":"Example Metadata",
       "properties":{
         "species":"arabidopsis",
         "description":"A model organism..."
       }
     }
   }

Every metadata item has four fields shown in the following table.

.. list-table::
   :header-rows: 1

   * - Field name
     - Type
     - Description
   * - name
     - string; 1-256
     - ``required`` A non-unique key you can use to reference and group your metadata.
   * - value
     - json
     - string; 0-5M
     - ``required`` The application metadata you want to store. Binary data is not supported.
   * - associationIds
     - array;
     - An JSON array of zero or more UUID to which this metadata item should be associated.
   * - schemaId
     - string;
     - The id of a valid Tapis metadata schema object representing the JSON Schema definition used to validate this metadata item.


The ``name`` field is just that, a user-defined name you give to your metadata item. There is no uniqueness constraint put on the ``name`` field, so it is up to you to the application to enforce whatever naming policy it sees fit.

Depending on your application needs, you may use the Metadata service as a key-value store, document store, or both. When using it as a key-value store, you provide text for the ``value`` field. When you fetching data, you could search by exact value or full-text search as needed.

When using the Metadata service as a document store, you provide a JSON object or array for the ``value`` field. In this use case you can leverage additional functionality such as structured queries, atomic updates, etc.

Either use case is acceptable and fully supported. Your application needs will determine the best approach for you to take.

Associations
^^^^^^^^^^^^

Each metadata item also has an optional ``associationIds`` field. This field contains a JSON array of Tapis UUID for which this metadata item applies. This provides a convenient grouping mechanism by which to organize logically-related resources. One common examples is creating a metadata item to represent a "data collection" and associating files and folders that may be geographically distributed under that "data collection". Another is creating a metadata item to represent a "project", then sharing the "project" with other users involved in the "project".

Metadata items can also be associated with other metadata items to create hierarchical relationships. Building on the "project" example, additional metadata items could be created for "links", "videos", and "experiments" to hold references for categorized groups of postits, video file items, and jobs respectively. Such a model translates well to a user interface layer and eliminates a large amount of boilerplate code in your application.

:information_source: The :raw-html-m2r:`<code class="highlight">associationIds</code>` field does not carry with it any special permissions or behavior. It is simply a link between a metadata item and the resources it represents.

Creating Metadata
-----------------

..

   Create a new metadata item
.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
            -H 'Content-Type: application/json'
            --data-binary '{"value": {"title": "Example Metadata", "properties": {"species": "arabidopsis", "description": "A model organism..."}}, "name": "mustard plant"}'
            https://api.tacc.utexas.edu/meta/v2/data?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis CLI**

     .. code-block:: shell

        meta create -v -V '{"value": {"title": "Example Metadata", "properties": {"species": "arabidopsis", "description": "A model organism..."}}, "name": "mustard plant"}'
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

     {
        "uuid": "4054837257140638186-242ac116-0001-012",
        "schemaId": null,
        "internalUsername": null,
        "owner": "sgopal",
        "associationIds": [],
        "name": "sgopal.c41109da13893b6f.200414T000224Z",
        "value": {
          "value": {
            "title": "Example Metadata",
            "properties": {
              "species": "arabidopsis",
              "description": "A model organism..."
          }
        },
          "name": "mustard plant"
        },
        "created": "2020-04-13T19:02:24.336-05:00",
        "lastUpdated": "2020-04-13T19:02:24.336-05:00",
        "_links": {
          "self": {
            "href": "https://api.sd2e.org/meta/v2/data/4054837257140638186-242ac116-0001-012"
          },
          "permissions": {
            "href": "https://api.sd2e.org/meta/v2/data/4054837257140638186-242ac116-0001-012/pems"
          },
          "owner": {
            "href": "https://api.sd2e.org/profiles/v2/sgopal"
          },
          "associationIds": []
        }
     }
|


New Metadata are created in the repository via a POST to their collection URLs. As we mentioned before, there is no uniqueness constraint placed on metadata items. Thus, repeatedly POSTing the same metadata item to the service will create duplicate entries, each with their own unique UUID assigned by the service.

Updating Metadata
-----------------

..

   Update a metadata item

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
            -H 'Content-Type: application/json'
            --data-binary '{"value": {"title": "Example Metadata", "properties": {"species": "arabidopsis", "description": "A model plant organism..."}}, "name": "some metadata", "associationIds":["179338873096442342-242ac113-0001-002","6608339759546166810-242ac114-0001-007"]}'
            https://api.tacc.utexas.edu/meta/v2/data/7341557475441971686-242ac11f-0001-012?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis CLI**

     .. code-block:: shell

        metadata-addupdate -v -F - 7341557475441971686-242ac11f-0001-012 <<<'{"value": {"title": "Example Metadata", "properties": {"species": "arabidopsis", "description": "A model plant organism..."}}, "name": "some metadata", "associationIds":["179338873096442342-242ac113-0001-002","6608339759546166810-242ac114-0001-007"]}'
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "uuid": "7341557475441971686-242ac11f-0001-012",
          "schemaId": null,
          "internalUsername": null,
          "associationIds": [
            "179338873096442342-242ac113-0001-002",
            "6608339759546166810-242ac114-0001-007"
          ],
          "lastUpdated": "2016-08-29T05:51:39.908-05:00",
          "name": "some metadata",
          "value": {
            "title": "Example Metadata",
            "properties": {
              "species": "arabidopsis",
              "description": "A model plant organism..."
            }
          },
          "created": "2016-08-29T05:43:18.618-05:00",
          "owner": "nryan",
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/meta/v2/data/7341557475441971686-242ac11f-0001-012"
            },
            "permissions": {
              "href": "https://api.tacc.utexas.edu/meta/v2/data/7341557475441971686-242ac11f-0001-012/pems"
            },
            "owner": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
            },
            "associationIds": [
              {
                "rel": "179338873096442342-242ac113-0001-002",
                "href": "https://api.tacc.utexas.edu/files/v2/media/system/storage.example.com//",
                "title": "file"
              },
              {
                "rel": "6608339759546166810-242ac114-0001-007",
                "href": "https://api.tacc.utexas.edu/jobs/v2/6608339759546166810-242ac114-0001-007",
                "title": "job"
              }
            ]
          }
        }
|


Updating metadata is done by POSTing an updated metadata object to the existing resource. When updating, it is important to note that it is not possible to change the metadata ``uuid``\ , ``owner``\ , ``lastUpdated`` or ``created`` fields. Those fields are managed by the service.

Deleting Metadata
-----------------

..

   Delete a metadata item

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            -X DELETE
            https://api.tacc.utexas.edu/meta/v2/data/7341557475441971686-242ac11f-0001-012?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis CLI**

     .. code-block:: shell

        tapis meta delete 7341557475441971686-242ac11f-0001-012
|

   An empty response will be returned from the service.


To delete a metadata item, simply make a DELETE request on the metadata resource.

:warning: Deleting a metadata item will permanently delete the item and all its permissions, etc.
