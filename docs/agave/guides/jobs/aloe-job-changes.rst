Jobs Service Changes
====================

This page discusses what has changed in the Jobs service between Agave 2.2.23 and Aloe 3.0.  The Aloe source code is `here <https://bitbucket.org/tacc-cic/aloe/src/master/>`_.

.. contents:: Table of Contents

The Job Model
-------------

The *Job object* models jobs both in memory and in the database.  The fields in the Job object have changed in the redesigned Jobs Service when compared to the legacy system.  These differences are visible on APIs that return Job objects, such as job submission or job queries.  The following tables document changes to the Job object.  

**Renamed Job Fields**

+---------------------+-----------------------------+
| *Old Job Field Name*|*New Job Field Name*         |
+=====================+=============================+ 
| archiveOutput       | archive                     |
+---------------------+-----------------------------+
| batchQueue          | remoteQueue                 |
+---------------------+-----------------------------+
| endTime             | ended                       |
+---------------------+-----------------------------+
| errorMessage        | lastStatusMessage           |
+---------------------+-----------------------------+
| localJobId          | remoteJobId                 |
+---------------------+-----------------------------+
| maxRunTime          | maxHours                    |
+---------------------+-----------------------------+
| retries             | submitRetries               |
+---------------------+-----------------------------+
| softwareName        | appId                       |
+---------------------+-----------------------------+
| startTime           | remoteStarted               |
+---------------------+-----------------------------+
| submitTime          | remoteSubmitted             |
+---------------------+-----------------------------+
| system              | systemId                    |
+---------------------+-----------------------------+

**Removed Job Fields**

+---------------------+-----------------------------+
| *Removed Job Field* | *Reason*                    |
+=====================+=============================+ 
| charge              | never used                  |
+---------------------+-----------------------------+
| internal_username   | obsolete                    |
+---------------------+-----------------------------+
| status_checks       | replaced by                 |
|                     | remoteStatusChecks and      |
|                     | failedStatusChecks          |
+---------------------+-----------------------------+


**New Job Fields**

+---------------------+
| *New Job Field*     |
+=====================+
| accepted            |
+---------------------+
| appUuid             |
+---------------------+
| blockedCount        |
+---------------------+
| failedStatusChecks  |
+---------------------+
| lastStatusCheck     | 
+---------------------+
| remoteEnded         |
+---------------------+
| remoteOutcome       |
+---------------------+
| remoteStatusChecks  |
+---------------------+
| tenantQueue         | 
+---------------------+

**The Complete Job Object**

New fields are marked with an asterisk (*).

+---------------------+---------+-------------------------------------+
| *Job Field*         | *Type*  | *Description*                       |
+=====================+=========+=====================================+
| id                  | long    | Job sequence number                 |
+---------------------+---------+-------------------------------------+
| name                | string  | Human readable name for this job    |
+---------------------+---------+-------------------------------------+
| tenantId            | string  | Current user's tenant ID            |
+---------------------+---------+-------------------------------------+
| tenantQueue*        | string  | Tenant queue to which job was       |
|                     |         | assigned                            |
+---------------------+---------+-------------------------------------+
| status              | string  | Current state of job, see           |
|                     |         | `Job States`_ for details           |
+---------------------+---------+-------------------------------------+
| lastStatusMessage   | string  | Last message logged for this job    |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| accepted*           | time    | Time job was accepted               |
+---------------------+---------+-------------------------------------+
| created             | time    | Time job was recorded in database   |
+---------------------+---------+-------------------------------------+
| ended               | time    | Time job processing completed       |
+---------------------+---------+-------------------------------------+
| lastUpdated         | time    | Time job record was last updated    |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| uuid                | string  | Unique job ID                       |
+---------------------+---------+-------------------------------------+
| owner               | string  | User who submitted job              |
+---------------------+---------+-------------------------------------+
| roles               | string  | Roles assigned by authentication    |
|                     |         | server to owner                     |
+---------------------+---------+-------------------------------------+
| systemId            | string  | Execution system ID on which this   |
|                     |         | job runs (tenant-unique)            |
+---------------------+---------+-------------------------------------+
| appId               | string  | Fully qualified application name    |
|                     |         | that will be run by this job        |
+---------------------+---------+-------------------------------------+
| appUuid*            | string  | Unique application ID               |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| workPath            | string  | Temporary work directory            |
+---------------------+---------+-------------------------------------+
| archive             | boolean | Whether or not to archive output    |
+---------------------+---------+-------------------------------------+
| archivePath         | string  | Archive location on archive system  |
+---------------------+---------+-------------------------------------+
| archiveSystem       | string  | Storage system ID to which this job |
|                     |         | archives (tenant-unique)            |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| nodeCount           | integer | Number of nodes requested by job    |
+---------------------+---------+-------------------------------------+
| processorsPerNode   | integer | Number of processors per node       |
+---------------------+---------+-------------------------------------+
| memoryPerNode       | float   | GB of memory requested per node     |
+---------------------+---------+-------------------------------------+
| maxHours            | float   | Maximum runtime for job             |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| inputs              | string  | JSON encoded list of inputs         |
+---------------------+---------+-------------------------------------+
| parameters          | string  | JSON encoded list of parameters     |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| remoteJobId	      | string  | Job or process ID of the job on the |
|                     |         | remote (execution) system           |
+---------------------+---------+-------------------------------------+
| schedulerJobId      | string  | Optional ID given by the remote     |
|                     |         | scheduler                           |
+---------------------+---------+-------------------------------------+
| remoteQueue         | string  | Queue for job on remote system      |
+---------------------+---------+-------------------------------------+
| remoteSubmitted     | time    | Time job was placed on remote queue |
+---------------------+---------+-------------------------------------+
| remoteStarted       | time    | Time job started running on remote  |
|                     |         | system                              |
+---------------------+---------+-------------------------------------+
| remoteEnded*        | time    | Time job finished running on remote |
|                     |         | system                              |
+---------------------+---------+-------------------------------------+
| remoteOutcome*      | string  | Best approximation of remote job's  |
|                     |         | outcome:                            |
|                     |         |                                     |
|                     |         | FINISHED,                           |
|                     |         | FAILED,                             |
|                     |         | FAILED_SKIP_ARCHIVE                 |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| submitRetries       | integer | Number of attempts to submit job    |
|                     |         | to execution system                 |
+---------------------+---------+-------------------------------------+
| remoteStatusChecks* | integer | Number of successful times the      |
|                     |         | remote system was queried for job   |
|                     |         | status                              |
+---------------------+---------+-------------------------------------+
| failedStatusChecks* | integer | Number of failed times the remote   |
|                     |         | system was queried for job status   |
+---------------------+---------+-------------------------------------+
| lastStatusCheck*    | time    | Last time a status check was        |
|                     |         | attempted                           |
+---------------------+---------+-------------------------------------+
|                     |         |                                     |
+---------------------+---------+-------------------------------------+
| blockedCount*       | integer | Number of times a job has           |
|                     |         | transitioned to BLOCKED status      |
+---------------------+---------+-------------------------------------+
| visible             | boolean | User visibility of this job record  |
+---------------------+---------+-------------------------------------+
| updateToken         | string  | Token used when job running on      |
|                     |         | execution system calls back to      |
|                     |         | Jobs Service                        |
+---------------------+---------+-------------------------------------+


Job Submission
--------------

Content-Type 
^^^^^^^^^^^^

Job submission requests are HTTP POST requests that must specify a *Content-Type* header of *application/json*. 

Submission Request Parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following table lists all parameters that may be specified in a job submission request.  The parameters are transmitted as a JSON object in the HTTP POST payload.  The types are `JSON schema types <https://json-schema.org/>`_; the number following the *string* type indicates the maximum allowed string length.

Some parameter types may differ from similar object model types shown above. The former represent types provided by users on input, the latter types used by the Jobs service during job execution.

It should be noted that Aloe is tighter with parameter checking than Agave. Certain "loose" parameters that may have slipped through with Agave will likely cause errors with Aloe. For example, defining queues with some fields having a `-1` value, meaning there would be no limit, worked with Agave. Aloe does not allow negative values and will cause such queue to be dropped from the job submission. 

Parameters required for job submission are marked with an asterisk (*).

+----------------------+-----------+-------------------------------+
| *JSON Parameter*     |*JSON Type*| *Description*                 +
+======================+===========+===============================+ 
| appId*               | string(64)| The unique name of the        +
|                      |           | application being run by this +
|                      |           | job. This must be a valid     +
|                      |           | application that the user     +
|                      |           | has permission to run.        +
+----------------------+-----------+-------------------------------+
| archive              | boolean   | Whether the job output should +
|                      |           | be archived. When true, all   +
|                      |           | new file created during job   +
|                      |           | execution will be moved to the+
|                      |           | *archivePath*.                +
+----------------------+-----------+-------------------------------+
| archivePath          |string(255)| The path of the archive folder+
|                      |           | for this job on the           +
|                      |           | designated *archiveSystem*.   +
+----------------------+-----------+-------------------------------+
| archiveSystem        | string(64)| The unique id of the storage  +
|                      |           | system on which the job output+
|                      |           | will be archived.             +
+----------------------+-----------+-------------------------------+
| batchQueue           |string(255)| The queue on the execution    +
|                      |           | system to which the job will  +
|                      |           | be submitted.  Applies only   +
|                      |           | when the execution system has +
|                      |           | a batch scheduler.            +
+----------------------+-----------+-------------------------------+
| inputs               | object    | The application specific      +
|                      |           | input files needed by this    +
|                      |           | job. Inputs may be given as   +
|                      |           | relative paths to the         +
|                      |           | application's designated      +
|                      |           | storage system or as a URI.   +
+----------------------+-----------+-------------------------------+
| memoryPerNode        | string(32)| The memory requested for each +
|                      |           | node on which the job runs.   +
|                      |           | Values are expressed as       +
|                      |           | [num][units], where *num* can +
|                      |           | be a decimal number and       +
|                      |           | *units* can be KB, MB, GB, TB +
|                      |           | (default = GB). Examples      +
|                      |           | include 200MB, 1.5GB and 5.   +
+----------------------+-----------+-------------------------------+
| name*                | string(64)| The user selected name for    +
|                      |           | the job.                      +
+----------------------+-----------+-------------------------------+
| nodeCount            | integer   | The requested number of nodes +
|                      |           | this job will use.            +
+----------------------+-----------+-------------------------------+
| notifications        | array     | An array of notification      +
|                      |           | objects (see below).          +
+----------------------+-----------+-------------------------------+
| parameters           | object    | Application-specific          +
|                      |           | parameters with types defined +
|                      |           | in the application defintion. +
+----------------------+-----------+-------------------------------+
| processorsPerNode    | integer   | **DEPRECATED**                +
| (*deprecated*)       |           | Use *processorsOnEachNode*    +
|                      |           | instead. Supported for        +
|                      |           | backward compatibility to     +
|                      |           | mean *total number of         +
|                      |           | processors*.                  +
+----------------------+-----------+-------------------------------+
| processorOnEachNode  | integer   | The number of processors per  +
|                      |           | node that the job will use.   +
|                      |           | The total number of processors+
|                      |           | used by the job equals        +
|                      |           | (nodeCount *                  +
|                      |           | processorsOnEachNode). If the +
|                      |           | application is not of         +
|                      |           | executionType PARALLEL, this  +
|                      |           | value should be 1.            +
+----------------------+-----------+-------------------------------+
| maxRunTime           | string(20)| The requested compute time    +
|                      |           | needed for this job given in  +
|                      |           | HH:mm:ss format.              +
+----------------------+-----------+-------------------------------+

If present on a job submission request, the notification array contains objects with the following fields (asterisk (*) indicates required).

+----------------------+------------+-------------------------------+
| *JSON Parameter*     |*JSON Type* | *Description*                 +
+======================+============+===============================+ 
| event*               | string(32) | The job event for which       +
|                      |            | notifications should be sent. +
|                      |            | Specify * for all events.     +
+----------------------+------------+-------------------------------+
| persistent           | boolean    | Whether notifications for this+
|                      |            | event should remain active    +
|                      |            | after it triggers the first   +
|                      |            | time. Default is *false*.     +
+----------------------+------------+-------------------------------+
| url*                 |string(1024)| The URI to which notifications+
|                      |            | will be sent. This can be an  +
|                      |            | email address or URL. If a URL+
|                      |            | is givent, a POST will be     +
|                      |            | made to the address.          +
|                      |            |                               +
|                      |            | URL templating is supported.  +
|                      |            | Valid template values are:    +
|                      |            | ${JOB_STATUS}, ${JOB_URL},    +
|                      |            | ${JOB_ID}, ${JOB_SYSTEM},     +
|                      |            | ${JOB_NAME},                  +
|                      |            | ${JOB_START_TIME},            +
|                      |            | ${JOB_END_TIME},              +
|                      |            | ${JOB_SUBMIT_TIME},           +
|                      |            | ${JOB_ARCHIVE_PATH},          +
|                      |            | ${JOB_ARCHIVE_URL},           +
|                      |            | ${JOB_ERROR}.                 +
+----------------------+------------+-------------------------------+

Submission Request Gotchas
^^^^^^^^^^^^^^^^^^^^^^^^^^

The differences between the new job submission request and the legacy request are mostly due to stricter enforcement of parameter names and types.  Parameters marked as deprecated in Agave have been removed from Aloe.  Also, Aloe consistently enforces parameter types so that user intent is clear.  Here are some changes that cause job requests that passed validation in Agave to be flagged in Aloe: 

* executionSystem - was ignored, now disallowed
* archivePath - required when *archive* is true (can be empty string)
* memoryPerNode - a string with optional unit designation in suffix
* parameter - deprecated, use *parameters* instead
* parameters fields - must conform to types defined in application 

Submission Response
^^^^^^^^^^^^^^^^^^^

A success response from a job submission request means that the Jobs Service accepts responsibility for the request and won't lose it.  The request, however, has not yet been entered into the database, so it cannot be queried, cancelled or acted upon in any way.  When the job is entered into the database, its status changes from ACCEPTED to PENDING.

The payload of the submission result object is described in the table below.  The response fields, their types and their formats differ from those specified above for the Job model.  Though related, the two data structures serve distinct purposes.

The most notable difference between the model and response data structures is that **id** field in the model is a sequence number, *but in the response it's the UUID of the job*.  This difference maintains the legacy usage convention to ease migration to the new service.

All timestamps are strings in `ISO 8601 <https://en.wikipedia.org/wiki/ISO_8601>`_ date/time format. All numbers are integers unless otherwise noted.  Fields marked with an asterisk (*) indicate they are assigned valid values in the response; the other fields have not been processed yet and display their default or uninitialized values. 

+---------------------+-----------+-------------------------------------+
| *Response Field*    |*JSON Type*| *Description*                       |
+=====================+===========+=====================================+
| id*                 | string    | Unique job id (equals UUID in model)|
+---------------------+-----------+-------------------------------------+
| name*               | string    | Human readable name for this job    |
+---------------------+-----------+-------------------------------------+
| tenantId*           | string    | Current user's tenant ID            |
+---------------------+-----------+-------------------------------------+
| tenantQueue*        | string    | Tenant queue to which job was       |
|                     |           | assigned                            |
+---------------------+-----------+-------------------------------------+
| status*             | string    | Current state of job, see           |
|                     |           | `Job States`_ for details           |
+---------------------+-----------+-------------------------------------+
| lastStatusMessage*  | string    | Last message logged for this job    |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| accepted*           | string    | Time job was accepted               |
+---------------------+-----------+-------------------------------------+
| created             | string    | Time job was recorded in database   |
+---------------------+-----------+-------------------------------------+
| ended               | string    | Time job processing completed       |
+---------------------+-----------+-------------------------------------+
| lastUpdated*        | string    | Time job record was last updated    |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| owner*              | string    | User who submitted job              |
+---------------------+-----------+-------------------------------------+
| roles*              | string    | Roles assigned by authentication    |
|                     |           | server to owner (comma-separated)   |
+---------------------+-----------+-------------------------------------+
| systemId            | string    | Execution system ID on which this   |
|                     |           | job runs (tenant-unique)            |
+---------------------+-----------+-------------------------------------+
| appId*              | string    | Fully qualified application name    |
|                     |           | that will be run by this job        |
+---------------------+-----------+-------------------------------------+
| appUuid*            | string    | Unique application ID               |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| workPath            | string    | Temporary work directory            |
+---------------------+-----------+-------------------------------------+
| archive*            | boolean   | Whether or not to archive output    |
+---------------------+-----------+-------------------------------------+
| archivePath*        | string    | Archive location on archive system  |
+---------------------+-----------+-------------------------------------+
| archiveSystem*      | string    | Storage system ID to which this job |
|                     |           | archives (tenant-unique)            |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| nodeCount           | number    | Number of nodes requested by job    |
+---------------------+-----------+-------------------------------------+
| processorsPerNode   | number    | Number of processors per node       |
+---------------------+-----------+-------------------------------------+
| memoryPerNode       | number    | GB of memory per node (decimal)     |
+---------------------+-----------+-------------------------------------+
| maxHours            | number    | Maximum hours for job to run        |
|                     |           | (decimal)                           |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| inputs*             | object    | JSON encoded list of inputs         |
+---------------------+-----------+-------------------------------------+
| parameters*         | object    | JSON encoded list of parameters     |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| remoteJobId	      | string    | Job or process ID of the job on the |
|                     |           | remote (execution) system           |
+---------------------+-----------+-------------------------------------+
| schedulerJobId      | string    | Optional ID given by the remote     |
|                     |           | scheduler                           |
+---------------------+-----------+-------------------------------------+
| remoteQueue         | string    | Queue for job on remote system      |
+---------------------+-----------+-------------------------------------+
| remoteSubmitted     | string    | Time job was placed on remote queue |
+---------------------+-----------+-------------------------------------+
| remoteStarted       | string    | Time job started running on remote  |
|                     |           | system                              |
+---------------------+-----------+-------------------------------------+
| remoteEnded         | string    | Time job finished running on remote |
|                     |           | system                              |
+---------------------+-----------+-------------------------------------+
| remoteOutcome       | string    | Best approximation of remote job's  |
|                     |           | outcome:                            |
|                     |           |                                     |
|                     |           | FINISHED,                           |
|                     |           | FAILED,                             |
|                     |           | FAILED_SKIP_ARCHIVE                 |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| submitRetries       | number    | Number of attempts to submit job    |
|                     |           | to execution system                 |
+---------------------+-----------+-------------------------------------+
| remoteStatusChecks  | number    | Number of successful times the      |
|                     |           | remote system was queried for job   |
|                     |           | status                              |
+---------------------+-----------+-------------------------------------+
| failedStatusChecks  | number    | Number of failed times the remote   |
|                     |           | system was queried for job status   |
+---------------------+-----------+-------------------------------------+
| lastStatusCheck     | string    | Last time a status check was        |
|                     |           | attempted                           |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| blockedCount        | number    | Number of times a job has           |
|                     |           | transitioned to BLOCKED status      |
+---------------------+-----------+-------------------------------------+
| visible             | boolean   | User visibility of this job record  |
+---------------------+-----------+-------------------------------------+
|                     |           |                                     |
+---------------------+-----------+-------------------------------------+
| _links*             | object    | links to resources related to the   |
|                     |           | job, some of which may not exist yet|
+---------------------+-----------+-------------------------------------+




Job Lifecycle
^^^^^^^^^^^^^

The two tables below document changes to the job status definition.  The job status field represents the state of a job; *status* and *state* are used interchangeably in this section.  One of the goals of the redesigned Jobs Service is to preserve--as much as possible--the existing job statuses and their semantics to minimize migration effort.

+---------------------+-----------------------------+
| *New Job State*     | *Description*               |
+=====================+=============================+ 
| ACCEPTED            | When a new job is added     |
|                     | to the persistent tenant    |
|                     | queue but not yet           |
|                     | tracked in the database.    |
|                     | The job will advance to the | 
|                     | PENDING state when it is    |
|                     | read from the queue and     |
|                     | inserted into the database. |
+---------------------+-----------------------------+
| BLOCKED             | When a job is recovering    |
|                     | from a transient error.     |
+---------------------+-----------------------------+

+----------------------+---------------------------+
| *Deleted Job State*  | *Reason for Removal*      +
+======================+===========================+ 
| ARCHIVING_FINISHED   | Usage not well-defined    |
+----------------------+---------------------------+
| ARCHIVING_FAILED     | Usage not well-defined    |
+----------------------+---------------------------+
| KILLED               | Redundant, same as STOPPED|
+----------------------+---------------------------+
| HEARTBEAT            | Obsolete mechanism        |
+----------------------+---------------------------+


The new ACCEPTED status indicates that a new job request has been written to one of the tenant's persistent queues.  ACCEPTED means that the Job Service has accepted responsibility for the job, but the job is not yet externally visible.  External visibility happens only after the job is written to the database and its state changed to PENDING.  Normally, the time between queuing and database insertion is short, but the transition happens asynchronous to the HTTP submission request. 

Note that previously a successful job submission request meant that a new job was created with PENDING status in the database.  The job was immediately visible externally, which allowed it to be queried or acted upon.  Now, success only means that the Jobs Service has received the request and won't lose it.

The new BLOCKED status indicates that a job is currently delayed due to a transient error condition.  When job is BLOCKED, it is said to be *in recovery*.  Recovery is managed by the new recovery subsystem.  This subsystem uses a set of tunable policies and tester code that detect when error conditions have cleared so that job execution can resume.


Job States 
""""""""""

The following table provides a short description of each of the possible states that a job can be in.  Terminal states are marked with an asterisk (*).

+---------------------+-----------------------------+
| *Job State*         | *Description*               |
+=====================+=============================+ 
| ACCEPTED            | Job queued to durable but   |
|                     | not yet externally visible  |
+---------------------+-----------------------------+
| PENDING             | Added to database,          |
|                     | processing beginning        |
+---------------------+-----------------------------+
| PROCESSING_INPUTS   | Validation complete,        |
|                     | beginning input processing  |
+---------------------+-----------------------------+
| STAGING_INPUTS      | Transferring input files    |
+---------------------+-----------------------------+
| STAGED              | Input file transfer complete|
+---------------------+-----------------------------+
| STAGING_JOB         | Transferring application    |
|                     | files                       |
+---------------------+-----------------------------+
| SUBMITTING          | Issuing execution command   |
+---------------------+-----------------------------+
| QUEUED              | Job queued on execution     |
|                     | system                      |
+---------------------+-----------------------------+
| RUNNING             | Job running on execution    |
|                     | system                      |
+---------------------+-----------------------------+
| CLEANING_UP         | Execution complete,         |
|                     | removing temporary files    |
+---------------------+-----------------------------+
| ARCHIVING           | Moving output to archive    |
|                     | system                      |
+---------------------+-----------------------------+
| FINISHED*           | Job complete                |
+---------------------+-----------------------------+
| STOPPED*            | Job cancelled by user       |
+---------------------+-----------------------------+
| FAILED*             | Job failed                  |
+---------------------+-----------------------------+
| BLOCKED             | Job recovering from a       |
|                     | transient error condition   |
+---------------------+-----------------------------+
| PAUSED              | Job paused by user          |
|                     | (future implementation)     |
+---------------------+-----------------------------+

As an example, an archiving job with one or more inputs that experiences no failures or delays will progress through the following sequence of status changes:

#. ACCEPTED
#. PENDING
#. PROCESSING_INPUTS
#. STAGING_INPUTS
#. STAGED 
#. STAGING_JOB
#. SUBMITTING
#. QUEUED
#. RUNNING
#. CLEANING_UP
#. ARCHIVING
#. FINISHED


Job Actions
-----------

The following **POST** actions are supported in the new Jobs service.  Actions in parentheses are aliases for the action's primary name.

+-------------+---------------------------+-------------------------------+
|*Job Action* | *HTTP POST URL Suffix*    | *Description*                 +
+=============+===========================+===============================+ 
| cancel      | /jobs/v2/<jobuuid>/cancel | Cancel a job that is not in   +
|             |                           | the ACCEPTED or a terminal    +
| (kill, stop)|                           | state                         +
|             |                           |                               +
+-------------+---------------------------+-------------------------------+
| hide        | /jobs/v2/<jobuuid>/hide   | Mark a job as invisible to    +
|             |                           | most APIs, such as job listing+
|             |                           | or history calls              +
+-------------+---------------------------+-------------------------------+
| unhide      | /jobs/v2/<jobuuid>/unhide | Mark a job as visible (the    +
|             |                           | default visibility setting)   +
+-------------+---------------------------+-------------------------------+
| resubmit    |/jobs/v2/<jobuuid>/resubmit| Resubmit a job by the same    +
|             |                           | user with the same inputs,    +
|             |                           | parameters and notifications. +
|             |                           | The specified job             +
|             |                           | cannot be in the ACCEPTED or  +
|             |                           | PENDING state. The new job    +
|             |                           | will be assigned a new UUID.  +
+-------------+---------------------------+-------------------------------+

The following **DELETE** actions are supported in the new Jobs service:

+-------------+---------------------------+-------------------------------+
|*Job Action* | *HTTP DELETE URL Suffix*  | *Description*                 +
+=============+===========================+===============================+ 
| hide        | /jobs/v2/<jobuuid>/hide   | Mark a job as invisible to    +
|             |                           | most APIs, such as job listing+
|             |                           | or history calls (same as     +
|             |                           | POST)                         +
+-------------+---------------------------+-------------------------------+


Job Callbacks
-------------

The little-used *trigger* API has been deprecated.  In Agave, jobs running on execution systems could use this API to change their state on the Jobs server and trigger notifications. This API has been removed due to changes in job lifecycle management, concerns about security and plans for a standalone event service. 

The Aloe job lifecycle is defined by a state machine that only allows specific state transitions during job execution.  External events, such as cancel requests, can affect job state, but no external input can control the state of a job.  Trigger calls in Agave are unauthenticated, which increases the vulnerability of the Jobs service.  Utimately, we would like to move to an independent event service to provide flexible asynchronous communication to all applications.

Storage Protocol Types
----------------------

Aloe continues to support the following storage protocol types:

*FTP, SFTP, IRODS, IRODS4, HTTP, HTTPS*

Aloe does **not** support the following protocol types that had uncertain support in Agave: 

*GRIDFTP, AZURE, S3*



UUIDs
-----

The Agave universally unique identifier generator has been replaced with the `RFC 4122 <https://www.ietf.org/rfc/rfc4122.txt>`_ compliant implementation that ships with Java.  This change will not affect user code that treats UUIDs as opaque identifiers.

UUID Service
------------

The collection APIs of the UUID service have been deprecated and are no longer available. 

Tenant Configuration
--------------------

Two aspects of tenant configuration have changed in the new Jobs service: defining administrator accounts and defining multiple queues. 

Administrator Accounts
^^^^^^^^^^^^^^^^^^^^^^

The legacy Jobs service used a resource file with a hardcoded list of administrator IDs that spanned all tenants.  This facility has been replaced by one that uses a database table to define administrator accounts on a tenant-specific basis.  Part of the process of setting up a new tenant is for the database administrator to define zero or more tenant administrators in the *aloe_tenant_admins* table.

Note that the Jobs service continues to honor the roles (including administrative roles) injected into requests by the authentication server.  Thus, there continues to be two ways to define and configure administrative access in the Jobs service: using roles in the authentication server or designating administrator accounts in the Jobs service.

Tenant Queues
^^^^^^^^^^^^^

By default, each tenant is assigned a job submission queue that conforms to the following naming convention:

::

	aloe.jobq.<tenantId>.submit.DefaultQueue
::

The Jobs service allows tenants to balance and segregate workloads by sending job requests to different queues, each with its own set of worker processes (see `Tenant Workers <aloe-job-architecture.html#tenant-workers>`_ for discussion).  Administrators define new queues or update existing ones using the provided *ImportQueueDefinitions* utility program.  This program reads tenant queue configuration files and creates or updates queue definition records in the *aloe_queues* database table.  The configuration file content conforms to the JSON schema defined in the *JobQueueDefinitions.json* file that also ships with the Jobs service.

