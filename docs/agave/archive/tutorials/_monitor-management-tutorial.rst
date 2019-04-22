
Monitor Management Tutorial
===========================

The Tapis (Agave) Monitors API provides a familiar paradigm for monitoring the use ability and accessibility of storage and execution systems you registered with Agave. Similar to services like Pingdom, Pagerduty, and WebCron, the Monitors API allows you to to create regular health checks on a registered system. Unlike standard uptime services, Agave's will check that your system is responsive and accessible by performing proactive tests on availability (PING), accessibility (authentication), and functionality (listing or echo). Each check result is persisted and the check history of a given monitor is queryable through the API. As with all resources in the Agave Platform, a full event model is available so you can subscribe to event you care about such as failed checks, restored system availability, and system disablement. 

Creating Monitors
-----------------

.. code-block:: shell

   ```  

   ```plaintext  
   monitors-addupdate -S storage.example.com

.. code-block:: always

   {
       "_links": {
           "checks": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
           },
           "notifications": {
               "href": "https://public.agaveapi.co/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
           },
           "owner": {
               "href": "https://public.agaveapi.co/profiles/v2/nryan"
           },
           "self": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014"
           },
           "system": {
               "href": "https://public.agaveapi.co/systems/v2/storage.example.com"
           }
       },
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
       "updateSystemStatus": false
   }

The only piece of information needed to monitor a system is the system ID. Sending a POST request to the Monitors API with a monitor definition containing just the ``systemId`` field with a valid system ID or UUID will create a monitor that will run hourly health checks starting an hour from when you sent the request.  

..

   You cannot create monitors on systems for which you do not have at least GUEST permission.
   [table]


Frequency and start time
^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   ```  
   ```plaintext
   monitors-addupdate -S storage.example.com -I 15

.. code-block:: always

   {
       "_links": {
           "checks": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
           },
           "notifications": {
               "href": "https://public.agaveapi.co/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
           },
           "owner": {
               "href": "https://public.agaveapi.co/profiles/v2/nryan"
           },
           "self": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014"
           },
           "system": {
               "href": "https://public.agaveapi.co/systems/v2/storage.example.com"
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

If you need the monitor to run more frequently, you can customize the frequency and time at which a monitor runs by including the ``interval`` and ``startTime`` fields in your monitor definition. By providing a time expression in the ``interval`` field, you can control the frequency at which a monitor runs. The maximum interval you can set for a monitor is one month. The minimum interval varies from tenant to tenant, but is generally no less than 5 minutes. 

..

   The minimum interval at which a monitor can run varies from tenant to tenant, but is generally not less than 5 minutes.


The ``startTime`` field allows you to schedule when you would like Tapis (Agave) to start the monitor on your system. Any date or time expression representing a moment between the current time and one month from then is acceptable. If you do not specify a value for ``startTime``\ , Agave will add the value of ``interval`` to the current time and use that as the ``startTIme``. Setting stop times or "off hours" is not currently supported.

Automating system updates
^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: shell

   ```  
   ``` cli  
   monitors-addupdate -S storage.example.com -I 15 -U true

.. code-block:: always

   {
       "_links": {
           "checks": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
           },
           "notifications": {
               "href": "https://public.agaveapi.co/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
           },
           "owner": {
               "href": "https://public.agaveapi.co/profiles/v2/nryan"
           },
           "self": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014"
           },
           "system": {
               "href": "https://public.agaveapi.co/systems/v2/storage.example.com"
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
       "updateSystemStatus": true
   }

In the section on Events and notifications, we cover the ways in which you can get alerted about events pertaining to a monitor. Here we will simply point out that a convenience field, ``updateStatus``\ , is built into all monitors. Setting this field to ``true`` will authorize Tapis (Agave) to update the status of the monitored system based on the result of the monitor checks. This is a convenient way to ensure that the status value in your system description matches the actual operational status of the system.

..

   To automatically update your system status when a monitor changes status, set ``updateStatus`` to ``true`` in your monitor definition.


Managing Monitors
-----------------

.. code-block:: shell

   ```  
   ```plaintext
   monitors-addupdate -S storage.example.com -I 5 -U false 5024717285821443610-242ac11f-0001-014

.. code-block:: always

   {
       "_links": {
           "checks": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
           },
           "notifications": {
               "href": "https://public.agaveapi.co/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
           },
           "owner": {
               "href": "https://public.agaveapi.co/profiles/v2/nryan"
           },
           "self": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014"
           },
           "system": {
               "href": "https://public.agaveapi.co/systems/v2/storage.example.com"
           }
       },
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
       "updateSystemStatus": false
   }

Monitors can be managed by making traditional GET, POST, and DELETE operations. When updating a monitor, pay attention to the response because the time of the next check will change. In fact, any change to a monitor will recalculate the time when the next health check will run. 

Enabling and disabling
----------------------

.. code-block:: shell

   ```  
   ```plaintext

.. code-block:: always

   {
       "_links": {
           "checks": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014/checks"
           },
           "notifications": {
               "href": "https://public.agaveapi.co/notifications/v2/?associatedUuid=5024717285821443610-242ac11f-0001-014"
           },
           "owner": {
               "href": "https://public.agaveapi.co/profiles/v2/nryan"
           },
           "self": {
               "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014"
           },
           "system": {
               "href": "https://public.agaveapi.co/systems/v2/storage.example.com"
           }
       },
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
       "updateSystemStatus": false
   }

There may be times when you need to pause a monitor. If your system has scheduled maintenance periods, you may want to disable the monitor until the maintenance perio ends. You can do this by making a PUT request on a monitor with the a field name ``action`` set to either "enabled" or "disabled". While disabled, all health checks will be skipped. 

Monitor Checks
--------------

.. code-block:: shell

   ```  
   ```plaintext

.. code-block:: always

   ```  

   Each instance of a monitor testing a system is called a Check. Monitor Checks are persisted over time and query able as a collection of a monitor resource. Monitor checks can be queried by result, timeframe, and type. By default, the last check is injected into a monitor description as the `lastCheck` field. 

   Each monitor check has a unique ID and represents a formal, addressable resource in the API. Here we see a typical successful monitor check. Checks will have one of two states: PASSED or FAILED. Successful monitors have a status of PASSED and no message. Unsuccessful monitors have a status of FAILED and a message describing why they failed.


   ### Searching check history

   ```shell

.. code-block:: plaintext

   monitors-checks-list -v -l 1 -M  5024717285821443610-242ac11f-0001-014

.. code-block:: always

   [
       {
           "_links": {
               "monitor": {
                   "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014"
               },
               "self": {
                   "href": "https://public.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014/checks/4035070921477123610-242ac11f-0001-015"
               },
               "system": {
                   "href": "https://public.agaveapi.co/systems/v2/storage.example.com"
               }
           },
           "created": "2016-06-03T17:29:59.000-05:00",
           "id": "4035070921477123610-242ac11f-0001-015",
           "message": null,
           "result": "PASSED",
           "type": "STORAGE"
       }
   ]

Long-running monitor checks can build up a large history which can become prohibitive to page through. When generating graphs and looking for specific incidents, you can search for specific checks based on result, startTime, endTime, type, and I'd. The standard JSON SQL search syntax used across the rest of the Science APIs is supported for monitor checks as well.

Manually running a monitor check
--------------------------------

.. code-block:: shell

   ```  
   ```plaintext  
   monitors-fire -v 5024717285821443610-242ac11f-0001-014

.. code-block:: always

   {
       "_links": {
           "monitor": {
               "href": "https://dev.tenants.staging.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014"
           },
           "self": {
               "href": "https://dev.tenants.staging.agaveapi.co/monitor/v2/5024717285821443610-242ac11f-0001-014/checks/5314048891498786330-242ac11f-0001-015"
           },
           "system": {
               "href": "https://dev.tenants.staging.agaveapi.co/systems/v2/storage.example.com"
           }
       },
       "created": "2016-06-10T11:30:58.920-05:00",
       "id": "5314048891498786330-242ac11f-0001-015",
       "message": null,
       "result": "PASSED",
       "type": "STORAGE"
   }

If you need to verify the accessibility of your system, or behavior of your monitor, you can force an existing monitor to run on demand by sending a POST request to the monitor's checks collection. When doing this, you are still subject to the same minimum check interval configured for your tenant. 

..

   When manually forcing a monitor to run, you are still subject to the same minimum check interval configured for your tenant.


Pausing monitors
----------------

.. code-block:: shell

   ```  
   ```plaintext

.. code-block:: always



Monitors can be enabled or disabled by sending a PUT request to the monitor with the action field set to ``enabled`` or ``disabled``. While disabled, a monitor and its check history can still be searched and listed, however no new checks (unless explicitly forced by the user) will be made until the monitor is enabled.  monitor will prefent further checks from being made

Searching monitor history
-------------------------

.. code-block:: shell

   ```  
   ```plaintext

``always``  

The monitors service supports searching using the same JSON SQL syntax used across the rest of the Science APIs. The supported fields are given in the table.

[table]

Events and Notifications
------------------------

The following events will be thrown by the Monitors API.

.. list-table::
   :header-rows: 1

   * - API       
     -  Description
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


Q&A
---

*Why can you only monitor Systems? Why can't I monitor other resources in the API as well?*

..

   Tapis (Agave) is event driven. This means that every interaction you have with it results in an event being created. These events are what you subscribe to in the Notifications API. Because of this, if you want to know when a resource changed, you can subscribe to ``UPDATED`` events on that resource and get notified instantly when it changes. 
     
   The Systems API is a bit different in that the systems you register are actually physical resources running independently of Tapis (Agave). Until you make a request to the Science APIs that requires them to interact with your system, Agave won't know if the system is present, accessible, or functional, let alone *when* it stopped responding. The Monitors API allows you to establish regular interactions between Agave and your system in the form of health checks to which you can subscribe and be notified of changes instantly. 


*Why do I need system monitors, won't I get the same information just calling the Files API or running a job?*

..

   Good point. If you interact with a system frequently, then you will notice pretty quickly if it stops responding. If you are the only one using that system, then you probably don't have use for the Monitors API. However, if you share the system with others and/or you want to be proactive about letting them know when there is a problem, then setting a monitor is a good way to do that. 
   A second reason you might want to create a monitor on your system regardless of whether you're the only one who uses it or not is so you have a history of its availability. If you login and suddenly find your system isn't responding, it may be helpful to know how long it's been that way. If you have a monitor set, you can query the history to see the last successful health check and perhaps more quickly track down the problem.


*Why would I want to create a monitor that **doesn't** run as frequently as possible?*

..

   Several reasons.


   #. Monitors make remote calls to your system as part of the health check. You may not want to add that additional traffic to your system if you are getting the same information from other places.
   #. Perhaps you can't process the information at a finer granularity than X. If you have no mechanism for acting on the information other than human intervention, then it may not make sense to set hourly health checks when you're only checking the status once a day.
   #. You're a good citizen of a shared resource. If you are using a shared resource, the administrators probably already have monitors running on that system, so there is no reason to create another monitor on it. You can simply ask them to grant you read access to the monitor and its history.


Extra Text
----------

..

   Tapis (Agave) native way to monitor, track,and relay information about your systems, their accessibility, and functionality. For many users, systems are the primary resources through which they interact with the Platform. Since Agave does not operate the user-defined systems to which it facilitates access, applications built on top of Agave can experience unexplained service outages when the underlying resources are no longer available. The Monitoring API provides a proactive way to obtain such information without having to wire up external services. This means that you can build better user interfaces and service integrate that provide end users with the information needed to relay downtimes, file system failures, heavy activity, etc.

