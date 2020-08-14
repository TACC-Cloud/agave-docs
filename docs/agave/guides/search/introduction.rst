
Search
------

Search is a fundamental feature of the Tapis Platform. Most of the core science APIs support a mature, URL-based query mechanism allowing you to search using a SQL-inspired JSON syntax. The two exceptions are the Files and Metadata APIs. The Files service does not index the directory or file contents of registered systems, so there is no way for it to performantly search the file system. The Metadata service supports MongoDB query syntax, thus allowing more flexible, and slightly more complex, querying syntax.

Query syntax
^^^^^^^^^^^^

.. code-block:: json

   http://api.tacc.utexas.edu/jobs/v2?name=test%20job

..

   You can include as multiple search expressions to build a more restrictive query.


.. code-block:: json

   http://api.tacc.utexas.edu/jobs/v2?name=test%20job&executionSystem=aws-demo&status=FAILED

By default, search is enabled on each collection endpoint allowing you to trim the response down to the results you care about most. The list of available search terms is identical to the attributes included in the JSON returned when requesting the full resource description.


.. raw:: html

   <aside class="info">To see a full listing of the JSON attributes for each resource in the core science APIs, please see the <a href="/live-docs/" title="Live Docs">Live Docs</a>.</aside>


To search for a specific attribute, you simply append a search expression into the URL query of your request. For example:


.. raw:: html

   <aside class="warning">Note that the values in your search expression must be URL encoded.</aside>


Search operators
^^^^^^^^^^^^^^^^

.. code-block:: shell

   # systems with cloud in their name
   systems/v2?name.like=*cloud*

   # jobs with status equal to PENDING or ARCHIVING
   jobs/v2?status.in=PENDING,ARCHIVING

.. code-block:: plaintext

   # systems with cloud in their name
   tapis systems search --name like '*cloud*'

   # jobs with status equal to PENDING or ARCHIVING
   tapis jobs search --status eq 'PENDING'

By default, all search expressions are evaluated for equality. In order to perform more complex queries, you may append a search operator to the attribute in your search expression. The following examples should help clarify:

For resources with nested collections, you may use JSON dot notation to query the subresources in the collection.

.. code-block:: shell

   # systems using Amazon S3 as the storage protocol
   systems/v2?storage.protocol.eq=S3

   # systems with a batch queue allowing more than 10 concurrent user jobs
   systems/v2?queues.maxUserJobs.gt=10

.. code-block:: plaintext

   # systems using Amazon S3 as the storage protocol
   systems-search 'storage.protocol.eq=S3'

   # systems with a batch queue allowing more than 10 concurrent user jobs
   systems-search 'queues.maxUserJobs.gt=10'

Multiple operators
^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   # jobs whose app has hadoop in the name, ran on an execution system with id aws-demo, and status is equal to FINISHED

   jobs/v2?appId.like=*hadoop*&executionSystem.eq=aws-demo&status.eq=FINISHED

.. code-block:: plaintext

   # jobs whose app has hadoop in the name, ran on an execution system with id aws-demo, and status is equal to FINISHED

   tapis jobs search --app-id like 'hadoop' --system-id eq 'aws-demo' --status eq 'FINISHED'


As before you can include multiple search expressions to narrow your results.

The full list of search operators is given in the following table.

.. list-table::
   :header-rows: 1

   * - Operator
     - Values
     - Description
   * - eq
     - mixed
     - Matches values equal to the given search value. All comparisons are case sensitive. This cannot be used for complex object comparison.
   * - neq
     - mixed
     - Matches values *not* equal to the given search value. All comparisons are case sensitive. This cannot be used for complex object comparison.
   * - lt
     - mixed
     - Matches values less than the given search value.
   * - lte
     - mixed
     - Matches values less than or equal to the given search value.
   * - gt
     - mixed
     - Matches values greater than the given search value.
   * - gte
     - mixed
     - Matches values greater than or equal to the given search value.
   * - in
     - comma-separated list
     - Matches values in the given comma-separated list. This is equivalent to applying the like operator to each comma-separated value.
   * - nin
     - comma-separated list
     - Matches values *not* in the given comma-separated list. This is equivalent to applying the nlike operator to each comma-separated value.
   * - like
     - string
     - Matches values similar to the given search term. Wildcards (^) may be used to perform partial matches.
   * - nlike
     - string
     - Matches values different to the given search term. Wildcards (^) may be used to perform partial matches.


Custom search result
^^^^^^^^^^^^^^^^^^^^

..

   Search with multiple operators and return a custom response
   ```shell

   jobs whose app has cloud in the name and is ran on an execution system with an id that contains docker
   ======================================================================================================


jobs/v2?appId.like=\ *cloud*\ &executionSystem.like=\ *docker*\ &naked=true&limit=3

.. code-block::


   ```plaintext
   # jobs whose app has cloud in the name and is ran on an execution system with an id that contains docker

   jobs-search -v --limit=3 \
               --filter=id,appId,executionSystem,status,created \
               'appId.like=*cloud*' \
               'executionSystem.like=*docker*' \
               'naked=true'

..

   There response will be a JSON array of custom objects comprised of only the fields you specified in the ``filter`` query parameter.


.. code-block:: json

   [
     {
       "id":"2974032102330798566-242ac115-0001-007",
       "appId":"cloud-runner-0.1.0u1",
       "executionSystem":"docker.tacc.utexas.edu",
       "status":"FINISHED",
       "created":"2016-11-03T16:04:53.000-05:00"
     },
     {
       "id":"8643408718823550490-242ac115-0001-007",
       "appId":"cloud-runner-0.1.0u1",
       "executionSystem":"docker.tacc.utexas.edu",
       "status":"FINISHED",
       "created":"2016-11-03T15:17:24.000-05:00"
     },
     {
       "id":"9049010248689521126-242ac115-0001-007",
       "appId":"cloud-runner-0.1.0u1",
       "executionSystem":"docker.tacc.utexas.edu",
       "status":"FINISHED",
       "created":"2016-11-03T15:17:07.000-05:00"
     }
   ]

By combining the search, filtering, and ``naked`` query parameters, you can query the API and return just the information you care about. The example search will return a JSON array of job objects with just the ``id``\ , ``appId``\ , ``executionSystem``\ , ``status``\ , and ``created`` fields from the full job object in the response. This combination of search, filtering, and pagination provides a powerful mechanism for generating custom views of the data.


.. raw:: html

   <aside class="info">For more information on resolving uuid and expanding linked references in the response objects, see the <a href="#uuid">UUID Service Guide</a>.</aside>
