.. role:: raw-html-m2r(raw)
   :format: html


Publishing data
===============

Tapis provides multiple ways to share your data with your colleagues and the general public. In addition to the standard permission model enabling you to share your data with one or more authenticated users within the Platform, you also have the ability to publish your data and make it available via an unauthenticated public URL. Unlike traditional web and cloud hosting, your data remains in its original location and is served in situ by Tapis upon user request.

Publishing a file for folder is simply a matter of granting the special ``public`` user ``READ`` permission on a file or folder. Similar to the way listings and permissions are exposed through unique paths in the Files API, published data is served from a custom ``/files/v2/download`` path. The public data URLs have the following structure:

``https://api.tacc.utexas.edu/files/v2/download/<username>/system/<system_id>/<path>``

Notice two things. First, a username is inserted after the *download* path element. This is needed because there is no authorized user for whom to validate system or file ownership on a public request. The username gives the context by which to verify the availability of the system and file item being requested. Second, the ``system_id`` is mandatory in public data requests. This ensures that the public URL remains the same even when the default storage system of the user who published it changes.

The following sections give examples of publishing files and folders in the Tapis Platform.

See the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/postits/introduction.html">PostIts Guide</a>` for other ways to securely share your data with others.

Publishing individual files
---------------------------

Publish file item on your default storage system for public access

.. code-block:: plaintext

   tapis files pems grant agave:// public READ

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "Content-Type: application/json" \
          -X POST \
          --data '{"username","public", "permission":"READ"}' \
          https://api.tacc.utexas.edu/files/v2/pems/nryan/picksumipsum.txt
|


Publish file item on a named system for public access

.. code-block:: plaintext

   files-pems-update -u public -p READ -S data.iplantcollaborative.org nryan/picksumipsum.txt

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "Content-Type: application/json" \
          -X POST \
          --data '{"username","public", "permission":"READ"}' \
          https://api.tacc.utexas.edu/files/v2/pems/system/data.iplantcollaborative.org/nryan/picksumipsum.txt
|


The response will look something like the following:

.. code-block:: json

   {
     "username": "public",
     "permission": {
       "read": true,
       "write": false,
       "execute": false
     },
     "recursive": false,
     "_links": {
       "self": {
         "href": "https://api.tacc.utexas.edu/files/v2/pems/system/data.iplantcollaborative.org/nryan/picksumipsum.txt?username.eq=public"
       },
       "file": {
         "href": "https://api.tacc.utexas.edu/files/v2/pems/system/data.iplantcollaborative.org/nryan/picksumipsum.txt"
       },
       "profile": {
         "href": "https://api.tacc.utexas.edu/profiles/v2/public"
       }
     }
   }

Publishing a file for folder is simply a matter of giving the special ``public`` user ``READ`` permission on the file. Once published, the file will be available at the following URL:

``https://api.tacc.utexas.edu/files/v2/download/nryan/system/data.iplantcollaborative.org/nryan/picksumipsum.txt``

Publishing directories
----------------------

Publish directory on your default storage system for public access

.. code-block:: plaintext

   files-pems-update --recursive -u public -p READ nryan/public

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
          -H "Content-Type: application/json" \
          -X POST \
          --data '{"username","public", "permission":"READ", "recursive": true}' \
          https://api.tacc.utexas.edu/files/v2/pems/nryan/public
|


Publish directory on a named system for public access

.. code-block:: plaintext

   files-pems-update --recursive -u public -p READ -S data.iplantcollaborative.org nryan/public

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
         -H "Content-Type: application/json" \
         -X POST \
         --data '{"username","public", "permission":"READ", "recursive": true}' \
         https://api.tacc.utexas.edu/files/v2/pems/system/data.iplantcollaborative.org/nryan/public
|


The response will look something like the following:

.. code-block:: json

   {
     "username": "public",
     "permission": {
       "read": true,
       "write": false,
       "execute": false
     },
     "recursive": true,
     "_links": {
       "self": {
         "href": "https://api.tacc.utexas.edu/files/v2/pems/system/data.iplantcollaborative.org/nryan/public?username.eq=public"
       },
       "file": {
         "href": "https://api.tacc.utexas.edu/files/v2/pems/system/data.iplantcollaborative.org/nryan/public"
       },
       "profile": {
         "href": "https://api.tacc.utexas.edu/profiles/v2/public"
       }
     }
   }

Publishing an entire directory is identical to publishing a single file item. To make all the contents of the directory public as well, include a ``recursive`` field to your request with a value of ``true``. Once published, the directory and all its contents will be avaialble for download. The above example will make every file and folder in the "nryan/public" directory of "data.iplantcollaborative.org" available for download at the following URL:

 ``https://papi.tacc.utexas.edu/files/v2/download/nryan/system/data.iplantcollaborative.org/nryan/public``

Remember that whenever you publish a folder, anything you put in that folder becomes publicly available. As with any cloud storage service, think before blindly copying data into your cloud storage. If you want to restrict the duration or frequency which your public data is accessed, you should see the :raw-html-m2r:`<a href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/postits/introduction.html">PostIts Guide</a>` for other ways to securely share your data with others.

Publishing considerations
-------------------------

Publishing data through Tapis can be a great way to share and access data. There are situations in which it may not be an ideal choice. We list several of the pitfalls user run into when publishing their data.

Large file publishing
^^^^^^^^^^^^^^^^^^^^^

Before publishing your large datasets, take a step back and consider how you might leverage the Files or Transfers API to reliable serve up your data. HTTP is not the fastest way to serve up the data, and it may not be the best usage pattern for applications hoping to consume it. Thinking through your use case is well worth the time, even if publishing ends up being the best approach.

Static website hosting
^^^^^^^^^^^^^^^^^^^^^^

Website hosting is a fairly common use case for data publishing. The challenge is that your assets are still hosted remotely from our API servers and fetched on demand. This can create some heavy latency when serving up lots of assets. Depending on the nature of your backend storage solution, it may not easily handle access patterns common to the web. In those situations, you may see some files fail to load from time to time. If your site has many files, even a small failure rate can keep your site from reliably loading.

If you are going to use the file publishing service for web hosting, the following tips can help improve your overall experience.


#. Whenever possible, reference versions of your css, fonts, and javascript dependencies hosted on public CDN. CloudFlare, Google, and Amazon all host public mirrors of the most popular javascript libraries and frameworks. Linking to those can greatly speed up your load time.
#. Use a technology like ``Webpack`` to reduce the number of files needed to serve your application.
#. Lazy load your assets with ``oclazyload``\ , ``requirejs`` or including ``async`` attributes on your ``<script>`` elements.
#. Store your assets on a storage system with as little connection and protocol overhead as possible. That means avoiding tape archives, gridftp, overprovisioned shared resources, and systems only accessible through a proxied connection. While the service will still work in all of these situations, it is common for the overhead involved in establishing a connection and authenticating to take longer than the actual file transfer when the file is small. Simply avoiding slower storage protocols can greating speed up your application's load time.
