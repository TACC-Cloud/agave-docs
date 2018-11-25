Migration Guide
===============

.. contents:: Table of Contents

Introduction
------------

This guide outlines how to ensure that client workflows will continue to work with the new Jobs service.  Refer to the `Jobs Service Architecture <aloe-job-architecture.html>`_ page for a discusion of the new design and the `Jobs Service Changes <aloe-job-changes.html>`_ page for specifics about differences between the old and new systems.  

During testing we will likely discover behavioral differences between the old and new systems.  Some of these differences may require users to change their processes or code, others may require changes to the Jobs service.  All decisions will be made in consultation with users, the goal being to minimize disruption as much as possible. 


Tenant Migration
----------------

To set up a tenant in the new Jobs service, one must consider two aspects of configuration.  If administrator accounts where defined in the legacy Jobs service using a resource file, then the tenant's designated administrator accounts should be inserted into the database as described in `Administrator Accounts <aloe-job-changes.html#administrator-accounts>`_.  Similarly, if multiple job backend processes were configured in the legacy Jobs service, then the tenant may want continue segregating jobs along the same lines by defining distinct queues as described in `Tenant Queues <aloe-job-changes.html#tenant-queues>`_ and `Tenant Workers <aloe-job-architecture.html#tenant-workers>`_.

Job Migration
-------------

Jobs that ran under the legacy system should be able to run under the new Jobs service.  Clients can test if a job continues to run by issuing a REST call to the Jobs service with the proper parameters.  

The most basic way to test the Jobs service is using *curl* or some other HTTP command utility. Such testing allows us to determine if the input to the Jobs service is sufficient to run the job without any other runtime considerations:  If the HTTP request works under the old system, it should either work under the new system or rely on some feature that has been explicitly deprecated (`Jobs Service Changes <aloe-job-changes.html>`_).  In addition running jobs, all the other REST calls supported under the legacy Jobs service (listings, history, etc.) should continue to work in the new system with, possibly, some documented differences in output.

A less basic way to test job execution and the other Jobs APIs is the use the `Agave Command Line Interface (CLI) <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/tooling/command-line-interface.html>`_.  The CLI implements a layer of software between the user and the HTTP jobs request, a layer that adds its own conventions and requirements.  For users that rely on the CLI, it's important to test the calls normally used. 

Workflow Migration
------------------

The ultimate validation of the new Jobs service comes when clients can successfully run their complete Agave workflows with the software they normally use.  This client software can include the CLI, portals, custom scripts, workflow engines, Jupyter Hub, databases, `Abaco <https://tacc-cloud.readthedocs.io/projects/abaco/en/latest/>`_, etc.  This is where subtle differences between the old and new system can be the most problematic.  It is imperative that all commonly executed workflows be exercised under the new system *before* production migration.