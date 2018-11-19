Jobs Service Changes
====================

This page discusses what has changed in the Jobs service between Agave 2.2.23 and Aloe 3.0.

Job Content
-----------

The Job object used in redesigned Job Service differs from the legacy Job object.  Clients that query or process Job objects will notice that new fields have been added and some unneeded fields removed.  

+---------------------+-----------------------------+
| *Old Job Field Name*|*New Job Field Name*         |
+=====================+=============================+ 
| archiveOutput       | archive                     |
+---------------------+-----------------------------+
| archive_system      | archive_system_id           |
+---------------------+-----------------------------+
| software_name       | app_id                      |
+---------------------+-----------------------------+
| end_time            | ended                       |
+---------------------+-----------------------------+
| error_message       | last_message                |
+---------------------+-----------------------------+
| local_job_id        | remote_job_id               |
+---------------------+-----------------------------+
| memory_request      | memory_gb                   |
+---------------------+-----------------------------+
| queue_request       | remote_queue                |
+---------------------+-----------------------------+
| requested_time      | max_hours                   |
+---------------------+-----------------------------+
| retries             | remote_submit_retries       |
+---------------------+-----------------------------+
| scheduler_job_id    | remote_sched_id             |
+---------------------+-----------------------------+
| start_time          | remote_started              |
+---------------------+-----------------------------+
| submit_time         | remote_submit_time          |
+---------------------+-----------------------------+


+---------------------+-----------------------------+
| *New Job Field*     | *Description*               |
+=====================+=============================+ 
| accepted            |                             |
+---------------------+-----------------------------+
| app_uuid            |                             |
+---------------------+-----------------------------+
| blocked_count       |                             |
+---------------------+-----------------------------+
| failed_status_checks|                             |
+---------------------+-----------------------------+
| last_status_check   |                             |
+---------------------+-----------------------------+
| remote_ended        |                             |
+---------------------+-----------------------------+
| remote_outcome      |                             |
+---------------------+-----------------------------+
| remote_status_checks|                             |
+---------------------+-----------------------------+
|remote_submit_retries|                             |
+---------------------+-----------------------------+


+---------------------+-----------------------------+
| *Removed Job Field* | *Reason*                    |
+=====================+=============================+ 
| charge              |                             |
+---------------------+-----------------------------+
| internal_username   |                             |
+---------------------+-----------------------------+
| status_checks       |                             |
+---------------------+-----------------------------+



Job Submission
--------------

Content-Type 
^^^^^^^^^^^^

Job submission requests are HTTP POST requests that must specify a *Content-Type* header of *application/json*. 

Submission Parameters
^^^^^^^^^^^^^^^^^^^^^

The following table lists all parameters that may be specified in a job submission request.  The parameters are transmitted as a JSON object in the HTTP POST payload.  The types are `JSON schema types <https://json-schema.org/>`_; the number following *string* indicates the maximum allowed string length.

Parameters required for job submission are marked with an askerisk (*).

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

If present on a job submission request, the notification array contains objects with the following fields (an askerisk (*) indicates required).

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


Job Lifecycle
^^^^^^^^^^^^^

The two tables below document changes to the job status definition.  The job status field represents the state of a job; *status* and *state* are used interchangeably in this section.  One of the goals of the redesigned Jobs Service is to preserve--as much as possible--the existing job statuses and their semantics to minimize migration effort.

+---------------------+-----------------------------+
| *New Job State*     | *Description*               |
+=====================+=============================+ 
| ACCEPTED            | When a new job is added     |
|                     | to the persistant job       |
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
| ARCHIVING_FINISHED   | Not well-defined          |
+----------------------+---------------------------+
| ARCHIVING_FAILED     | Not well-defined          |
+----------------------+---------------------------+
| KILLED               | Redundant, same as STOPPED|
+----------------------+---------------------------+
| HEARTBEAT            | Mechanism removed         |
+----------------------+---------------------------+


The first important change is in the *meaning* of a successful job submission request.  Previously, a successful request meant that a new job was created with PENDING status in the database.  The job was externally visible, which allowed it to be queried or acted upon.  Now, success means that a new job is created with the ACCEPTED status and written to a persistant queue.  The Job Service has accepted responsibility for the job, but the job is not yet externally visible.  External visibility happens only after the job is written to the database and its state changed to PENDING.  Normally, the time between queuing and database insertion is short, but the transition happens asynchronously to the submission request.

Another important change is the introduction of the BLOCKED status to indicate that the job is delayed until a transient error condition clears.  When job is BLOCKED, it is said to be in *recovery*.  Recovery is managed by a new recovery subsystem using a set of tunable policies.      


Job States 
""""""""""

The following table provides a short description of each of the possible states that a job can be in.

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
| FINISHED            | Job complete                |
+---------------------+-----------------------------+
| STOPPED             | Job cancelled by user       |
+---------------------+-----------------------------+
| FAILED              | Job failed                  |
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


