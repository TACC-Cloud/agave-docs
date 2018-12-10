
Monitors
========

The Agave Monitors API provides a familiar paradigm for monitoring the usability and 
accessibility of storage and execution systems you registered with Agave. 

Similar to services like Pingdom, Pagerduty, and WebCron, the Monitors API allows you to to 
create regular health checks on a registered system. Unlike standard uptime services, 
Agave will check that your system is responsive and accessible by performing 
proactive tests on availability (ping), accessibility (authentication), and 
functionality (listing or echo). Each check result is persisted and the check 
history of a given monitor is queryable through the API. 

As with all resources in the Agave Platform, a full event model is available so you can subscribe to 
event you care about such as failed checks, restored system availability, and system disablement. 

----

Creating Monitors
-----------------

Create a new default monitor with the following CLI command:

.. code-block:: plaintext

   monitors-addupdate -S storage.example.com

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application-json" \
            -X POST --data-binary '{"target": "storage.example.com"}' \
            https://api.tacc.utexas.edu/monitors/v2/
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
            "active": true,
            "created": "2016-06-03T17:22:59.000-05:00",
            "frequency": 60,
            "id": "5024717285821443610-242ac11f-0001-014",
            "internalUsername": null,
            "lastCheck": null,
            "lastSuccess": null,
            "lastUpdated": "2016-06-03T17:22:59.000-05:00",
            "nextUpdate": "2016-06-03T18:22:59.000-05:00",
            "owner": "nryan",
            "target": "storage.example.com",
            "updateSystemStatus": false,
            "_links": {
                "checks": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
                },
                "notifications": {
                    "href": "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
                },
                "owner": {
                    "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
                },
                "self": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                },
                "system": {
                    "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                }
            }
        }
| 


The only piece of information needed to monitor a system is the system ID. 
Sending a POST request to the Monitors API with a monitor definition containing just 
the ``systemId`` field with a valid system ID or UUID will create a monitor that will run 
hourly health checks starting an hour from when you sent the request.  

*You cannot create monitors on systems for which you do not have a role.*

----

Custom frequency and start time
-------------------------------

Create a monitor with a custom frequency with the following CLI command:

.. code-block:: plaintext

   monitors-addupdate -S storage.example.com -I 15

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application-json" \
            -X POST --data-binary '{"target": "storage.example.com","frequency":15}' \
            https://api.tacc.utexas.edu/monitors/v2/
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
            "_links": {
                "checks": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
                },
                "notifications": {
                    "href": "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
                },
                "owner": {
                    "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
                },
                "self": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                },
                "system": {
                    "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                }
            },
            "active": true,
            "created": "2016-06-03T17:22:59.000-05:00",
            "frequency": 15,
            "id": "5024717285821443610-242ac11f-0001-014",
            "internalUsername": null,
            "lastCheck": null,
            "lastSuccess": null,
            "lastUpdated": "2016-06-03T17:22:59.000-05:00",
            "nextUpdate": "2016-06-03T17:37:59.000-05:00",
            "owner": "nryan",
            "target": "storage.example.com",
            "updateSystemStatus": false
        }
| 


If you need the monitor to run more frequently, you can customize the frequency and time 
at which a monitor runs by including the ``interval`` and ``startTime`` fields in your monitor definition. 

By providing a time expression in the ``interval`` field, you can control the frequency at 
which a monitor runs. The maximum interval you can set for a monitor is one month. The 
minimum interval varies from tenant to tenant, but is generally no less than 5 minutes. 

The ``startTime`` field allows you to schedule when you would like Agave to start the 
monitor on your system. Any date or time expression representing a moment between the 
current time and one month from then is acceptable. If you do not specify a value for 
``startTime``\ , Agave will add the value of ``interval`` to the current time and use that as 
the ``startTIme``. 

*Setting stop times or "off hours" is not currently supported.*

----

Automating system status updates
--------------------------------

Create a monitor that updates system status on change with the following CLI command:

.. code-block:: plaintext

   monitors-addupdate -S storage.example.com -I 15 -U true

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application-json" \
            -X POST \
            --data-binary '{"target": "storage.example.com","frequency":15,"updateSystemStatus"=true}' \
            https://api.tacc.utexas.edu/monitors/v2/
| 

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
            "active": true,
            "created": "2016-06-03T17:22:59.000-05:00",
            "frequency": 15,
            "id": "5024717285821443610-242ac11f-0001-014",
            "internalUsername": null,
            "lastCheck": null,
            "lastSuccess": null,
            "lastUpdated": "2016-06-03T17:22:59.000-05:00",
            "nextUpdate": "2016-06-03T17:37:59.000-05:00",
            "owner": "nryan",
            "target": "storage.example.com",
            "updateSystemStatus": true,
            "_links": {
                "checks": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
                },
                "notifications": {
                    "href": "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
                },
                "owner": {
                    "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
                },
                "self": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                },
                "system": {
                    "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                }
            }
        }
| 


In the Events and Notifications sections, we cover the ways in which you can get alerted about events 
pertaining to a monitor. Here we will simply point out that a convenience field, ``updateStatus``\ , 
is built into all monitors. Setting this field to ``true`` will authorize Agave to update the status 
of the monitored system based on the result of the monitor checks. This is a convenient way to 
ensure that the status value in your system description matches the actual operational status of the system.

*To automatically update your system status when a monitor changes status, set 
``updateStatus`` to ``true`` in your monitor definition.*

----

Updating an existing monitor
----------------------------

Update an existing monitor with the following CLI command:

.. code-block:: plaintext

   monitors-addupdate -S storage.example.com -I 5 -U false 5024717285821443610-242ac11f-0001-014

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application-json" \
            -X POST \
            --data-binary '{"target": "storage.example.com","frequency":5,"updateSystemStatus"=false}' \
            https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014
| 

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
            "active": true,
            "created": "2016-06-03T17:22:59.000-05:00",
            "frequency": 15,
            "id": "5024717285821443610-242ac11f-0001-014",
            "internalUsername": null,
            "lastCheck": null,
            "lastSuccess": null,
            "lastUpdated": "2016-06-03T17:24:59.000-05:00",
            "nextUpdate": "2016-06-03T17:29:59.000-05:00",
            "owner": "nryan",
            "target": "storage.example.com",
            "updateSystemStatus": false,
            "_links": {
                "checks": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
                },
                "notifications": {
                    "href": "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
                },
                "owner": {
                    "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
                },
                "self": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                },
                "system": {
                    "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                }
            }
        }
| 


Monitors can be managed by making traditional GET, POST, and DELETE operations. 
When updating a monitor, pay attention to the response because the time of the 
next check will change. In fact, any change to a monitor will recalculate the time 
when the next health check will run. 

----

Disabling an existing monitor
-----------------------------

Disable an existing monitor with the following CLI command:

.. code-block:: plaintext

   monitors-disable 5024717285821443610-242ac11f-0001-014

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN"
            -H "Content-Type: application/json"
            -X PUT --data-binary '{"action": "disable"}'
            https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
            "active": false,
            "created": "2016-06-03T17:22:59.000-05:00",
            "frequency": 15,
            "id": "5024717285821443610-242ac11f-0001-014",
            "internalUsername": null,
            "lastCheck": null,
            "lastSuccess": null,
            "lastUpdated": "2016-06-03T17:24:59.000-05:00",
            "nextUpdate": "2016-06-03T17:29:59.000-05:00",
            "owner": "nryan",
            "target": "storage.example.com",
            "updateSystemStatus": false,
            "_links": {
                "checks": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
                },
                "notifications": {
                    "href": "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
                },
                "owner": {
                    "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
                },
                "self": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                },
                "system": {
                    "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                }
            }
        }
|


There may be times when you need to pause a monitor. If your system has scheduled 
maintenance periods, you may want to disable the monitor until the maintenance period 
ends. You can do this by making a PUT request on a monitor with the a field name ``action`` 
set to "disabled". While disabled, all health checks will be skipped. 

----

Enabling an existing monitor
----------------------------

Enable an existing monitor with the following CLI command:

.. code-block:: plaintext

   monitors-enable 5024717285821443610-242ac11f-0001-014

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN"
            -H "Content-Type: application/json"
            -X PUT --data-binary '{"action": "enable"}'
            https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
            "active": true,
            "created": "2016-06-03T17:22:59.000-05:00",
            "frequency": 15,
            "id": "5024717285821443610-242ac11f-0001-014",
            "internalUsername": null,
            "lastCheck": null,
            "lastSuccess": null,
            "lastUpdated": "2016-06-03T17:24:59.000-05:00",
            "nextUpdate": "2016-06-03T17:29:59.000-05:00",
            "owner": "nryan",
            "target": "storage.example.com",
            "updateSystemStatus": false,
            "_links": {
                "checks": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
                },
                "notifications": {
                    "href": "https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
                },
                "owner": {
                    "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
                },
                "self": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                },
                "system": {
                    "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                }
            }
        }
|


Similarly, to enable a monitor, make a PUT request with the a field name ``action`` set to 
"enabled". Once reenabled, the monitor will resume its previous check schedule as 
specified in the ``nextUpdate`` field, or immediately if that time has already expired.

----

Deleting a monitor
------------------

Deleting an existing monitor with the following CLI command:

.. code-block:: plaintext

   monitors-delete 5024717285821443610-242ac11f-0001-014

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN"
            -H "Content-Type: application/json"
            -X DELETE
            https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014
|

   An empty response will be returned


To delete a monitor, simply make a DELETE request on the monitor.

*Unlike systems, deleting a monitor will permanently delete the monitor and all its history, checks, etc.*

----

Monitor Checks
--------------

Listing past monitor checks with the following CLI command:

.. code-block:: plaintext

   monitors-checks-list -v -l 1 -M 5024717285821443610-242ac11f-0001-014

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN"
            'https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014/checks?limit=1'
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
            {
                "created": "2016-06-03T17:29:59.000-05:00",
                "id": "4035070921477123610-242ac11f-0001-015",
                "message": null,
                "result": "PASSED",
                "type": "STORAGE",
                "_links": {
                    "monitor": {
                        "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                    },
                    "self": {
                        "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks/4035070921477123610-242ac11f-0001-015"
                    },
                    "system": {
                        "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                    }
                }
            }
        ]
|


Each instance of a monitor testing a system is called a Check. Monitor Checks are 
persisted over time and query able as a collection of a monitor resource. Monitor checks 
can be queried by result, timeframe, and type. By default, the last check is injected into 
a monitor description as the ``lastCheck`` field. 

Each monitor check has a unique ID and represents a formal, addressable resource in the 
API. Here we see a typical successful monitor check. Checks will have one of two 
states: PASSED or FAILED. Successful monitors have a status of PASSED and no message. 
Unsuccessful monitors have a status of FAILED and a message describing why they failed.

----

Searching check history
-----------------------

Searching check history for a monitor with the following CLI command:

.. code-block:: plaintext

   monitors-checks-search -v -l 1 \
       -M 5024717285821443610-242ac11f-0001-014 \
       result.eq=PASSED

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN"   
            'https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014/checks?limit=1&result.eq=PASSED'
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
            {
                "created": "2016-06-03T17:29:59.000-05:00",
                "id": "4035070921477123610-242ac11f-0001-015",
                "message": null,
                "result": "PASSED",
                "type": "STORAGE",
                "_links": {
                    "monitor": {
                        "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                    },
                    "self": {
                        "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks/4035070921477123610-242ac11f-0001-015"
                    },
                    "system": {
                        "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                    }
                }
            }
        ]
|  


Long-running monitor checks can build up a large history which can become prohibitive 
to page through. When generating graphs and looking for specific incidents, you can 
search for specific checks based on ``result``\ , ``startTime``\ , ``endTime``\ , ``type``\ , and ``id``. 
The standard JSON SQL search syntax used across the rest of the Science APIs is supported 
for monitor checks as well.

----

Manually running a check
------------------------

Force a monitor check to run with the following CLI command:

.. code-block:: plaintext

   monitors-fire -v 5024717285821443610-242ac11f-0001-014

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application-json" \
            -X POST --data-binary '{}' \
            https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014/checks
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        {
            "created": "2016-06-10T11:30:58.920-05:00",
            "id": "5314048891498786330-242ac11f-0001-015",
            "message": null,
            "result": "PASSED",
            "type": "STORAGE",
            "_links": {
                "monitor": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                },
                "self": {
                    "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/checks/5314048891498786330-242ac11f-0001-015"
                },
                "system": {
                    "href": "https://api.tacc.utexas.edu/systems/v2/storage.example.com"
                }
            }
        }
|


If you need to verify the accessibility of your system, or behavior of your monitor, you 
can force an existing monitor to run on demand by sending a POST request to the monitor 
checks collection. When doing this, you are still subject to the same minimum check 
interval configured for your tenant. 

*When manually forcing a monitor to run, you are still subject to 
the same minimum check interval configured for your tenant.*

----

Permissions
-----------

At this time, monitors do not have permissions associated with them.

----

History
-------

List the change history of a monitor with the following CLI command:

.. code-block:: plaintext

   monitors-history -v 5024717285821443610-242ac11f-0001-014

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application-json" \
            -X POST --data-binary '{}' \
            https://api.tacc.utexas.edu/monitors/v2/5024717285821443610-242ac11f-0001-014/history
|

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show json response**

     .. code-block:: json

        [
            {
            "createdBy": "nryan",
            "created": "2016-06-12T19:10:22Z",
            "status": "CREATED",
            "description": "This monitor was created by nryan",
            "id": "5705275956568068582-242ac11f-0001-035",
            "_links": {
                "self": {
                "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014/history/5705275956568068582-242ac11f-0001-035"
                },
                "monitor_event": {
                "href": "https://api.tacc.utexas.edu/monitor/v2/5024717285821443610-242ac11f-0001-014"
                }
            }
            }
        ]

   {: .solution}


A full history of the lifecycle of a monitor is available via the monitor history 
collection. Here you can list events that have occurred during the life of the monitor.

----

Events
------

The following events will be thrown by the Monitors API.

.. list-table::
   :header-rows: 1

   * - API
     - Description
   * - CREATED
     - The monitor was created
   * - UPDATED
     - The monitor was updated
   * - DELETED
     - The monitor was deleted
   * - ENABLED
     - The monitor was enabled
   * - DISABLED
     - The monitor was disabled
   * - PERMISSION_GRANT
     - A new user permission was granted on this monitor
   * - PERMISSION_REVOKE
     - A user permission was revoked on this sytem
   * - FORCED_CHECK_REQUESTED
     - A status check was requested by the user outside of the existing monitor schedule.
   * - CHECK_PASSED
     - The status check passed
   * - CHECK_FAILED
     - The status check failed
   * - CHECK_UNKNOWN
     - The status check finished in an unknown state
   * - STATUS_CHANGE
     - The status condition of the monitored resource changed since the last check
   * - RESULT_CHANGE
     - The cumulative result of all checks performed on the monitored resource changed since the last suite of checks

