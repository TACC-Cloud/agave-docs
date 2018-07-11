
Tags
====

The Agave Tags service provides free form tagging of any addressable resource in the platform. 
A Tag is similiar to a `Metadata <../metadata/introduction.md>`_ object in that 
it has ``name`` and ``associatedIds`` fields, but Tags do not contain any other data. 
Tags have permissions just like tags, but unlike the Tags service, Tag names must be unique 
for a given user or group. That means you can only have one tag with a given name, but 
multiple users may create tags with the same name.

----

Tag Structure
-------------

Every tag has the two fields shown in the following table.

.. list-table::
   :header-rows: 1

   * - Field name
     - Type
     - Description
   * - ``name``
     - string; 1-256
     - A **required** alphanumeric key **unique** within the set of tags for a given user, which can be used in leu of the id.
   * - ``associationIds``
     - array
     - A JSON array of zero or more UUID to which this tag should be associated.


..

   Show tag structure &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
        "name": "some metadata",
        "associationIds": [],
      }

   {: .solution}


Names
^^^^^

The ``name`` field is just that -- a user-defined name you give to your tag. Every ``name`` 
field must be unique within the set of tags available to the user. This means that two 
users can create tags with the same name, but each tag will have its own unique id and be 
managed as a distinct resource. 

A user may not create multiple tags with the same name, but they may share a tag with 
someone who already has a tag of the same name. In that situation, referencing the private 
and shared tag by ID will prevent ambiguity over which tag is being used. When the tag id 
is not specified, the private tag owned by the requesting user will always be selected.

Associations
^^^^^^^^^^^^

Each tag also has an optional ``associationIds`` field. This field contains a JSON array of 
Agave UUID for which this tag applies. We refer to the resources in this array as the 
tagged resources. No implied behavior comes with this relationship, it is simply a way to 
define arbitrary associations between resources.

*The ``associationIds`` field does not carry with it any special permissions or behavior. 
It is simply a link between a tag and the resources it represents.*

----

Creating tags
-------------

Create a new tag with the following CLI command:

.. code-block:: plaintext

   tags-addupdate -v -F - <<<'{"name": "demo"}'

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST  
          -H 'Content-Type: application/json'
          --data-binary '{"name": "demo"}'
          https://public.tenants.agaveapi.co/tags/v2

   {: .solution}

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
        "id": "3042501574756462105-242ac113-0001-048",
        "name": "demo",
        "associationIds": [],
        "lastUpdated": "2017-03-13T12:37:14.000-05:00",
        "created": "2017-03-13T12:38:14.000-05:00",
        "_links": {
          "self": {
            "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048"
          },
          "associationIds": {
            "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/associations"
          },
          "permissions": {
            "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems"
          },
          "owner": {
            "href": "https://public.agaveapi.co/profiles/v2/nryan"
          }
        }
      }

   {: .solution}


New Tags are created by making a POST request to the Tags collection. As we mentioned before, Tag names are unique for a given user, so attempting to create a tag with an existing name will fail.

----

Updating tags
-------------

Update a tag with the either of the following CLI commands:

.. code-block:: plaintext

   tags-addupdate -v -F - demo <<<'{"name": "demo", "associationIds":["576158795084066330-242ac119-0001-007","1557538007895839206-242ac119-0001-007"]}'

.. code-block:: plaintext

   tags-addupdate -v -F - 3042501574756462105-242ac113-0001-048 <<<'{"name": "demo", "associationIds":["576158795084066330-242ac119-0001-007","1557538007895839206-242ac119-0001-007"]}'

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST
          -H 'Content-Type: application/json'
          --data-binary '{"name": "demo", "associationIds":["576158795084066330-242ac119-0001-007","1557538007895839206-242ac119-0001-007"]}'
          https://public.tenants.agaveapi.co/tags/v2/demo

   {: .solution}

   Show response &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: json

      {
       "id": "3042501574756462105-242ac113-0001-048",
        "name": "demo",
        "associationIds": [
          "576158795084066330-242ac119-0001-007",
          "1557538007895839206-242ac119-0001-007"
        ],
        "lastUpdated": "2017-03-13T12:38:14.000-05:00",
        "created": "2017-03-13T12:38:14.000-05:00",
        "_links": {
          "self": {
            "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048"
          },
          "associationIds": {
            "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/associations"
          },
          "permissions": {
            "href": "https://public.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048/pems"
          },
          "owner": {
            "href": "https://public.agaveapi.co/profiles/v2/nryan"
          }
        }
      }

   {: .solution}


Updating tags is done by POSTing an updated tag object to the existing resource. 
When updating, it is important to note that it is not possible to change the tag 
``uuid``\ , ``owner``\ , ``lastUpdated``\ , or ``created`` fields. Those fields are managed by the service.

----

Deleting metadata
-----------------

Delete a tag with either of the following CLI commands:

.. code-block:: plaintext

   tags-delete demo

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -X DELETE
          https://public.tenants.agaveapi.co/tags/v2/demo

   {: .solution}


.. code-block:: plaintext

   tags-delete 3042501574756462105-242ac113-0001-048

..

   Show cURL &nbsp;&nbsp;
   ^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -X DELETE
          https://public.tenants.agaveapi.co/tags/v2/3042501574756462105-242ac113-0001-048

   {: .solution}

   An empty response will be returned from the service.


To delete a tag, simply make a DELETE request on the tag resource.

*Deleting a tag will permanently delete the item and all its permissions, etc.*
