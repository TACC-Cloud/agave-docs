.. role:: raw-html-m2r(raw)
   :format: html


Metadata details
================

..

   Fetching a metadata item

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            https://api.tacc.utexas.edu/meta/v2/data/6877878304112316906-242ac116-0001-012?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis CLI**

     .. code-block:: shell

        tapis meta show -v 6877878304112316906-242ac116-0001-012
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "uuid": "6877878304112316906-242ac116-0001-012",
          "schemaId": null,
          "internalUsername": null,
          "owner": "sgopal",
          "associationIds": [],
          "name": "sgopal.c41109da13893b6f.200414T001817Z",
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
          "created": "2020-04-13T19:18:17.567-05:00",
          "lastUpdated": "2020-04-13T19:18:17.567-05:00",
          "_links": {
            "self": {
              "href": "https://api.sd2e.org/meta/v2/data/6877878304112316906-242ac116-0001-012"
            },
            "permissions": {
              "href": "https://api.sd2e.org/meta/v2/data/6877878304112316906-242ac116-0001-012/pems"
            },
            "owner": {
              "href": "https://api.sd2e.org/profiles/v2/sgopal"
            },
            "associationIds": []
          }
        }
|


To fetch a detailed description of a metadata item, make a GET request on the resource URL. The response will be the full metadata item representation. Two points of interest in the example response are that the response does not have an ``id`` field. Instead, it has a ``uuid`` field which serves as its ID. This is the result of regression support for legacy consumers and will be changed in the next major release.

The second point of interest in the response is the ``_links.associationIds`` array in the hypermedia response. This contains an expanded representation of the ``associationIds`` field in the body. The objects in this array are similar to the information you would recieve by calling the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/uuids/introduction.html">UUID API</a>` to resolve each of the ``associationIds`` array values. By leveraging the information in the hypermedia response, you can save several round trips to resolve basic information about the resources the ``associationIds`` represent.

:information_source: In the event you need the entire resource representations for each ``associationIds`` value, you can simply explode the json array into a comma-separated string and call the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/uuids/introduction.html">UUID API</a>` with ``expand=true`` in the query.

Metadata browsing
-----------------

..

   Listing your metadata

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
            'https://api.tacc.utexas.edu/meta/v2/data?limit=1&pretty=true'
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show Tapis CLI**

     .. code-block:: plaintext

        tapis meta list -v -l 1
|

   The response will look something like the following:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
          {
            "uuid": "6877878304112316906-242ac116-0001-012",
            "owner": "sgopal",
            "associationIds": [],
            "name": "sgopal.c41109da13893b6f.200414T001817Z",
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
            "created": "2020-04-13T19:18:17.567-05:00",
            "lastUpdated": "2020-04-13T19:18:17.567-05:00",
            "_links": {
              "self": {
                "href": "https://api.sd2e.org/meta/v2/data/6877878304112316906-242ac116-0001-012"
              },
              "permissions": {
                "href": "https://api.sd2e.org/meta/v2/data/6877878304112316906-242ac116-0001-012/pems"
              },
              "owner": {
                "href": "https://api.sd2e.org/profiles/v2/sgopal"
              },
              "associationIds": []
            }
          }
        ]
|


To browse your Metadata, make a GET request against the ``/meta/v2/data`` collection. This will return all the metadata you created and to which you have been granted READ access. This includes any metadata items that have been shared with the ``public`` or ``world`` users. In practice, users will have many metadata items created and shared with them as part of normal use of the platform, so pagination and :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/metadata/metadata-search.html">search</a>` become important aspects of interacting with the service.

For admins, who have implicit access to all metadata, the default listing response will be a paginated list of every metadata item in the tenant. To avoid such a scenario, admin users can append ``privileged=false`` to bypass implicit permissions and only return the metadata queries to which they have ownership or been granted explicit access.

:information_source: Admin users can append ``privileged=false`` to bypass implicit permissions and only return the metadata queries to which they have ownership or been granted explicit access.
