
What is provenance
------------------

Provenance is:


* Log with relationships
* Not versioning
* Not assuring reproducibility
* Bank statement, not model car.

What information is available
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Agave tracks every direct action it takes on a file or directory. Additionally, it will make note of any indirect action it observes about file or directory. Examples of direct action are transferring a directory from one system to another or renaming a file. Examples of indirect action are a user manually deleting a file from the command line. The table below contains a list of all the provenance actions recorded.


.. raw:: html

   <pre>`Insert data provenance table
   `</pre>


How accurate is this information
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Agave does not own the storage and execution systems you access through the REST APIs, so it cannot guarantee that it will be aware of everything that happens on that file system. Thus, Agave takes a best-effort approach to provenance allowing you to choose, through your own use of best practices, how thorough you want the provenance trail of your data to be.

Why is this useful?
^^^^^^^^^^^^^^^^^^^


.. raw:: html

   <ul>
   <li>See who did what, when</li>
   <li>Check data integrity</li>
   <li>Answer origin questions</li>
   <li>Get alerts and do forensics</li>
   <li>Trace steps of experiment</li>
   </ul>


Accessing data provenance information
-------------------------------------

Listing recent events
^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/files/v2/hisotry/data.agaveapi.co/$API_USERNAME/picksumipsum.txt

.. code-block:: plaintext

   files-history -v -S data.agaveapi.co $API_USERNAME/picksumipsum.txt

The response to this contains a summary listing all permissions on the

.. code-block:: javascript

   []

Searching for events
^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" https://public.tenants.agaveapi.co/files/v2/hisotry/data.agaveapi.co/$API_USERNAME/picksumipsum.txt?agent=rjohnson

.. code-block:: plaintext

   files-history -v -S data.agaveapi.co -U rjohnson $API_USERNAME/picksumipsum.txt

The response to this contains a JSON array of every action performed on the file by the user rjohnson.

.. code-block:: javascript

   []
