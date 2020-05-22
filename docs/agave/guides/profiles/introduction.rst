
User Profiles
=============

The Tapis hosted identity service (profiles service) is a RESTful web service that gives
organizations a way to create and manage the user accounts within their Tapis tenant.
The service is backed by a redundant LDAP instance hosted in multiple datacenters making
it highly available. Additionally, passwords are stored using the openldap md5crypt algorithm.

Tenant administrators can manage only a basic set of fields on each user account within
LDAP itself. For more complex profiles, we recommend combing the profiles service with
the metadata service. See the section on `Extending the Basic Profile with the Metadata
Service <#extending-with-metadata>`_ below.

The service uses OAuth2 for authentication, and user's must have special privileges to
create and update user accounts within the tenant. Please work with the Tapis development
team to make sure your admins have the user-account-manager role.

In addition to the web service, there is also a basic front-end web application providing
user sign up. The web application will suffice for basic user profiles and can be used
as a starting point for more advanced use cases.

This service should **NOT** be used for authenticating users. For details on using OAuth
for authentication, see the `Authorization Guide <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/authorization/introduction.html>`_\

----

Creating
--------

Create a user account with the following CLI command:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X POST \
            -d "username=testuser" \
            -d "password=abcd123" \
            -d "email=testuser@test.com" \
            https://api.tacc.utexas.edu/profiles/v2
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "message":"User created successfully.",
          "result":{
            "email":"testuser@test.com",
            "first_name":"",
            "full_name":"testuser",
            "last_name":"testuser",
            "mobile_phone":"",
            "phone":"",
            "status":"Active",
            "uid":null,
            "username":"testuser"
          },
          "status":"success",
          "version":"2.0.0-SNAPSHOT-rc3fad"
        }
|


Create a user account by sending a POST request to the profiles service, providing an
access token of a user with the user-account-manager role. The fields username, password
and email are required to create a new user.

*Creating and managing accounts requires a special **user-account-manager** role. As a best
practice, we recommend setting up a separate, dedicated, account to handle user management.
Please work with the Tapis developer team if this is of interest to your organization.*

The complete list of available fields and their descriptions is provided in the table below.

.. list-table::
   :header-rows: 1

   * - Field Name
     - Description
     - Required?
   * - username
     - The username for the user; must be unique across the tenant
     - Yes
   * - email
     - The email address for the user
     - Yes
   * - password
     - The password for the user
     - Yes
   * - first_name
     - First name of the user
     - No
   * - last_name
     - Last name of the user
     - No
   * - phone
     - User’s phone number
     - No
   * - mobile_phone
     - User’s mobile phone number
     - No


Note that the service does not do any password strength enforcement or other password
management policies. We leave it to each organization to implement the policies best
suited for their use case.

----

Extending with Metadata
-----------------------

Here is an example metadata object for extending a user profile:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json example**

     .. code-block:: json

        {
          "name":"user_profile",
          "value":{
            "firstName":"Test",
            "lastName":"User",
            "email":"testuser@test.com",
            "city":"Springfield",
            "state":"IL",
            "country":"USA",
            "phone":"636-555-3226",
            "gravatar":"http://www.gravatar.com/avatar/ed53e691ee322e24d8cc843fff68ebc6"
          }
        }
|


Save the extended profile document to the metadata service with the following CLI command:

.. code-block:: plaintext

   tapis metadata update -v -F profile_example.json

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X POST \
            -F "fileToUpload=@profile_ex" \
            https://api.tacc.utexas.edu/meta/v2/data/?pretty=true
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "status" : "success",
          "message" : null,
          "version" : "2.1.0-rc0c5a",
          "result" : {
            "uuid" : "0001429724043699-5056a550b8-0001-012",
            "owner" : "jstubbs",
            "schemaId" : null,
            "internalUsername" : null,
            "associationIds" : [ ],
            "lastUpdated" : "2015-04-22T12:34:03.698-05:00",
            "name" : "user_profile",
            "value" : {
              "firstName" : "Test",
              "lastName" : "User",
              "email" : "testuser@test.com",
              "city" : "Springfield",
              "state" : "IL",
              "country" : "USA",
              "phone" : "636-555-3226",
              "gravatar" : "http://www.gravatar.com/avatar/ed53e691ee322e24d8cc843fff68ebc6"
            },
            "created" : "2015-04-22T12:34:03.698-05:00",
            "_links" : {
              "self" : {
                "href" : "https://api.tacc.utexas.edu/meta/v2/data/0001429724043699-5056a550b8-0001-012"
              }
            }
          }
        }
|


We do not expect the fields above to provide full support for anything but the most basic
profiles. The recommended strategy is to use the profiles service in combination with the
metadata service (see `Metadata Guide <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/metadata/introduction.html>`_\ ) to store additional
information. The metadata service allows you to create custom types using JSON schema,
making it more flexible than standard LDAP from within a self-service model. Additionally,
the metadata service includes a rich query interface for retrieving users based on
arbitrary JSON queries.

The general approach used by existing tenants has been to create a single entry per user
where the entry contains all additional profile data for the user. Every metadata item
representing a user profile can be identified using a fixed string for the ``name``
attribute (e.g., **user_profile**\ ). The value of the metadata item contains a unique
identifier for the user (e.g. username or email address) along with all the additional
fields you wish to track on the profile. One benefit of this approach is that it cleanly
delineates multiple classes of profiles, for example **admin_profile**\ , **developer_profile**\ ,
**mathematician_profile**\ , etc. When consuming this information in a web interface, such
user-type grouping makes presentation significantly easier.

Another issue to consider when extending user profile information through the Metadata
service is ownership. If you create the user's account, then prompt them to login before
entering their extended data, it is possible to create the user's metadata record under
their account. This has the advantage of giving the user full ownership over the
information, however it also opens up the possibility that the user, or a third-party
application, could modify or delete the record.

A better approach is to use a service account to create all extended profile metadata
records and grant the user READ access on the record. This still allows third-party
applications to access the user's information at their request, but prevents any
malicious things from happening.

*For even quicker access, you can associate the metadata record with the
UUID of the user through the associationIds attribute.
See the `Metadata Guide <../metadata/introduction.md>`_
for more information about efficient storing and searching of metadata.*

----

Updating
--------

Update a user profile with the following CLI command:

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" \
            -X PUT
            -d "password=abcd123&email=testuser@test.com&first_name=Test&last_name=User" \
            https://api.tacc.utexas.edu/profiles/v2/testuser
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "message":"User updated successfully.",
          "result":{
            "create_time":"20150421153504Z",
            "email":"testuser@test.com",
            "first_name":"Test",
            "full_name":"Test User",
            "last_name":"User",
            "mobile_phone":"",
            "phone":"",
            "status":"Active",
            "uid":0,
            "username":"testuser"
          },
          "status":"success",
          "version":"2.0.0-SNAPSHOT-rc3fad"
        }
|


Updates to existing users can be made by sending a PUT request to
https://api.tacc.utexas.edu/profiles/v2/ and passing the fields to update.
For example, we can add a ``gravatar`` attribute to the account we created above.

----

Deleting
--------

Delete a user profile with the following CLI command:


.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN"
          -X DELETE https://api.tacc.utexas.edu/profiles/v2/testuser
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
          "message": "User deleted successfully.",
          "result": {},
          "status": "success",
          "version": "2.0.0-SNAPSHOT-rc3fad"
        }
|


To delete an existing user, make a DELETE request on their profile resource.

*Deleting a user is a destructive action and cannot be undone.
Consider the implications of user deletion and the impact on their existing
metadata before doing so.*

----

Registration Web Application
----------------------------

The account creation web app provides a simple form to enable user self-sign.


.. image:: ../../../_static/images/self-signup-screenshot.png
  :target: ../../../_static/images/self-signup-screenshot.png
  :alt: Tapis web app sign in
|


The web application also provides an email loop for verification of new accounts.
The code is open source and freely available from bitbucket:
`Account Creation Web Application <https://bitbucket.org/jstubbs/agave_id>`_

Most likely you will want to customize the branding and other aspects of the application,
but for simple use cases, the Tapis team can deploy a stock instance of the application
in your tenant. Work with the Tapis developer team if this is of interest to your organization.
