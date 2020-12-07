.. role:: raw-html-m2r(raw)
   :format: html


Jobs Permissions and Sharing
============================

As with the :raw-html-m2r:`<a title="System Registration" href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/systems/introduction.html">Systems</a>`\ , :raw-html-m2r:`<a title="Application Management" href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/apps/introduction.html">Apps</a>`\ , and :raw-html-m2r:`<a title="File Management" href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/files/introduction.html">Files</a>` services, your jobs have their own set of access controls. Using these, you can share your job and its data with other Tapis users. Job permissions are private by default. The permissions you give a job apply both to the job, its outputs, its metadata, and the permissions themselves. Thus, by sharing a job with another user, you share all aspects of that job.

Job permissions are managed through a set of URLs consistent with the permissions URL elsewhere in the API.

Granting
--------

Granting permissions is simply a matter of issuing a ``POST`` with the desired permission object to the job's ``pems`` collection.

.. code-block:: plaintext

   tapis jobs pems grant $JOB_UUID $USERNAME $PERMISSION

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        # General grant
        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST --data-binary '{"permission":"READ","username":"$USERNAME"}' \
            https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/pems

        # Custom url grant
        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST --data-binary '{"permission":"READ"}' \
            https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/pems/$USERNAME
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "username": "$USERNAME",
        "internalUsername": null,
        "permission": {
          "read": true,
          "write": false
        },
        "_links": {
          "self": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/pems/$USERNAME"
          },
          "parent": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID"
          },
          "profile": {
            "href": "https://api.tacc.utexas.edu/profiles/v2/$USERNAME"
          }
        }
        }
|


The available permission values are listed in Table 2.


.. raw:: html

   <table border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Permission</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>READ</td>
   <td>Gives the ability to view the job status, and output data.</td>
   </tr>
   <tr>
   <td>WRITE</td>
   <td>Gives the ability to perform actions, manage metadata, and set permissions.</td>
   </tr>
   <tr>
   <td>ALL</td>
   <td>Gives full READ and WRITE permissions to the user.</td>
   </tr>
   <tr>
   <td>READ_WRITE</td>
   <td>Synonymous to ALL. Gives full READ and WRITE permissions to the user</td>
   </tr>
   </tbody>
   </table>
|


.. raw:: html

   <p class="table-caption">Table 2. Supported job permission values.</p>


..

   :raw-html-m2r:`<i class="fa fa-info-circle"></i>` Job permissions are distinct from file permissions. In many instances, your job output will be accessible via the Files and Jobs services simultaneously. Granting a user permissions to a job output file through the Files services does not alter the accessibility of that file through the Jobs service. It is important, then, that you consider to whom you grant permissions, and the implications of that decision in all areas of your application.


Listing
-------

To find the permissions for a given job, make a GET on the job's ``pems`` collection. Here we see that both the job owner and the user we just granted permission to appear in the response.

.. code-block:: plaintext

   tapis jobs pems list -V $JOB_UUID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
          'https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/pems/'
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
        {
          "username": "$API_USERNAME",
          "internalUsername": null,
          "permission": {
            "read": true,
            "write": true
          },
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/jobs/v2/6608339759546166810-242ac114-0001-007/pems/$API_USERNAME"
            },
            "parent": {
              "href": "https://api.tacc.utexas.edu/jobs/v2/6608339759546166810-242ac114-0001-007"
            },
            "profile": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/$API_USERNAME"
            }
          }
        },
        {
          "username": "$USERNAME",
          "internalUsername": null,
          "permission": {
            "read": true,
            "write": false
          },
          "_links": {
            "self": {
              "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/pems/$USERNAME"
            },
            "parent": {
              "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID"
            },
            "profile": {
              "href": "https://api.tacc.utexas.edu/profiles/v2/$USERNAME"
            }
          }
        }
        ]
|


Updating
--------

Updating is exactly like granting permissions. Just POST to the same job's ``pems`` collection.

.. code-block:: plaintext

   tapis jobs pems grant $USERNAME $PERMISSION $JOB_UUID

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -X POST --data-binary {"permission":"READ_WRITE}" \
            https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/$USERNAME
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
        "username": "$USERNAME",
        "internalUsername": null,
        "permission": {
          "read": true,
          "write": true
        },
        "_links": {
          "self": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/pems/$USERNAME"
          },
          "parent": {
            "href": "https://api.tacc.utexas.edu/jobs/v2/$JOB_ID"
          },
          "profile": {
            "href": "https://api.tacc.utexas.edu/profiles/v2/$USERNAME"
          }
        }
        }
|


Deleting
--------

To delete a permission, you can issue a DELETE request on the user permission resource we've been using, or update with an empty permission value.

.. code-block:: plaintext

   tapis jobs pems revoke $JOB_UUID $USERNAME

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer  $ACCESS_TOKEN" \
            -X DELETE \
            https://api.tacc.utexas.edu/jobs/v2/$JOB_ID/$USERNAME
|
