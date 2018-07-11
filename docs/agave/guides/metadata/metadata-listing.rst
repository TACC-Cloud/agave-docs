.. role:: raw-html-m2r(raw)
   :format: html


Metadata details
================

..

   Fetching a metadata item

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          https://public.tenants.agaveapi.co/meta/v2/data/7341557475441971686-242ac11f-0001-012?pretty=true

   {: .solution}

   Show Agave CLI &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      metadata-list -v 7341557475441971686-242ac11f-0001-012

   {: .solution}

   The response will look something like the following:

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
        "uuid":"7341557475441971686-242ac11f-0001-012",
        "schemaId":null,
        "internalUsername":null,
        "associationIds":[
          "179338873096442342-242ac113-0001-002",
          "6608339759546166810-242ac114-0001-007"
        ],
        "lastUpdated":"2016-08-29T05:51:39.908-05:00",
        "name":"some metadata",
        "value":{
          "title":"Example Metadata",
          "properties":{
            "species":"arabidopsis",
            "description":"A model plant organism..."
          }
        },
        "created":"2016-08-29T05:43:18.618-05:00",
        "owner":"nryan",
        "_links":{
          "self":{
            "href":"https://public.agaveapi.co/meta/v2/schemas/4736020169528054246-242ac11f-0001-013"
          },
          "permissions":{
            "href":"https://public.agaveapi.co/meta/v2/schemas/4736020169528054246-242ac11f-0001-013/pems"
          },
          "owner":{
            "href":"https://public.agaveapi.co/profiles/v2/nryan"
          },
          "associationIds":[
            {
              "rel":"179338873096442342-242ac113-0001-002",
              "href":"https://public.agaveapi.co/files/v2/media/system/storage.example.com//",
              "title":"file"
            },
            {
              "rel":"6608339759546166810-242ac114-0001-007",
              "href":"https://public.agaveapi.co/jobs/v2/6608339759546166810-242ac114-0001-007",
              "title":"job"
            }
          ]
        }
      }

   {: .solution}


To fetch a detailed description of a metadata item, make a GET request on the resource URL. The response will be the full metadata item representation. Two points of interest in the example response are that the response does not have an ``id`` field. Instead, it has a ``uuid`` field which serves as its ID. This is the result of regression support for legacy consumers and will be changed in the next major release.

The second point of interest in the response is the ``_links.associationIds`` array in the hypermedia response. This contains an expanded representation of the ``associationIds`` field in the body. The objects in this array are similar to the information you would recieve by calling the :raw-html-m2r:`<a href="#uuid">UUID API</a>` to resolve each of the ``associationIds`` array values. By leveraging the information in the hypermedia response, you can save several round trips to resolve basic information about the resources the ``associationIds`` represent.

:information_source: In the event you need the entire resource representations for each ``associationIds`` value, you can simply explode the json array into a comma-separated string and call the :raw-html-m2r:`<a href="#uuid">UUID API</a>` with ``expand=true`` in the query.

Metadata browsing
-----------------

..

   Listing your metadata

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          'https://api.sd2e.org/meta/v2/data?limit=1&pretty=true'

   {: .solution}

   Show Agave CLI &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: plaintext

      metadata-list -v -l 1

   {: .solution}

   The response will look something like the following:

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

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
              "href": "https://public.agaveapi.co/meta/v2/schemas/4736020169528054246-242ac11f-0001-013"
            },
            "permissions": {
              "href": "https://public.agaveapi.co/meta/v2/schemas/4736020169528054246-242ac11f-0001-013/pems"
            },
            "owner": {
              "href": "https://public.agaveapi.co/profiles/v2/nryan"
            },
            "associationIds": [
              {
                "rel": "179338873096442342-242ac113-0001-002",
                "href": "https://public.agaveapi.co/files/v2/media/system/storage.example.com//",
                "title": "file"
              },
              {
                "rel": "6608339759546166810-242ac114-0001-007",
                "href": "https://public.agaveapi.co/jobs/v2/6608339759546166810-242ac114-0001-007",
                "title": "job"
              }
            ]
          }
        }
      ]

   {: .solution}


To browse your Metadata, make a GET request against the ``/meta/v2/data`` collection. This will return all the metadata you created and to which you have been granted READ access. This includes any metadata items that have been shared with the ``public`` or ``world`` users. In practice, users will have many metadata items created and shared with them as part of normal use of the platform, so pagination and :raw-html-m2r:`<a href="#metadata-search">search</a>` become important aspects of interacting with the service.

For admins, who have implicit access to all metadata, the default listing response will be a paginated list of every metadata item in the tenant. To avoid such a scenario, admin users can append ``privileged=false`` to bypass implicit permissions and only return the metadata queries to which they have ownership or been granted explicit access.

:information_source: Admin users can append ``privileged=false`` to bypass implicit permissions and only return the metadata queries to which they have ownership or been granted explicit access.
