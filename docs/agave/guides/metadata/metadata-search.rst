
Metadata Searching
==================

..

   Searching metadata for all items with name like "mustard plant"

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            --data-urlencode '{"name": "mustard plant"}'
            https://api.tacc.utexas.edu/meta/v2/data
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis CLI**

     .. code-block:: plaintext

        metadata-list -v -Q '{"name":"mustard+plant"}'
        tapis meta search --name like "mustard"
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
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
                "href": "https://api.tacc.utexas.edu/meta/v2/schemas/4736020169528054246-242ac11f-0001-013"
              },
              "permissions": {
                "href": "https://api.tacc.utexas.edu/meta/v2/schemas/4736020169528054246-242ac11f-0001-013/pems"
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
        ]
|


In addition to retrieving Metadata via its UUID, the Metadata service supports `MongoDB query syntax <https://docs.mongodb.com/manual/tutorial/query-documents/>`_. Just add the ``q=<value>`` to URL query portion of your GET request on the metadata collection. This differs from other APIs, but provides a richer syntax to query and filter responses.

If you wanted to look up Metadata corresponding to a specific value within its JSON Metadata value, you can specify this using a JSON object such as ``{"name": "mustard plant"}``. Remember that, in order to send JSON in a URL query string, it must first be URL encoded. Luckily this is easily handled for us by ``curl`` and the Tapis CLI.


.. raw:: html

   <aside class="alert">In order to send JSON in a URL query string, it must first be URL encoded.</aside>


The given query will return all metadata with name, "mustard plant" that you have permission to access.

Search Examples
---------------

..

   metadata search by exact name


.. code-block:: json

   {"name": "mustard plant"}

..

   metadata search by field in value


.. code-block:: json

   {"value.type": "a plant"}

..

   metadata search for values with any field matching an item in the given array


.. code-block:: json

   { "value.profile.status": { "$in": [ "active", "paused" ] } }

..

   metadata search for items with a name matching a case-insensitive regex


.. code-block:: json

   { "name": { "$regex": "^Cactus.*", "$options": "i"}}

..

   metadata search for value by regex matched against each line of a value


.. code-block:: json

   { "value.description": { "$regex": ".*monocots.*", "$options": "m"}}

..

   metadata search for value by conditional queries


.. code-block:: json

   {
      "$or":[
         {
            "value.description":{
               "$regex":[
                  ".*prickly pear.*",
                  ".*tapis.*",
                  ".*century.*"
               ],
               "$options":"i"
            }
         },
         {
            "value.title":{
               "$regex":".*Cactus$"
            },
            "value.order":{
               "$regex":"Agavoideae"
            }
         }
      ]
   }

Some common search syntax examples. Consult the `MongoDB Query Documentation <https://docs.mongodb.com/manual/tutorial/query-documents/>`_ for more examples and full syntax documentation.
