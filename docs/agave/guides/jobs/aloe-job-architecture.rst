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

Workers
-------

.. image:: AloeWorkers.jpg