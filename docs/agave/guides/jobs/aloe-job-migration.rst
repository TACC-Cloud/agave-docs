Migration Guide
===============

.. contents:: Table of Contents

Introduction
------------

Our goal is to ensure that client workflows continue to work with the new Jobs service.  Please refer to the `Jobs Service Architecture <aloe-job-architecture.html>`_ page for a discussion of the new design, and the `Jobs Service Changes <aloe-job-changes.html>`_ page for specifics about differences between the old and new systems.

During testing we will likely discover behavioral differences between the old and new systems.  Some of these differences may require users to change their processes or code, others may require changes to the Jobs service.  All decisions will be made in consultation with users, the goal being to minimize disruption as much as possible. 


Tenant Migration
----------------

To set up a tenant in the new Jobs service, we consider two aspects of configuration.  If administrator accounts were defined in the legacy Jobs service using a resource file, then they will have to be redefined in the new Jobs service as described in `Administrator Accounts <aloe-job-changes.html#administrator-accounts>`_.  Similarly, if multiple job backend processes were configured in the legacy Jobs service, then to have the same effect we would need to define new queues as described in `Tenant Queues <aloe-job-changes.html#tenant-queues>`_ and `Tenant Workers <aloe-job-architecture.html#tenant-workers>`_.

Job Migration
-------------

Jobs that ran under the legacy system should be able to run under the new Jobs service.  Clients can test if a job continues to run by issuing a REST call to the Jobs service with the proper parameters.

The most basic way to test job execution is by using *curl* or some other HTTP command utility. If a HTTP job submission request works under the old system, it either works under the new system or fails because it relies on a feature that has been deprecated (`Jobs Service Changes <aloe-job-changes.html>`_).  In either case we learn something.

In addition to running jobs, all the other REST calls supported under the legacy Jobs service (listings, history, etc.) should continue to work in the new system with, possibly, some documented differences in output (`The Job Model <aloe-job-changes.html#the-job-model>`_).  Jobs that ran under the previous Job service have been migrated to perserve historical information.  The details of these jobs can be viewed, but they cannot be resubmitted using the *resubmit* REST endpoint.  To rerun a legacy job, one must make a new job submission request.

A more advanced way to test job execution and the other Jobs APIs is to use the `Tapis Command Line Interface (CLI) <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/tooling/command-line-interface.html>`_.  The CLI implements a layer of software between the user and the actual HTTP requests made to the Jobs service.  This layer adds its own conventions and requirements, which can sometimes obscure the real source of problems.  For users that rely on the CLI, however, it's important to test all the CLI calls they normally use. 

Library Migration
-----------------

Some applications are built upon libraries such as the `Tapis CLI <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/tooling/command-line-interface.html>`_ or `agavepy <https://agavepy.readthedocs.io/en/latest/index.html>`_.  Since these libraries directly interface with the Jobs service, they may need to be modified to accommodate changes to the service.

Workflow Migration
------------------

The ultimate validation of the new Jobs service comes when clients can successfully run their complete workflows with the software they normally use.  This client software can include the `CLI <https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/tooling/command-line-interface.html>`_, portals, custom scripts, workflow engines, Jupyter Hub, private databases, `Abaco <https://tacc-cloud.readthedocs.io/projects/abaco/en/latest/>`_, etc.  Subtle differences between the old and new Jobs services can lead to problems in unexpected places in the workflow. For example, defining queues with some fields having a -1 value, meaning there would be no limit, worked with Tapis. Aloe does not allow negative values and will cause such queue to be dropped from the job submission. It's important that all commonly executed workflows be exercised and validated under the new system **before** production migration.
