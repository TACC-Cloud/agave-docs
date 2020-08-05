Aloe Postits Service
====================

This page discusses what will change in the Postits service between Tapis 2.4.x and Aloe 2.4.x.  The Aloe Postits source code is `here <https://bitbucket.org/tacc-cic/aloe/src/master/>`_.  

.. contents:: Table of Contents


The service will roll out in two phases. 

*Phase 1* will replace the legacy endpoints, and will be a seamless rollover for users. Phase one will not only improve the performance and security of the postits service, but will add a couple of new features to the service. 

*Phase 2* will add on two new endpoints. 

Phase 1 - Legacy Code Replacement
---------------------------------

Postit Listings
^^^^^^^^^^^^^^^
Once can list their active postits by sending in a GET request to {base url}/postits/v2.

.. container:: foldable

   .. code-block:: shell

      $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" "https://api.tacc.utexas.edu/postits/v2?pretty=true"
|
The new service also allows one to filter by status. The available statuses are described in the table below. 

.. container:: foldable

   .. code-block:: shell

      $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" "https://api.tacc.utexas.edu/postits/v2?pretty=true&status=ALL"
|

**Status Fields**

+---------------------+-----------------------------+
| *Status*            |*Description*                |
+=====================+=============================+ 
| ACTIVE              | Postit is redemeemable.     |
+---------------------+-----------------------------+
| EXPIRED_AND_NO_USES | Postit is both expired and  |
|                     | out of remaining uses.      |
+---------------------+-----------------------------+
| EXPIRED             | Postit has expired.         |
+---------------------+-----------------------------+
| NO_USES             | Postit is out of remaining  |
|                     | uses.                       |
+---------------------+-----------------------------+
| REVOKED             | The postit has been revoked.|
|                     | Can no longer redeem nor    |
|                     | update this postit.         |
+---------------------+-----------------------------+
| NOT_FOUND           | (Not a status) Indicates    |
|                     | status could not be         |
|                     | calculated.                 |
+---------------------+-----------------------------+
| ALL                 | (Not a status) Indicates to |
|                     | include all statuses.       |
+---------------------+-----------------------------+



Postit Revoke
^^^^^^^^^^^^^
The revoke endpoint has not changed in the new Postits Service. Send in a delete request to {base url}/postits/v2/{postit uuid}. You must be the postit creator or a tenant admin to revoke a postit.

.. container:: foldable

   .. code-block:: shell

      $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" "https://api.tacc.utexas.edu/postits/v2?pretty=true&status=ALL"
|
Once a postit is revoked, there is no way to redeem or update the postit. It is permanently disabled. 


Postit Creation 
^^^^^^^^^^^^^^^
There are minor changes to the postit creation, but existing requests to the service will remain valid. A few parameters have been deemed obsolete and were deprecated, and the ability to create an "unlimited" postit has been added. 

Passing in decremented parameters will not cause an error. The service will simply ignore them. 
Deprecated parameters: 

* noath - All postits will not require auth.
* internalUsername - Is not used in the current service. 
* method - Postits will only support a GET action to target URLs. 

Added parameters: 

* unlimited - Postits will be redeemable regardless of expiration and remaining uses. 

The default parameters for force, maxUses and lifetime remain the same as the current service. 
Default parameters:

* maxUses - 1
* lifetime - 30 days 
* unlimited - false
* force - false 

You can create a postit with either content type 'application/json' or 'application/x-www-form-urlencoded'. If maxUses or lifetime is not given, the default values will be applied regardless if the postit is unlimited. If postit is unlimited, these values will just act as placeholders but will not be used when redeeming.

Target URLs are a bit more restricted in the new service. In both the current Tapis service and new Aloe service, the target URL must contain the base URL for the correct tenant. In the new Aloe service, the url must also point to one of the following services: JOBS, FILES, APPS or SYSTEMS.

*JSON examples*

Creating a postit with maxUses and lifetime:

.. container:: foldable

   .. code-block:: shell

      $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "{'maxUses': 3, 'lifetime': 600", 'url': <target_url>} -H "Content-Type: application/json" https://api.tacc.utexas.edu/postits/v2?pretty=true"
|

Creating unlimited postit:

.. container:: foldable

   .. code-block:: shell

      $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "{'unlimited':true, 'url': <target_url>} -H "Content-Type: application/json" https://api.tacc.utexas.edu/postits/v2?pretty=true"
|

*X-WWW-FORM-URLENCODED examples*

Creating a postit with maxUses and lifetime:

.. container:: foldable

   .. code-block:: shell

      $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "maxUses=3&lifetime=600&url=<target_url>} https://api.tacc.utexas.edu/postits/v2?pretty=true"
|

Creating unlimited postit:

.. container:: foldable

   .. code-block:: shell

      $ curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -X POST -d "unlimited=true&url=<target_url>} https://api.tacc.utexas.edu/postits/v2?pretty=true"
|

**Available parameters to create a postit.**  

+----------------------+-----------+-------------------------------+
| *JSON Parameter*     |*JSON Type*| *Description*                 +
+======================+===========+===============================+ 
| maxUses              | integer   | The number of times a postit  +
|                      |           | can be redeemed. Must be      +
|                      |           | at least 1. Negative values   +
|                      |           | are not allowed.              +
+----------------------+-----------+-------------------------------+
| lifetime             | integer   | How long the postit will live,+
|                      |           | in seconds. This number is    +
|                      |           | used to generate the          +
|                      |           | expiration time and date by   +
|                      |           | adding the seconds to the     +
|                      |           | current date and time. The    +
|                      |.          | resulting expiration time must+
|                      |           | be before date 1/19/2038.     +
+----------------------+-----------+-------------------------------+
| force                | boolean   | Appends the force argument to +
|                      |           | the curl command.             +
+----------------------+-----------+-------------------------------+
| unlimited            | boolean   | True to create a postit that  +
|                      |           | does not have an expiration   +
|                      |           | date or max uses.             +
+----------------------+-----------+-------------------------------+
| url                  | string    | The url to be redeemed by the +
|                      |           | postit. *Always required.     +
+----------------------+-----------+-------------------------------+
| noauth               | boolean   | Legacy parameter that will be +
|                      |           | accepted, but ignored by the  +
|                      |           | new Aloe service.             +
+----------------------+-----------+-------------------------------+
| internalUsername     | string    | Legacy parameter that will be +
|                      |           | accepted, but ignored by the  +
|                      |           | new Aloe service.             +
+----------------------+-----------+-------------------------------+
| method               | string    | Legacy parameter that will be +
|                      |           | accepted, but ignored by the  +
|                      |           | new Aloe service.             +
+----------------------+-----------+-------------------------------+


Postit Response
^^^^^^^^^^^^^^^
There are minor changes to the json structure of the response object for postit responses.

Added:

* two new links - links for `list` and `update`, which are two new endpoints rolling out in phase 2. 
* status - current status of the postit
* numberUsed - the number of times this postit has been redeemed  

Removed:

* internalUsername field - obsolete
* authenticated field - obsolete

**Description of postit response fields**
All timestamps are strings in `ISO 8601 <https://en.wikipedia.org/wiki/ISO_8601>`_ date/time format. 

+---------------------+-----------+-------------------------------------+
| *Response Field*    |*JSON Type*| *Description*                       |
+=====================+===========+=====================================+
| url                 | string    | Target url to be redeemed.          |
+---------------------+-----------+-------------------------------------+
| postit              | string    | Postit UUID. Used to redeem postit. |
+---------------------+-----------+-------------------------------------+
| creator             | string    | Creator of postit.                  |
+---------------------+-----------+-------------------------------------+
| createdAt           | string    | Date and time postit was created.   |
+---------------------+-----------+-------------------------------------+
| numberUsed          | integer   | Number of times this postit has     |
|                     |           | been redeemed.                      |
+---------------------+-----------+-------------------------------------+
| tenantId            | string    | Tenant that this postit belongs to. |
+---------------------+-----------+-------------------------------------+
| status              | string    | Postit status relating to the       |
|                     |           | ability to redeem postit.           |
+---------------------+-----------+-------------------------------------+
| expiresAt           | string    | Date and time postit expires.       |
+---------------------+-----------+-------------------------------------+
| remainingUses       | string    | Number of remaining redemptions     |
|                     |           | allowed for postit.                 |
+---------------------+-----------+-------------------------------------+
| noath               | boolean   | Legacy field. Always false.         |
+---------------------+-----------+-------------------------------------+
| method              | string    | Legacy field. Always GET.           |
+---------------------+-----------+-------------------------------------+
| _links              | object    | links to resources related to the   |
|                     |           | postit, some of which may not exist |
|                     |           | yet.                                |
+---------------------+-----------+-------------------------------------+



Phase 2 - New Postit Endpoints
------------------------------
* COMING SOON * 


