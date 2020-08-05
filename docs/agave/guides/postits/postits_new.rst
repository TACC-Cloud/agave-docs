Aloe Postits Service
====================

This page discusses what will change in the Postits service between Tapis 2.4.x and Aloe 2.4.x.  The Aloe Postits source code is `here <https://bitbucket.org/tacc-cic/aloe/src/master/>`_.  A spreadsheet that documents all changes across all Aloe APIs is `here <https://docs.google.com/spreadsheets/d/1mlK2EXYAzGI6z7BVu8tfhXQHwnZJkwgWiNxVD4k5u_Q/edit#gid=0>`_.

.. contents:: Table of Contents


The service will roll out in two phases. 

*Phase 1* will replace the legacy endpoints, and will be a seamless rollover for users. Phase one will not only improve the performance and security of the postits service, but will add a couple of new features to the service. 

*Phase 2* will add on two new endpoints. 

Phase 1 - Legacy code replacement
---------------------------------

Postit Listings
^^^^^^^^^^^^^^^
Discuss filtering by status. 

**Status Fields**

+---------------------+-----------------------------+
| *Status*            |*Description*                |
+=====================+=============================+ 
| archiveOutput       |                             |
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


Postit Revoke
^^^^^^^^^^^^^
Still revoke normally. no changes after. curl example. 


Postit Creation 
^^^^^^^^^^^^^^^
Defaults. 

Deprecated: noauth, method, internalUsername 
Added: Can now create unlimited. 

Discuss creation fields below. 

+----------------------+-----------+-------------------------------+
| *JSON Parameter*     |*JSON Type*| *Description*                 +
+======================+===========+===============================+ 
| appId*               | string(80)| The unique ID (name + version)+ 
|                      |           | of the application run by     +
|                      |           | this job. This must be a valid+
|                      |           | application that the user     +
|                      |           | has permission to run.        +
+----------------------+-----------+-------------------------------+
| archive              | boolean   | Whether the job output should +
|                      |           | be archived. When true, all   +
|                      |           | new file created during job   +
|                      |           | execution will be moved to the+
|                      |           | *archivePath*.                +
+----------------------+-----------+-------------------------------+
| archiveOnAppError    | boolean   | Whether archiving should      +
|                      |           | occur even if the user's      +
|                      |           | application returns a non-zero+
|                      |           | return code.  Default=false.  +
|                      |           |                               +
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

Curl command examples of creating limited and unlimited. 

Postit Response
^^^^^^^^^^^^^^^
Response object pretty much the same. Added on two new links (to be used in future). Discuss any other changes. If unlimited, remainingUses will come back a string. 

All timestamps are strings in `ISO 8601 <https://en.wikipedia.org/wiki/ISO_8601>`_ date/time format. All numbers are integers unless otherwise noted.  Fields marked with an asterisk (*) indicate they are assigned valid values in the response; the other fields have not been processed yet and display their default or uninitialized values. 

Discuss fields here. 

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




