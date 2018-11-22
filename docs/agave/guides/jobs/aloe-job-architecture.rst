Jobs Service Architecture
=========================

.. contents:: Table of Contents

Design Guidelines
-----------------

The focus of the Jobs service redesign effort is to improve reliability, scalability, performance and serviceability.  To achieve these goals, the following design guidelines were put in place:

- Efficient database usage
    - Database polling is prohibited
    - Database transactions boundaries are clearly defined
    - Database reads and writes are optimized for each application task
    - Log and monitor database calls
- Queue management system
    - Asynchronous tasks managed by a broker
    - Quality of service guarantees including durability, redelivery on client failure, etc.
- Explicit Job state machine
    - Only valid state transitions allowed
- Separation of front and back ends
    - HTTP data types and processing limited to front end web application
    - Backend job processing performed by Java workers running in their own JVMs
    - Horzontal scaling achieved by adding more workers
- Recovery subsystem 
    - Manage transient errors
    - Aggregate and manage all jobs blocked on same error condition
    - Allow customizable recovery policies 
- Efficient thread management
    - Asynchronous message sending to jobs and workers 
    - Thottled thread restarting during recovery
- Actionable error messages and log records
    - Capture enough data for root cause analysis
- Crytographic validation of requests
    - JWT signatures checked
- Software engineering best practices 
    - Technology choices that simplify design, code, operations and deployment
    - Example: removal of Hibernate
    - Example: use of JAXRS reference implementation
    - Example: standardized treatment of configuration files, environment variables and command line parameters
    
3 Tier Architecture
-------------------

.. image:: Aloe3TierArchitecture.jpg

The Jobs service implements a 3-tiered application with the user interface layer defined by the REST API, the application layer comprised of Java web applications and daemons, and the persistence layer comprised of a MySQL database, a RabbitMQ queue management system and the existing Agave Notifications service.

REST API Layer
^^^^^^^^^^^^^^

The *Jobs REST Interface* provides the interface through which web portals and other applications can communicate with the Jobs service.  As much as possible, the API maintains the legacy Agave syntax and semantics, see `Job Service Changes <aloe-job-changes.html>`_ for details. 

Application Layer
^^^^^^^^^^^^^^^^^

The application layer implements job REST endpoints using two web applications.  The *Legacy Job Web Application* supports all HTTP GET requests and all requests concerned with permissions.  Since the new Jobs service focuses on improving job execution (see `Design Guidelines`_), we realized that REST APIs that do not directly interact with executing jobs did not have to be rewritten.  Development costs were significantly reduced by reusing existing code for read-only and permission related requests.   The Legacy web application is a stripped down version of the Agave Jobs front end ported to work with an updated MySQL schema; it does not interact with the queue management system.

The *Aloe Job Web Application* handles all POST, PUT and DELETE requests except those concerned with permissions.  The main function of this new web application is to accept requests for job execution and cancelation.  In addition, requests to resubmit jobs and to change the visibility of jobs are also supported.  This web application interacts with both the MySQL database and the RabbitMQ system.

Each tenant is configured with at least one *Job Worker* application, which is a standalone Java daemon running in its own JVM.  Each job worker reads job submission requests from a single queue and executes those requests.  Workers can process multiple job requests at a time.  For scalability, multiple workers can service the same queue and tenants can define multiple submission queues for even greater flexibility.

*Job Readers* are standalone Java daemons that run in their own JVM and perform a specialized task related to job execution.  These programs are called readers because they receive their input by reading a specific queue or topic.  The three readers currently implemented are the recovery reader, alternate reader and dead letter reader.  See `Workers and Readers`_ below for details.

Persistence Layer
^^^^^^^^^^^^^^^^^

 

Workers and Readers
-------------------

.. image:: AloeWorkers.jpg
