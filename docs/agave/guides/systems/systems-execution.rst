.. role:: raw-html-m2r(raw)
   :format: html


Execution Systems
=================

In contrast to storage systems, execution systems specify compute resources where application binaries can be run. In addition to the ``storage`` attribute found in storage systems, execution systems also have a ``login`` attribute describing how to connect to the remote system to submit jobs as well as several other attributes that allow Agave to determine how to stage data and run software on the system. The full list of execution system attributes is given in the following tables.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Name</th>
               <th>Type</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>available</td>
               <td>boolean</td>
               <td>Whether the system is currently available for use in the API. Unavailable systems will not be visible to anyone but the owner. This differs from the <code>status</code> attribute in that a system may be UP, but not available for use in Agave. Defaults to true</td>
           </tr>
           <tr>
               <td>description</td>
               <td>string</td>
               <td>Verbose description of this system.</td>
           </tr>
           <tr>
               <td>environment</td>
               <td>String</td>
               <td>List of key-value pairs that will be added to the environment prior to execution of any command.</td>
           </tr>
           <tr>
               <td>executionType</td>
               <td>HPC, Condor, CLI</td>
               <td><b>Required:</b> Specifies how jobs should go into the system. HPC and Condor will leverage a batch scheduler. CLI will fork processes. </td>
           </tr>
           <tr>
               <td>id</td>
               <td>string</td>
               <td><b>Required:</b> A unique identifier you assign to the system. A system id must be globally unique across a tenant and cannot be reused once deleted. </td>
           </tr>
           <tr>
               <td>maxSystemJobs</td>
               <td>integer</td>
               <td>Maximum number of jobs that can be queued or running on a system across all queues at a given time. Defaults to unlimited.</td>
           </tr>
           <tr>
               <td>maxSystemJobsPerUser</td>
               <td>integer</td>
               <td>Maximum number of jobs that can be queued or running on a system for an individual user across all queues at a given time. Defaults to unlimited.</td>
           </tr>
           <tr>
               <td>name</td>
               <td>string</td>
               <td><b>Required:</b> Common display name for this system.</td>
           </tr>
           <tr>
               <td>queues</td>
               <td>JSON Array</td>
               <td>An array of batch queue definitions providing descriptive and quota information about the queues you want to expose on your system. If not specified, no other system queues will be available to jobs submitted using this system.</td>
           </tr>
           <tr>
               <td>scheduler</td>
               <td>LSF, LOADLEVELER, PBS, SGE, CONDOR, FORK, COBALT, TORQUE, MOAB, SLURM,
               CUSTOM_LSF, CUSTOM_LOADLEVELER, CUSTOM_PBS, CUSTOM_SGE, CUSTOM_CONDOR,
               FORK, CUSTOM_COBALT, CUSTOM_TORQUE, CUSTOM_MOAB, CUSTOM_SLURM, UNKNOWN</td>
               <td><b>Required:</b> The type of batch scheduler available on the system. This only applies to systems with executionType HPC and CONDOR. The *_CUSTOM version of each scheduler provides a mechanism for you to override the default scheduler directives added by Agave and explicitly add your own through the <span style="code">customDirectives</span> field in each of the batchQueue definitions for your system.</td>
           </tr>
           <tr>
               <td>scratchDir</td>
               <td>string</td>
               <td>Path to use for a job scratch directory. This value is the first choice for creating a job`s working directory at runtime. The path will be resolved relative to the <code>rootDir</code> value in the storage config if it begins with a "/", and relative to the system <code>homeDir</code> otherwise.</td>
           </tr>
           <tr>
               <td>site</td>
               <td>string</td>
               <td>The site associated with this system. Primarily for logical grouping.</td>
           </tr>
           <tr>
               <td>startupScript</td>
               <td>String</td>
               <td>Path to a script that will be run prior to execution of any command on this system. The path will be a standard path on the remote system. A limited set of system macros are supported in this field. They are <span style="code">rootDir</span>, <span style="code">homeDir</span>, <span style="code">systemId</span>, <span style="code">workDir</span>, and <span style="code">homeDir</span>. The standard set of runtime job attributes are also supported. Between the two set of macros, you should be able to construct distinct paths per job, user, and app. Any environment variables defined in the system description will be added after this script is sourced. If this script fails, output will be logged to the <span style="code">.agave.log</span> file in your job directory. Job submission will still continue regardless of the exit code of the script.</td>
           </tr>
           <tr>
               <td>status</td>
               <td>UP, DOWN, MAINTENANCE, UNKNOWN</td>
               <td>The functional status of the system. Systems must be in UP status to be used.</td>
           </tr>
           <tr>
               <td>storage</td>
               <td>JSON Object</td>
               <td><b>Required:</b> Storage configuration describing the storage config defining how to connect to this system for data staging.</td>
           </tr>
           <tr>
               <td>type</td>
               <td>STORAGE, EXECUTION</td>
               <td><b>Required:</b> Must be EXECUTION.</td>
           </tr>
           <tr>
               <td>workDir</td>
               <td>string</td>
               <td>Path to use for a job working directory. This value will be used if no <code>scratchDir</code> is given. The path will be resolved relative to the <code>rootDir</code> value in the storage config if it begins with a "/", and relative to the system <code>homeDir</code> otherwise.</td>
           </tr>
       </tbody>
   </table>
|

Startup startupScript
---------------------

Every time Agave establishes a connection to an execution system, local or remote, it will attempt to source the ``startupScript`` provided in your system definition. The value of ``startupScript`` may be an absolute path on the system (ie. "/usr/local/bin/common_aliases.sh", "/home/nryan/.bashrc", etc.) or a path relative to physical home directory of the account used to authenticate to the system (".bashrc", ".profile", "agave/scripts/startup.sh", etc).

The ``startupScript`` field supports the use of template variables which Agave will resolve at runtime before establishing a connection. If you would prefer to specify the startup script as a virtualized path on the system, prepend ``${SYSTEM_ROOT_DIR}`` to the path. If the system will be made public, you can specify a file relative to the home directory of the calling user by prefixing your ``startupScript`` value with ``${SYSTEM_ROOT_DIR}/${SYSTEM_HOME_DIR}/${USERNAME}`` A full list of the variables available is given in the following table.


.. raw:: html

   <table border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>SYSTEM_ID</td>
   <td>ID of the system (ex. ssh.execute.example.com)</td>
   </tr>
   <tr>
   <td>SYSTEM_UUID</td>
   <td>fThe UUID of the system</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_PROTOCOL</td>
   <td>The protocol used to move data to and from this system</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_HOST</td>
   <td>The storage host for this sytem</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_PORT</td>
   <td>The storage port for this system</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_RESOURCE</td>
   <td>The system resource for iRODS systems</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_ZONE</td>
   <td>The system zone for iRODS systems</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_ROOTDIR</td>
   <td>The virtual root directory exposed on this system</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_HOMEDIR</td>
   <td>The home directory on this system relative to the STORAGE_ROOT_DIR</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_AUTH_TYPE</td>
   <td>The storage authentication method for this system</td>
   </tr>
   <tr>
   <td>SYSTEM_STORAGE_CONTAINER</td>
   <td>The the object store bucket in which the <span class="code">rootDir</span> resides.</td>
   </tr>
   <tr>
   <td>SYSTEM_LOGIN_PROTOCOL</td>
   <td>The protocol used to establish a session with this system (eg SSH, GSISSH, etc)</td>
   </tr>
   <tr>
   <td>SYSTEM_LOGIN_HOST</td>
   <td>The login host for this system</td>
   </tr>
   <tr>
   <td>SYSTEM_LOGIN_PORT</td>
   <td>The login port for this system</td>
   </tr>
   <tr>
   <td>SYSTEM_LOGIN_AUTH_TYPE</td>
   <td>The login authentication method for this system</td>
   </tr>
   <tr>
   <td>SYSTEM_OWNER</td>
   <td>The username of the user who created the system.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_NAME</td>
   <td>The slugified version of the name of the job. See the section on <a href="#slugs">Conventions</a> for more information about slugs.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ID</td>
   <td>The unique identifier of the job.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_APP_ID</td>
   <td>The <span class="code">appId</span> for which the job was requested.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_BATCH_QUEUE</td>
   <td>The batch queue on the <span class="code">AGAVE_JOB_EXECUTION_SYSTEM</span> to which the job was submitted.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_EXECUTION_SYSTEM</td>
   <td>The Agave execution system id where this job is running.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_ARCHIVE_PATH</td>
   <td>The path on the <span class="code">archiveSystem</span> where the job output will be copied if archiving is enabled.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_OWNER</td>
   <td>The username of the job owner.</td>
   </tr>
   <tr>
   <td>AGAVE_JOB_TENANT</td>
   <td>The id of the tenant to which the job was submitted.</td>
   </tr>
   <tr>
   <td>MONITOR_ID</td>
   <td>The ID of the monitor.</td>
   </tr>
   <tr>
   <td>MONITOR_CHECK_ID</td>
   <td>The ID of the monitor check making the request.</td>
   </tr>
   <tr>
   <td>MONITOR_OWNER</td>
   <td>The username of the user who created the monitor.</td>
   </tr>
   </tbody>
   </table>
|

The ``startupScript`` is :raw-html-m2r:`<strong>NOT</strong>` a virtual path relative to the relative to the system ``rootDir`` and ``homeDir``. It is an acutal path on the remote system. The reason being that this value can only be set by the system owner, so it is unlikely to be a security issue, and the login account home directory may not be visible from the virtualized file system exposed by the system definition. This gives the owner a way to properly configure their user environment while protecting assets they would otherwise choose not to expose.

Schedulers and system execution types
-------------------------------------

Agave supports job execution both interactively and through :raw-html-m2r:`<a href="http://en.wikipedia.org/wiki/Job_scheduler" title="Job Scheduler" target="_blank">batch queueing systems</a>` (aka schedulers). We cover the mechanics of job submission in the Job Management tutorial. Here we just point out that regardless of how your job is actually run on the underlying system, the process of submitting, monitoring, sharing, and otherwise interacting with your job through Agave is identical. Describing the scheduler and execution types for your system is really just a matter of picking the most efficient and/or available mechanism for running jobs on your system.

As you saw in the table above, ``executionType`` refers to the classification of jobs going into the system and ``scheduler`` refers to the type of batch scheduler used on a system. These two fields help limit the range of job submission options used on a specific system. For example, it is not uncommon for a HPC system to accept jobs from both a Condor scheduler and a batch scheduler. It is also possible, though generally discouraged, to fork jobs directly on the command line. With so many options, how would users publishing apps on such a system know what mechanism to use? Specifying the execution type and scheduler help narrow down the options to a single execution mechanism.

Thankfully, picking the right combination is pretty simple. The following table illustrates the available combinations.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th><code>executionType</code></th>
               <th><code>scheduler</code></th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>HPC</td>
               <td>LSF, LOADLEVELER, PBS, SGE, COBALT, TORQUE, MOAB, SLURM</td>
               <td>Jobs will be submitted to the local scheduler using the appropriate scheduler commands. Systems with this execution type will not allow forked jobs.</td>
           </tr>
           <tr>
               <td>CONDOR</td>
               <td>CONDOR</td>
               <td>Jobs will be submitted to the condor scheduler running locally on the remote system. Agave will not do any installation for you, so the setup and administration of the Condor server is up to you.</td>
           </tr>
           <tr>
               <td>CLI</td>
               <td>FORK</td>
               <td>Jobs will be started as a forked process and monitored using the system process id.</td>
           </tr>
       </tbody>
   </table>
|

When you are describing your system, consider the policies put in place by your system administrators. If the system you are defining has a scheduler, chances are they want you to use it.

Defining batch queues
---------------------

Agave supports the notion of multiple submit queues. On HPC systems, queues should map to actual batch scheduler queues on the target server. Additionally, queues are used by Agave as a mechanism for implementing quotas on job throughput in a given queue or across an entire system. Queues are defined as a JSON array of objects assigned to the ``queues`` attribute. The following table summarizes all supported queue parameters.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Name</th>
               <th>Type</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>name</td>
               <td>string</td>
               <td>Arbitrary name for the queue. This will be used in the job submission process, so it should line up with the name of an actual queue on the execution system.</td>
           </tr>
           <tr>
               <td>maxJobs</td>
               <td>integer</td>
               <td>Maximum number of jobs that can be queued or running within this queue at a given time. Defaults to 10. -1 for no limit</td>
           </tr>
           <tr>
               <td>maxUserJobs</td>
               <td>integer</td>
               <td>Maximum number of jobs that can be queued or running by any single user within this queue at a given time. Defaults to 10. -1 for no limit</td>
           </tr>
           <tr>
               <td>maxNodes</td>
               <td>integer</td>
               <td>Maximum number of nodes that can be requested for any job in this queue. -1 for no limit</td>
           </tr>
           <tr>
               <td>maxProcessorsPerNode</td>
               <td>integer</td>
               <td>Maximum number of processors per node that can be requested for any job in this queue. -1 for no limit</td>
           </tr>
           <tr>
               <td>maxMemoryPerNode</td>
               <td>string</td>
               <td>Maximum memory per node for jobs submitted to this queue in ###.#[E|P|T|G]B format.</td>
           </tr>
           <tr>
               <td>maxRequestedTime</td>
               <td>string</td>
               <td>Maximum run time for any job in this queue given in hh:mm:ss format.</td>
           </tr>
           <tr>
               <td>customDirectives</td>
               <td>string</td>
               <td>Arbitrary text that will be appended to the end of the scheduler directives in a batch submit script. This could include a project number, system-specific directives, etc.</td>
           </tr>
           <tr>
               <td>default</td>
               <td>boolean</td>
               <td>True if this is the default queue for the system, false otherwise.</td>
           </tr>
       </tbody>
   </table>
|

Configuring quotas
------------------

In the batch queues table above, several attributes exist to specify limits on the number of total jobs and user jobs in a given queue. Corresponding attributes exist in the execution system to specify limits on the number of total and user jobs across an entire system. These attributes, when used appropriately, can be used to tell Agave how to enforce limits on the concurrent activity of any given user. They can also ensure that Agave will not unfairly monopolize your systems as your application usage grows.

If you have ever used a shared HPC system before, you should be familiar with batch queue quotas. If not, the important thing to understand is that they are a critical tool to ensure fair usage of any shared resource. As the owner/administrator for your registered system, you can use the batch queues you define to enforce whatever usage policy you deem appropriate.

Consider one example where you are using a VM to run image analysis routines on demand through Agave, your server will become memory bound and experience performance degradation if too many processes are running at once. To avoid this, you can set a limit using a batch queue configuration that limits the number of simultaneous tasks that can run at once on your server.

Another example where quotas can be helpful is to help you properly partitioning your system resources. Consider a user analyzing unstructured data. The problem is computationally and memory intensive. To preserve resources, you could create one queue with a moderate value of ``maxJobs`` and conservative ``maxMemoryPerNode``\ , ``maxProcessorsPerNode``\ , and ``maxNodes`` values to allow good throughput of small job. You could then create another queue with large ``maxMemoryPerNode``\ , ``maxProcessorsPerNode``\ , and ``maxNodes`` values while only allowing a single job to run at a time. This gives you both high throughput and high capacity on a single system.

The following sample queue definitions illustrate some other interesting use cases.


.. raw:: html

   <p>
       <select id="queue-config-selector" name="queue-config-selector" onChange="$('.queue-config').addClass('hidden'); $('#' + $(this).val()).removeClass('hidden');">
           <option value="queue-short-job">Short Jobs</option>
           <option value="queue-small-queues">Restrited Usage</option>
           <option value="queue-single-node">Single Node Jobs</option>
           <option value="queue-dedicated">Dedicated Usage</option>
       </select>
   </p>



.. raw:: html

   <pre id="queue-short-job" class="json queue-config" style="white-space:pre-wrap; word-wrap:break-word;">
   {
       "name":"short_job",
       "mappedName": null,
       "maxJobs":100,
       "maxUserJobs":10,
       "maxNodes":32,
       "maxMemoryPerNode":"64GB",
       "maxProcessorsPerNode":12,
       "maxRequestedTime":"00:15:00",
       "customDirectives":null,
       "default":true
   }
   </pre>



.. raw:: html

   <pre id="queue-small-queues" class="json queue-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   # Restrict the queue to having at most 10 total jobs in it at once. Jobs may run for no more than an hour.
   {
       "name":"small_q",
       "mappedName": null,
       "maxJobs":10,
       "maxUserJobs":1,
       "maxNodes":32,
       "maxMemoryPerNode":"64GB",
       "maxProcessorsPerNode":12,
       "maxRequestedTime":"01:00:00",
       "customDirectives":null,
       "default":true
   }
   </pre>



.. raw:: html

   <pre id="queue-single-node" class="json queue-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   # Restrict the queue to only running single node jobs.
   {
       "name":"short_job",
       "mappedName": null,
       "maxJobs":100,
       "maxUserJobs":10,
       "maxNodes":1,
       "maxMemoryPerNode":"64GB",
       "maxProcessorsPerNode":12,
       "maxRequestedTime":"24:00:00",
       "customDirectives":null,
       "default":true
   }
   </pre>



.. raw:: html

   <pre id="queue-dedicated" class="json queue-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   # Create two queues.
   # - "big_mem" allows single node jobs with memory up to 1TB.
   # - "big_compute" allows jobs with up to 256 nodes, and 16GB of memory per node.
   [
     {
       "name":"big_mem",
       "mappedName": null,
       "maxJobs":10,
       "maxUserJobs":1,
       "maxNodes":1,
       "maxMemoryPerNode":"1TB",
       "maxProcessorsPerNode":12,
       "maxRequestedTime":"12:00:00",
       "customDirectives":null,
       "default":true
     },
     {
       "name":"big_compute",
       "mappedName": null,
       "maxJobs":10,
       "maxUserJobs":10,
       "maxNodes":256,
       "maxMemoryPerNode":"16GB",
       "maxProcessorsPerNode":12,
       "maxRequestedTime":"24:00:00",
       "customDirectives":null,
       "default":true
     }
   ]
   </pre>


System login protocols
----------------------

As with storage systems, Agave supports several different protocols and mechanisms for job submission. We already covered scheduler and queue support. Here we illustrate the different login configurations possible. For brevity, only the value of the ``login`` JSON object is shown.


.. raw:: html

   <p>
       <select id="login-config-selector" name="login-config-selector" onChange="$('.login-config').addClass('hidden'); $('#' + $(this).val()).removeClass('hidden');">
           <option value="login-ssh-password">SSH</option>
           <option value="login-ssh-sshkeys">SSH w/ SSH Keys</option>
           <option value="login-ssh-tunnel">SSH w/ tunnel</option>
           <option value="login-gsissh">GSI OpenSSH</option>
           <option value="login-gsissh-myproxy">GSI OpenSSH w/ MyProxy</option>
           <option value="login-gsissh-mpg">GSI OpenSSH w/ MyProxy Gateway</option>
           <option value="login-local">Local</option>
       </select>
   </p>



.. raw:: html

   <pre id="login-ssh-password" class="json login-config" style="white-space:pre-wrap; word-wrap:break-word;">
   {
     "host": "execute.example.com",
     "port": 22,
     "protocol": "SSH",
     "auth": {
       "username": "systest",
       "password": "changeit",
       "type": "PASSWORD"
     }
   }
   </pre>



.. raw:: html

   <pre id="login-ssh-sshkeys" class="json login-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
     "host": "execute.example.com",
     "port": 22,
     "protocol": "SSH",
     "auth": {
       "username":"nryan",
        "publicKey": "ssh-rsa AAAAB3NzaC1yc2EBBAADAQABMQPRgQChJ6bzejqSuJdTi+VwMif8qotuSSlYwrVt0EWVduKZHpzOnS1zlknAyYXmQQFcaJ+vNAQayVMTqv+A+1lzxppTdgZ0Dn42EOYWRa6B/IEMPzDuKb7F0qNFiH9m+OZJDYdIWS1rlN1oK32jHUi0xV8kM3KOLf2TIjDBUyZRpMGyQ== Generated by Nova",
        "privateKey": "-----BEGIN RSA PRIVATE KEY-----nMIVCXAIBAAKBgQRhJ6bzejqSuJdTi+VwMif8qoyuSSlYwrVt0EWVduKZHpzOnSManlknAyYXmQQFcaJ+vNAQayVqTqv+A+1lzxppTdgZ0Dn42EOYWRa6B/IEMPzDuKb7Fn0uNFiH9x+OZJDYdIWS1rN1oK4DjHUi0xV8kMN3OPSIU23asx1UyZRpMGyQIDAQABnAoGATrW4NAkJ3Kltt6+HQ1Ir95sxFNrE6AZJaLYllke3iwPJpCX1dDdpDcXa8AGbVnjFXJUGA+dPrJqbyGCHA7E3H342837k/twSRGkcCNpRx/MMdWnw3asea/K5L4XVeunXAn79vo/e28D4Uue62dSwIvDJKIFWMSAgUoD53ImushqlLUCQQDPkObaowzkboLCnv3Nyj16KFZ5Lp7r5q5MYfRxO7t53Z7AWoflr++KrAT3UbSKtqmC68CqbPzxSd6qHnbnkWaD0HAkEAxsJZh7xorwAtdYznMFOsO0w5HDHOB7MuAnjwUvYZVaM0wA7HkE4rnH5SFAwEMlwx82OJxv83CnkRdlXOexn95rwJBALd8cnboGCd/AZzCvX2R+5K5lZtvnhLvczkWho3qrcoG/aUw4l1K78h4VFOFKMJOwv53BXQisF9kW6+qY3/XM49UCQHqDn4AYQOALvPBZCdVtPqFGg6W8csCAE7a5ud8zbj8A+6swcEB0+YcyEkvzID8en1ekmno/ET1wwRnhH6g/tdJlcCQM55QS4Z7rR4psgFDkFvA+wmxlqTGsXJD32sw15g4A0bmzSXnbfFg8TBAjGTDW7l0P8prFrtQ8Wml14390b29l1ptAyE=n-----END RSA PRIVATE KEY-----",
        "type": "SSHKEYS"
     }
   }
   </pre>



.. raw:: html

   <pre id="login-ssh-tunnel" class="json login-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
     "host":"execute.example.com",
     "port":22,
     "protocol":"SSH",
     "auth":{
       "username":"systest",
       "password":"changeit",
       "type":"PASSWORD"
     },
     "proxy":{
       "name":"My gateway proxy server",
       "host":"proxy.example.com",
       "port":"22"
     }
   }
   </pre>



.. raw:: html

   <pre id="login-local" class="json login-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
   {
     "host": "localhost",
     "protocol": "LOCAL",
     "auth": {
       "type": "LOCAL"
     }
   }
   </pre>



.. raw:: html

   <pre id="login-gsissh" class="json login-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "host":"execute.example.com",
      "port":2222,
      "protocol":"GSISSH",
      "auth":{
         "credential": "-----BEGIN CERTIFICATE-----nMIIDqjCCApKgAwIBAgIDJSFGMA0GCSqGSIb3DQEBBQUAMHsxCzAJBgNVBAYTAlVTnMTgwNgYDVQQKEy9OYXRpb25hbCBDZW50ZXIgZm9yIFN1cGVyY29tcHV0aW5nIEFwncGxpY2F0aW9uczEgMB4GA1UECxMXQ2VydGlmaWNhdGUgQXV0aG9yaXRpZXMxEDAOnBgNVBAMTB015UHJveHkwHhcNMTMxMDE0MDcyMjE4WhcNMTMxMDE0MTkyNzE4WjBnnMQswCQYDVQQGEwJVUzE4MDYGA1UEChMvTmF0aW9uYWwgQ2VudGVyIGZvciBTdXBlncmNvbXB1dGluZyBBcHBsaWNhdGlvbnMxHjAcBgNVBAMTFWlwbGFudCBDb21tdW5pndHkgVXNlcjCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAwfHbmtmJ1OUVwgDdn5oA8EsqihwRAi2xhZJYG/FFmOs38+0y7wTfORhVX/79XQMD3NqRJN8xhHQpmuoRynH9l9sbA9gbKaQsrpIYyExygrJ+qaZY0PccD+VAyPDjdLD86316AzWltEdV2E9b+OnCVioz62esJWSqOho8wya4Vo5svUCAwEAAaOBzjCByzAOBgNVHQ8BAf8EBAMCBLAwnHQYDVR0OBBYEFIJXT/jYmxaRywDbZudb1EXbxla5MB8GA1UdIwQYMBaAFNf8pQJ2nOvYT+iuh4OZQNccjx3tRMAwGA1UdEwEB/wQCMAAwNAYDVR0gBC0wKzAMBgorBgEEnAaQ+ZAIFMAwGCiqGSIb3TAUCAgMwDQYLKoZIhvdMBQIDAgEwNQYDVR0fBC4wLDAqnoCigJoYkaHR0cDovL2NhLm5jc2EudWl1Yy5lZHUvZjJlODlmZTMuY3JsMA0GCSqGnSIb3DQEBBQUAA4IBAQBDyW3FJ0xEIXEqk2NtiMqOM99MgufDPL0bxrR8CvPY5GRNn58EXU8RnSSJIuxL95PKclRPPOhGdB48eeF2H1MusOEUEEnHwzrZ1OUFUEpwKuqG6n0h411l3niRRx9wdJL4YITzAWZwpadzwj3d8aO9O/ttVJjGRc8A93I/d3fFAvHyvKnmlEaDrQZNBp1EtClW8xuxsfeUmyXkFlkRiKwqjkJGB8xBuzr8DfLomWq/mXaOkHznCo9nQxAs3gntszLOh+8U9aMxaeCsychRWxG3Y6Z33hrE0yz4AaVonVXu3Z7M+EN+nKbSVRblAzeKfQYYDOgsoFrugYbR9klv1so3Dt+n6n-----END CERTIFICATE-----n-----BEGIN RSA PRIVATE KEY-----nMIICWwIBAAKBgQDB8dua2YnU5RXCAN3mgDwSyqKHBECLbGFklgb8UWY6zfz7TLvBnN85GFVf/v1dAwPc2pEk3zGEdCma6hHIf2X2xsD2BsppCyukhjITHKCsn6ppljQ9xnwP5UDI8ON0sPzrfXoDNaW0R1XYT1v44JWKjPrZ6wlZKo6GjzDJrhWjmy9QIDAQABnAoGAcjrJZYMLM2FaV1G7YK/Wshq3b16JxZSoKF5U7vfihnAcuMaRL1R3IcAgfHlunIq2E7aIFnd+6sygVKXYo4alv5denekiucvKAyXK9F/VTTtLtajUnrvekLvSycKiEnbN9IgQ0ABCnlWyjgQMf64UUYBQtvU+lbRCs4jbuHxuyn5WECQQD8fJhlBHgA49hjnZBKnU9Xb+LEKhWDCEyIiOMMGY+2XhrGVvGF5KqJVusZEv8lbXNjzgSQFgLohEXVzn9v8tDFMzAkEAxKS5qCYHsTfgPlw3l1DLJRmG3SXrpevXSccBGpXQiUne9gfc9mlgnVTr5QQCXvvI673Y2LnNcnd94KEgvSrzhNwJACeS38/1g1mgXKo3ZTUUztBLinQ7sn463sQHsI6U8xGCbm/n8LMrxA8CsJadg6A6J3vdLpnm2U3YbZm1mqVhGNkQJAdsxxnoUVAdm8kWWhK6W6VG9e9I1OqdrXxfY/tecsyjg6D1a1Qb8mfuj4DoaKjCme69To8nZ3moZXRBWkypzYQopwJAB/zr1UpFz6vY4sIm3Gw3ll/ruNGCr2dzjTyLSGglCOf0nUljJ1FGLyW647JzGPMLcfdb0iEexzCEii9YUFUN1Ow==n-----END RSA PRIVATE KEY-----",
         "type": "X509"
      }
   }
   </pre>



.. raw:: html

   <pre id="login-gsissh-myproxy" class="json login-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "host":"execute.example.com",
      "port":2222,
      "protocol":"GSISSH",
      "auth":{
         "username":"systest",
         "password":"changeit",
         "credential":"",
         "type":"X509",
         "server":{
           "name":"IRODS MyProxy Server",
           "endpoint":"myproxy.example.com",
           "port":7512,
           "protocol":"MYPROXY"
         }
      }
   }
   </pre>



.. raw:: html

   <pre id="login-gsissh-mpg" class="json login-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "host":"execute.example.com",
      "port":2222,
      "protocol":"GSISSH",
      "auth":{
         "username":"systest",
         "type":"X509",
         "server": {
           "name": "My Trusted MPG Server",
           "endpoint": "https://api.example.com/myproxy/v2/",
           "port": 443,
           "protocol": "MPG"
         }
      }
   }
   </pre>


The full list of login configuration options is given in the following table. We omit the ``login.auth`` and ``login.proxy`` attributes as they are identical to those used in the storage config.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th>Attribute</th>
               <th>Type</th>
               <th>Description</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>auth</td>
               <td>JSON object</td>
               <td><b>Required:</b> A JSON object describing the default login authentication credential for this system.</td>
           </tr>
           <tr>
               <td>host</td>
               <td>string</td>
               <td><b>Required:</b> The hostname or ip address of the server where the job will be submitted.</td>
           </tr>
           <tr>
               <td>port</td>
               <td>int</td>
               <td>The port number of the server where the job will be submitted. Defaults to the default port of the protocol used.</td>
           </tr>
           <tr>
               <td>protocol</td>
               <td>SSH, GSISSH, LOCAL</td>
               <td><b>Required:</b> The protocol used to submit jobs for execution.</td>
           </tr>
           <tr>
               <td>proxy</td>
               <td>JSON Object</td>
               <td>The proxy server through with Agave will tunnel when submitting jobs. Currently proxy servers will use the same authentication mechanism as the target server.</td>
           </tr>
       </tbody>
   </table>
|

Scratch and work directories
----------------------------

In the Job Management tutorial we will dive into how Agave manages the end-to-end lifecycle of running a job. Here we point out two relevant attributes that control where data is staged and where your job will physically run. The ``scratchDir`` and ``workDir`` attributes control where the working directories for each job will be created on an execution system. The following table summarizes the decision making process Agave uses to determine where the working directories should be created.


.. raw:: html

   <table border="1px" cellpadding="5">
       <thead>
           <tr>
               <th><code>rootDir</code> value</th>
               <th><code>homeDir</code> value</th>
               <th><code>scratchDir</code> value</th>
               <th>Effective system path for job working directories</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>/</td>
               <td>/</td>
               <td>&mdash;</td>
               <td>/</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/</td>
               <td>/</td>
               <td>/</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/</td>
               <td>/scratch</td>
               <td>/scratch</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>&mdash;</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>/</td>
               <td>/</td>
           </tr>
           <tr>
               <td>/</td>
               <td>/home/nryan</td>
               <td>/scratch</td>
               <td>/scratch</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/</td>
               <td>&mdash;</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/</td>
               <td>/</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/</td>
               <td>/scratch</td>
               <td>/home/nryan/scratch</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/home</td>
               <td>&mdash;</td>
               <td>/home/nryan/home</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/home</td>
               <td>/</td>
               <td>/home/nryan</td>
           </tr>
           <tr>
               <td>/home/nryan</td>
               <td>/home</td>
               <td>/scratch</td>
               <td>/home/nryan/scratch</td>
           </tr>
       </tbody>
   </table>
|

While it is not required, it is a best practice to always specify ``scratchDir`` and ``workDir`` values for your execution systems and, whenever possible, place them outside of the system ``homeDir`` to ensure data privacy. The reason for this is that the file system available on many servers is actually made up of a combination of physically attached storage, mounted volumes, and network mounts. Often times, your home directory will have a very conservative quota while the mounted storage will essentially be quota free. As the above table shows, when you do not specify a ``scratchDir`` or ``workDir``\ , Agave will attempt to create your job work directories in your system ``homeDir``. It is very likely that, in the course of running simulations, you will reach the quota on your home directory, thereby causing that job and all future jobs to fail on the system until you clear up more space. To avoid this, we recommend specifying a location with sufficient available space to handle the work you want to do.

Another common error that arises from not specifying thoughtful ``scratchDir`` and ``workDir`` values for your execution systems is jobs failing due to "permission denied" errors. This often happens when your ``scratchDir`` and/or ``workDir`` resolve to the actual system root. Usually the account you are using to access the system will not have permission to write to ``/``\ , so all attempts to create a job working directory fail, accurately, due to a "permission denied" error.

While it is not required, it is a best practice to always specify ``scratchDir`` and ``workDir`` values for your execution systems and, whenever possible, place them outside of the system ``homeDir`` to ensure data privacy.

Creating a new execution system
-------------------------------

.. code-block:: plaintext

   systems-addupdate -v -F ssh-password.json

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

        curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -F "fileToUpload=@ssh-password.json" https://api.tacc.utexas.edu/systems/v2
|


The response from the server will be similar to the following

.. code-block:: json

   {
      "id":"demo.execute.example.com",
      "uuid":"0001323106792914-5056a550b8-0001-006",
      "name":"Example SSH Execution Host",
      "status":"UP",
      "type":"EXECUTION",
      "description":"My example system using ssh to submit jobs used for testing.",
      "site":"example.com",
      "revision":1,
      "public":false,
      "lastModified":"2013-07-02T10:16:11.000-05:00",
      "executionType":"HPC",
      "scheduler":"SGE",
      "environment":null,
      "startupScript":"./bashrc",
      "maxSystemJobs":100,
      "maxSystemJobsPerUser":10,
      "workDir":"/work",
      "scratchDir":"/scratch",
      "queues":[
         {
            "name":"normal",
            "maxJobs":100,
            "maxUserJobs":10,
            "maxNodes":32,
            "maxMemoryPerNode":"64GB",
            "maxProcessorsPerNode":12,
            "maxRequestedTime":"48:00:00",
            "customDirectives":null,
            "default":true
         },
         {
            "name":"largemem",
            "maxJobs":25,
            "maxUserJobs":5,
            "maxNodes":16,
            "maxMemoryPerNode":"2TB",
            "maxProcessorsPerNode":4,
            "maxRequestedTime":"96:00:00",
            "customDirectives":null,
            "default":false
         }
      ],
      "login":{
         "host":"texas.rangers.mlb.com",
         "port":22,
         "protocol":"SSH",
         "proxy":null,
         "auth":{
            "type":"PASSWORD"
         }
      },
      "storage":{
         "host":"texas.rangers.mlb.com",
         "port":22,
         "protocol":"SFTP",
         "rootDir":"/home/nryan",
         "homeDir":"",
         "proxy":null,
         "auth":{
            "type":"PASSWORD"
         }
      }
   }
