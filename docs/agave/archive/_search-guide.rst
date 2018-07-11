
Search Guide
============

Search is a fundamental feature of the Agave Platform. Each of the core science APIs support a mature, URL-based query mechanism allowing you to search using a sql-inspired json syntax.

By default, search is enabled on each collection endpoint allowing you to trim the response down to the results you care about most. The list of available search terms is identical to the attributes included in the JSON returned when requesting the full resource description.


.. raw:: html

   <aside class="info">To see a full listing of the JSON attributes for each resource in the core science APIs, please see the <a href="http://agaveapi.co/documentation/live-docs/" title="Live Documentation">Live Docs</a>.</aside>


Search syntax
-------------

.. code-block:: shell

   # Search by a single attribute 
   curl -H "Authorization: Bearer $TOKEN" https://public.tenants.agaveapi.co/jobs/v2?name=somejob

   # Remember to URL encode spaces in the search terms 
   curl -H "Authorization: Bearer $TOKEN" https://public.tenants.agaveapi.co/jobs/v2?name=test+job

.. code-block:: plaintext

   # Search by a single attribute 
   jobs-search name=somejob 

   # Remember to URL encode spaces in the search terms 
   jobs-search "name=test+job"

Something should go here.
