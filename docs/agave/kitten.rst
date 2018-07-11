
Agave API Introduction
======================

Welcome to the Kittn API! You can use our API to access Kittn API endpoints, which can get information on various cats, kittens, and breeds in our database.

We have language bindings in Shell, Ruby, and Python! You can view code examples in the dark area to the right, and you can switch the programming language of the examples with the tabs in the top right.

This example API documentation page was created with `Slate <https://github.com/tripit/slate>`_. Feel free to edit it and use it as a base for your own API's documentation.

Kittens Authentication
======================

..

   Make sure to replace ``meowmeowmeow`` with a valid API key


.. code-block:: shell

   # With shell, you pass an Authoriation header with your API key with each request
   curl "https://cats.io/api"
     -H "Authorization: meowmeowmeow"

.. code-block:: python

   import kittn
   api = kittn.authorize('meowmeowmeow')

.. code-block:: plaintext

   % kitten-cli auth -h "meowmeowmeow"

..

   You will get back a JSON response like this one:


.. code-block:: json

   {
     "scope": "default",
     "token_type": "bearer",
     "expires_in": 14400,
     "refresh_token": "8aa0d5d10a39f17d2ba1e269d2d5e1d3",
     "access_token": "64b595f5ab36968ecd35f3192f722816"
   }

Kittn uses API keys to allow access to the API. You can register a new Kittn API key at our `developer portal <http://example.com/developers>`_.

Kittn expects for the API key to be included in all API requests to the server in a header that looks like the following:

``Authorization: meowmeowmeow``


.. raw:: html

   <aside class="notice">
   You must replace <code>meowmeowmeow</code> with your personal API key.
   </aside>


Kittens Services
================

Get All Kittens
---------------

.. code-block:: python

   import kittn

   api = kittn.authorize('meowmeowmeow')
   api.kittens.get()

.. code-block:: shell

   curl "http://example.com/api/kittens"
     -H "Authorization: meowmeowmeow"

.. code-block:: plaintext

   kitten-cli list

..

   The above command returns JSON structured like this:


.. code-block:: json

   [
     {
       "id": 1,
       "name": "Fluffums",
       "breed": "calico",
       "fluffiness": 6,
       "cuteness": 7
     },
     {
       "id": 2,
       "name": "Max",
       "breed": "unknown",
       "fluffiness": 5,
       "cuteness": 10
     }
   ]

This endpoint retrieves all kittens.

HTTP Request
^^^^^^^^^^^^

``GET http://example.com/api/kittens``

Query Parameters
^^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1

   * - Parameter
     - Default
     - Description
   * - include_cats
     - false
     - If set to true, the result will also include cats.
   * - available
     - true
     - If set to false, the result will include kittens that have already been adopted.



.. raw:: html

   <aside class="success">
   Remember — a happy kitten is an authenticated kitten!
   </aside>


Get a Specific Kitten
---------------------

.. code-block:: shell

   curl "http://example.com/api/kittens/2"
     -H "Authorization: meowmeowmeow"

.. code-block:: python

   import kittn

   api = kittn.authorize('meowmeowmeow')
   api.kittens.get(2)

.. code-block:: plaintext

   % kitten-cli get 2

..

   The above command returns JSON structured like this:


.. code-block:: json

   {
     "id": 2,
     "name": "Max",
     "breed": "unknown",
     "fluffiness": 5,
     "cuteness": 10
   }

This endpoint retrieves a specific kitten.


.. raw:: html

   <aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>


HTTP Request
^^^^^^^^^^^^

``GET http://example.com/kittens/<ID>``

URL Parameters
^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1

   * - Parameter
     - Description
   * - ID
     - The ID of the kitten to retrieve


Delete a Specific Kitten
------------------------

.. code-block:: ruby

   require 'kittn'

   api = Kittn::APIClient.authorize!('meowmeowmeow')
   api.kittens.delete(2)

.. code-block:: python

   import kittn

   api = kittn.authorize('meowmeowmeow')
   api.kittens.delete(2)

.. code-block:: shell

   curl "http://example.com/api/kittens/2"
     -X DELETE
     -H "Authorization: meowmeowmeow"

.. code-block:: javascript

   const kittn = require('kittn');

   let api = kittn.authorize('meowmeowmeow');
   let max = api.kittens.delete(2);

..

   The above command returns JSON structured like this:


.. code-block:: json

   {
     "id": 2,
     "deleted" : ":("
   }

This endpoint retrieves a specific kitten.

HTTP Request
^^^^^^^^^^^^

``DELETE http://example.com/kittens/<ID>``

URL Parameters
^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1

   * - Parameter
     - Description
   * - ID
     - The ID of the kitten to delete

