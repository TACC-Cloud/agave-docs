
Job Lifecycle Management
^^^^^^^^^^^^^^^^^^^^^^^^

Tapis (Agave) handles all of the end-to-end details involved with managing a job lifecycle for you. This can seem like black magic at times, so here we detail the overall lifecycle process every job goes through.


.. raw:: html

   <ol>
   <li>Job request is made, validated, and saved.</li>
   <li>Job is queued up for execution. Job stays in a pending state until there are resources to run the job. This means that the target execution system is online, the storage system with the app assets is online, and neither the user nor the system are over quota.
   a. Resource do not become available with 7 days, the job is killed.
   b. Resources are available, the job moves on.</li>
   <li>When resources are available to run the job on the execution system, a work directory is created on the execution system. The job work directory is created based on the following logic:

   [code lang=plain]
   if (executionSystem.scratchDir exists) 
   then
       $jobDir = executionSystem.scratchDir
   else if (executionSystem.workDir exists)
   then
       $jobDir = system.workDir  
   else 
       $jobDir = system.storage.homeDir
   endif

   $jobDir = $jobDir + "/" + job.owner + "/job-" + job.uuid
   ```</li>
   <li>The job inputs are staged to the job work directory, job status is updated to "INPUTS_STAGING"
   a. All inputs succeed and the job is updated to "STAGED"
   b. One or more inputs fail to transfer. Job status is set back to "PENDING" and staging will be attempted up to 2 more times.
   c. User does not have permission to access one or more inputs. The job is set to "FAILED" and exists.</p></li>
   <li>The job again waits until the resources are available to run the job. Usually this is immediately after the inputs finish staging.
   a. Resource do not become available with 7 days, the job is killed.
   b. Resources are available, the job moves on.</li>
   <li>The app deploymentPath is copied from the app.deploymentSystem to a temp dir on the API server. The jobs API then processes the app.deploymentDir + "/" + app.templatePath file to create the .ipcexe file. The process goes as follows:

   <ol>
   <li>Script headers are written. This includes scheduler directives if a batch system, shbang if a forked app. </li>
   <li>Additional executionSystem[job.batchQueue].customDirectives are written</li>
   <li>"RUNNING" callback written</li>
   <li>Module commands are written</li>
   <li>executionSystem.environment is written</li>
   <li>wrapper script is filtered

   <ol>
   <li>blacklisted commands are removed</li>
   <li>app parameter template variables are resolved against job parameter values.</li>
   <li>app input template variables are resolved against job input values</li>
   <li>blacklisted commands are removed again</li>
   </ol></li>
   <li>"CLEANING_UP" callback written</li>
   <li>All template macros are resolved.</li>
   <li>job.name.slugify + ".ipcexe" file written to temp directory</li>
   </ol></li>
   <li>App assets with wrapper template are copied to remote job work directory.</li>
   <li>Directory listing of job work directory is written to a .agave.archive manifest file in the remote job work directory.</li>
   <li>Command line is generated to invoke the *.ipcexe file by the appropriate method for the execution system.</li>
   <li>Command line is run on the remote system.
   a. The command succeeds and the scheduler/process/job id is captured and stored with the job record.
   b. The command fails, return the job to "STAGED" status and try up to 2 more times.</li>
   <li>Job is updated to "QUEUED"</li>
   <li>Job waits for a "RUNNING" callback and adds a background process to monitor the job in case the callback never comes. </li>
   <li><p>Callback checks the job status  according the the following schedule

   [code lang=plain]
   * every 30 seconds for the first 5 minutes
   * every minute for the next 30 minutes
   * every 5 minutes for the next hour
   * every 15 minutes for the next 12 hours
   * every 30 minutes for the next 24 hours
   * every hour for the next 14 days 
   ```</li>
   <li><p>Job either calls back with a "CLEANING_UP" status update or the monitoring process discovers the job no longer exists on the remote system.</p></li>
   <li>If job.archive is true, send job to archiving queue to stage outputs to job.archiveSystem

   <ol>
   <li>Resource do not become available with 7 days, the job is killed.</li>
   <li>Resources are available, the job moves on.

   <ol>
   <li>Read the .agave.archive manifest file from the job work directory</li>
   <li>Begin a breadth first directory traversal of the job work directory</li>
   <li>If a file/folder is not in the .agave.archive manifest, copy it to the job.archivePath on the job.archiveSystem</li>
   <li>Delete the job work directory</li>
   </ol></li>
   </ol></li>
   <li>Update job status to "FINISHED"</li>
   </ol>



.. raw:: html

   <!-- 
   ### Introduction 

   ### Submission

   #### Validation
   #### Permissions
   #### Availability
   #### Common failures
   #### Handling uncertainty
   #### Drop dead dates

   ### Queues, queues, and queues

   #### Quotas
   #### Capacity
   #### Scheduling
   #### Common failures
   #### Handling uncertainty
   #### Drop dead dates


   ### Data staging

   #### Remote working directory
   #### Scheduling
   #### Validation
   #### Availability
   #### Permissions
   #### Retry policy
   #### Common failures
   #### Handling uncertainty
   #### Drop dead dates

   ### App staging

   #### App asset staging 
   #### Wrapper template creation 
   ##### Runtime variables 
   ##### Input values 
   ##### Parameter values 
   #### Shell portability 
   #### Environment setup 
   #### Input data 
   #### .agave.archive manifest 
   #### Common failures

   ### App submission

   #### Remote job ownership
   #### Remote working directory
   #### Runtime security considerations
   #### Remote system quotas

   #### Batch scheduler submission
   ##### Batch submit script
   ##### Custom directives
   ##### Remote job ids
   ##### Batch queue selection
   ##### Batch queue policy

   #### Condor scheduler submission
   ##### Condor submit script
   ##### Job working directory vs condor working directory
   ##### Unpacking the app bundle
   ##### Local execution vs. gliding
   ##### Secondary data stage in
   ##### Monitoring condord
   ##### Condor log files
   ##### Secondary data stage out
   ##### Network performance

   #### Fork submission
   ##### Submit script
   ##### Modules and environment
   ##### Remote process ids
   ##### Redirecting output
   ##### Job logs
   ##### Ghost processes

   #### Handling uncertainty
   #### Drop dead dates

   ### Monitoring status

   #### Heartbeat callbacks
   #### Job callbacks
   #### Background checks
   ##### Exponential backoff
   ##### Batch scheduler queries
   ##### condor_q queries
   ##### Process checks
   #### Common failures
   #### Handling uncertainty
   #### Drop dead dates

   ### Post-execution

   #### Finishing housekeeping tasks
   #### Data preservation
   #### Common failures
   #### Handling uncertainty
   #### Drop dead dates

   ### Archiving outputs

   #### Raw transfer
   #### Filetype detection
   #### Metadata creation
   #### Data permissions
   #### Determining archive path
   #### Performance considerations
   #### Common failures
   #### Handling uncertainty
   #### Drop dead dates

   ### Job completion

   #### Canonical job output references
   #### Data preservation
   #### Data sharing
   #### Log files
   #### Resubmission
   #### Common failures
   #### Handling uncertainty
   #### Drop dead dates
   -->

