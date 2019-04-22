.. role:: raw-html-m2r(raw)
   :format: html


Notifications
=============

Under the covers, the Tapis (Agave) API is an event-driven distributed system implemented on top of a reliable, cloud-based messaging system. This means that every action either observed or taken by Agave is tied to an event. The changing of a job from one status to another is an event. The granting of permissions on a file is an event. Editing a piece of metadata is an event, and to be sure, the moment you created an account with Agave was an event. You get the idea.

Having such a fine-grain event system is helpful for the same reason that having a fine-grain permission model is helpful. It affords you the highest degree of flexibility and control possible to achieve the behavior you desire. With Tapis (Agave)'s event system, you have the ability to alert your users (or yourself) the instant something occurs. You can be proactive rather than reactive, and you can begin orchestrating your complex tasks in a loosely coupled, asynchronous way.

Subscriptions
-------------

As consumers of Tapis (Agave), you have the ability to subscribe to events occurring on any resource to which you have access. By that we mean, for example, you could subscribe to events on your job and a job that someone shared with you, but you could not subscribe to events on a job submitted by someone else who has not shared the job with you. Basically, if you can see a resource, you can subscribe to its events.

The Notifications service is the primary mechanism by which you create and manage your event subscriptions. A typical use case is a user subscribing for an email alert when her job completes. The following JSON object represents a request for such a notification.

..

   Example notification subscription request


.. code-block:: json

   {
   "associatedUuid": "0001409758089943-5056a550b8-0001-002",
   "event": "OVERWRITTEN",
   "persistent": true,
   "url": "nryan@rangers.mlb.com"
   }

The ``associatedUuid`` value is the UUID of her job. Here, we given the UUID of the ``picsumipsum.txt`` file we uploaded in the `Files Guide <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/files/introduction.html>`_. The ``event`` value is the name of the event to which she wants to be notified. This example is asking for an email to be sent whenever the file is overwritten. She could have just as easily specified a status of DELETED or RENAME to be notified when the file was deleted or renamed.

The ``persistent`` value specifies whether the notification should fire more than once. By default, all event subscriptions are transient. This is because the events themselves are transient. An event occurs, then it is over. There are, however, many situations where events could occur over and over again. Permission events, changes to metadata and data, application registrations on a system, job submissions to a system or queue, etc., all are transient events that can potentially occur many, many times. In these cases it is either not possible or highly undesirable to constantly resubscribe for the same event. The persistent attribute tells the notification service to keep a subscription alive until it is explicitly deleted.

..

   :information_source: In certain situations you may wish to subscribe to multiple events. You are free to add as many subscriptions as you wish, however in the event that you want to subscribe to all possible events for a given resource, use the wildcard value, ``*``\ , as the event. This tells the Notifications service that you wanted to be notified of every event for that resource.

   :information_source: A listing of all Tapis (Agave)'s resource-level events, grouped by resource, can be found in the `Events <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/events/introduction.html>`_ section.


Continuing to work through the example, the ``url`` value specifies where the notification should be sent. In this example, our example user specified that she would like to be notified via email. Tapis (Agave) supports both email and webhook notifications. If you are unfamiliar with webhooks, take a moment to glance at the :raw-html-m2r:`<a href="http://webhooks.org" target="_blank">webhooks.org</a>` page for a brief overview. If you are a :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/Design_Patterns_(book)" title="Gang of Four" target="_blank">Gang of Four</a>` disciple, webhooks are a mechanism for implementing the :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/Observer%5Fpattern" title="Observer Pattern" target="_blank">Observer Pattern</a>`. Webhooks are widely used across the web and chances are that something you're using right now is leveraging them.
