
Jobs
----

The Jobs service is a basic execution service that allows you to run applications registered with the Apps service across multiple, distributed, heterogeneous systems through a common REST interface. The service manages all aspects of execution and job management from data staging, job submission, monitoring, output archiving, event logging, sharing, and notifications. The Jobs service also provides a persistent reference to your job's output data and a mechanism for sharing all aspects of your job with others. Each feature will be described in more detail in the following section.

Future Jobs Service (Aloe)
--------------------------

A new version of the Jobs service, currently in alpha testing and soon to be in beta testing, incorporates lessons learned after years of Agave production deployments across multiple sites.  The new version rearchitects Jobs for improved reliability, scalability, performance and serviceability.  The goal is to create a drop-in replacement for the original Jobs service that supports as much as possible the same REST API and its externally visible behavior. 

The following links discuss details of the new Jobs service:

`New Jobs Architecture </agave/guides/jobs/aloe-job-architecture.html>`_

`Changes </agave/guides/jobs/aloe-job-changes.html>`_

`Migration Guide </agave/guides/jobs/aloe-job-migration.html>`_