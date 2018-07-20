
URL Macros
----------

In the context of Agave, a webhook is a URL to which Agave will send a POST request when that event occurs. A webhook can be any web accessible URL. While you cannot customize the POST content that Agave sends (it is unique to the event), you can take advantage of the many template variables that Agave provides to customize the URL at run time. The following tables show the webhook template variables available for each resource. Use the select box to view the macros for different resources.


.. raw:: html

   <p>
       <select id="notification-macros-selector" name="notification-macros-selector" onChange="$('.notification-macros').addClass('hidden'); $('#' + $(this).val()).removeClass('hidden');">
           <option value="notification-macros-apps">Apps</option>
           <option value="notification-macros-jobs">Jobs</option>
           <option value="notification-macros-files">Files</option>
           <option value="notification-macros-metadata">Metadata</option>
           <option value="notification-macros-metadata-schema">Metadata Schema</option>
           <option value="notification-macros-monitors">Monitors</option>
           <option value="notification-macros-postits">PostIts</option>
           <option value="notification-macros-profiles">Profiles</option>
           <option value="notification-macros-systems">Systems</option>
           <option value="notification-macros-transforms">Transforms</option>
       </select>
   </p>



.. raw:: html

   <table id="notification-macros-apps" class="notification-macros" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the app.</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>APP_ID</td>
   <td>The application id (ex. sabermetrics-2.1)</td>
   </tr>
   </tbody>
   </table>
   <p></p>
   <p></p>
   <table id="notification-macros-jobs" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the job</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>JOB_STATUS</td>
   <td>The status of the job at the time the event occurs</td>
   </tr>
   <tr>
   <td>JOB_URL</td>
   <td>The url of the job within the API</td>
   </tr>
   <tr>
   <td>JOB_ID</td>
   <td>The unique id used to reference the job within Agave.</td>
   </tr>
   <tr>
   <td>JOB_SYSTEM</td>
   <td>ID of the job execution system (ex. ssh.execute.example.com)</td>
   </tr>
   <tr>
   <td>JOB_NAME</td>
   <td>The user-supplied name of the job</td>
   </tr>
   <tr>
   <td>JOB_START_TIME</td>
   <td>The time when the job started running in ISO8601 format.</td>
   </tr>
   <tr>
   <td>JOB_END_TIME</td>
   <td>The time when the job stopped running in ISO8601 format.</td>
   </tr>
   <tr>
   <td>JOB_SUBMIT_TIME</td>
   <td>The time when the job was submitted to Agave for execution by the user in ISO8601 format.</td>
   </tr>
   <tr>
   <td>JOB_ARCHIVE_PATH</td>
   <td>The path on the archive system where the job output will be staged.</td>
   </tr>
   <tr>
   <td>JOB_ARCHIVE_URL</td>
   <td>The Agave URL for the archived data.</td>
   </tr>
   <tr>
   <td>JOB_ERROR</td>
   <td>The error message explaining why a job failed. Null if completed successfully.</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-files" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the file</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>TYPE</td>
   <td>The application id (ex. sabermetrics-2.1)</td>
   </tr>
   <tr>
   <td>FORMAT</td>
   <td>The data format of the file/folder.</td>
   </tr>
   <tr>
   <td>PATH</td>
   <td>Path to the file/folder on the remote system</td>
   </tr>
   <tr>
   <td>SYSTEM</td>
   <td>ID of the system on which the file/folder exists (ex. ssh.execute.example.com)</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-metadata" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the metadata object</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-metadata-schema" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the schemata object</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-monitors" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>ID</td>
   <td>The ID of the monitor</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>OWNER</td>
   <td>The owner of the monitor</td>
   </tr>
   <tr>
   <td>TARGET</td>
   <td>The system to which the monitor applies</td>
   </tr>
   <tr>
   <td>ACTIVE</td>
   <td>Whether the monitor is active or inactive</td>
   </tr>
   <tr>
   <td>UPDATE_SYSTEM_STATUS</td>
   <td>Whether the system status will be updated with the check results</td>
   </tr>
   <tr>
   <td>INTERNAL_USERNAME</td>
   <td>The internal user associated with the status check</td>
   </tr>
   <tr>
   <td>CREATED</td>
   <td>The time the monitor was created in ISO8601 format</td>
   </tr>
   <tr>
   <td>LAST_SUCCESS</td>
   <td>The time the monitor last successfully ran in ISO8601 format</td>
   </tr>
   <tr>
   <td>LAST_UPDATED</td>
   <td>The time the monitor last ran in ISO8601 format</td>
   </tr>
   <tr>
   <td>NEXT_CHECK</td>
   <td>The time the monitor will run in ISO8601 format</td>
   </tr>
   <tr>
   <td>FREQUENCY</td>
   <td>The frequency in minutes that the monitor runs</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-notification" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the notification object</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which caused the notification for this notification resource to be sent.</td>
   </tr>
   <tr>
   <td>URL</td>
   <td>The URL to which this notification will be published.</td>
   </tr>
   <tr>
   <td>ATTEMPTS</td>
   <td>Maximum retry attempts that will be made for this notification.</td>
   </tr>
   <tr>
   <td>RESPONSE_CODE</td>
   <td>The last response code for a delivery attempt for this notification</td>
   </tr>
   <tr>
   <td>LAST_UPDATED</td>
   <td>The timestamp of the last time this notification was updated in ISO8601 format</td>
   </tr>
   <tr>
   <td>ASSOCIATED_ID</td>
   <td>The resource whose events this notification is subscribed</td>
   </tr>
   <tr>
   <td>CREATED</td>
   <td>The timestamp when the notification was created in ISO8601 format</td>
   </tr>
   <tr>
   <td>STATUS</td>
   <td>The current status of this notification. eg. ACTIVE, INACTIVE, FAILED, COMPLETE.</td>
   </tr>

   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-postits" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the PostIt</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>NONCE</td>
   <td>Nonce specified in the POSTIT url</td>
   </tr>
   <tr>
   <td>CREATED</td>
   <td>Time the PostIt was created ISO8601 format</td>
   </tr>
   <tr>
   <td>RENEWED</td>
   <td>Last time the PostIt was renewed in ISO8601 format</td>
   </tr>
   <tr>
   <td>EXPIRES</td>
   <td>Time the PostIt expires in ISO8601 format</td>
   </tr>
   <tr>
   <td>TARGET_URL</td>
   <td>Remote URL which will be called when the PostIt is redeemed</td>
   </tr>
   <tr>
   <td>TARGET_METHOD</td>
   <td>HTTP method that will be called on the TARGET_URL</td>
   </tr>
   <tr>
   <td>REMAINING_USES</td>
   <td>Number of invocations remaining for this PostIt</td>
   </tr>
   <tr>
   <td>POSTIT</td>
   <td>Full PostIt URL</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-profiles" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the profile</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>USERNAME</td>
   <td>Username of the user</td>
   </tr>
   <tr>
   <td>EMAIL</td>
   <td>Email address of the user</td>
   </tr>
   <tr>
   <td>FIRST_NAME</td>
   <td>First name of the user</td>
   </tr>
   <tr>
   <td>LAST_NAME</td>
   <td>Last name of the user</td>
   </tr>
   <tr>
   <td>POSITION</td>
   <td>Formal job position</td>
   </tr>
   <tr>
   <td>INSTITUTION</td>
   <td>Institution in which they work</td>
   </tr>
   <tr>
   <td>PHONE</td>
   <td>Phone number</td>
   </tr>
   <tr>
   <td>FAX</td>
   <td>Fax number</td>
   </tr>
   <tr>
   <td>RESEARCH_AREA</td>
   <td>Domain of science</td>
   </tr>
   <tr>
   <td>DEPARTMENT</td>
   <td>Department in which they work</td>
   </tr>
   <tr>
   <td>CITY</td>
   <td>City of residence</td>
   </tr>
   <tr>
   <td>STATE</td>
   <td>State of residence</td>
   </tr>
   <tr>
   <td>COUNTRY</td>
   <td>Country of residence</td>
   </tr>
   <tr>
   <td>GENDER</td>
   <td>Male, female or null if unknown</td>
   </tr>
   <tr>
   <td>ACTIVE</td>
   <td>True if the user is active. False otherwise</td>
   </tr>
   <tr>
   <td>LAST_UPDATED</td>
   <td>The last time this user was updated in ISO8601 format</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-systems" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the system</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>SYSTEM_ID</td>
   <td>ID of the system (ex. ssh.execute.example.com)</td>
   </tr>
   <tr>
   <td>STATUS</td>
   <td>Current status of the system: UP, DOWN, UNKNOWN</td>
   </tr>
   <tr>
   <td>PUBLIC</td>
   <td>True if the system is publicly available, false otherwise</td>
   </tr>
   <tr>
   <td>GLOBAL_DEFAULT</td>
   <td>True if the system is one of the two default publicly available systems, false otherwise</td>
   </tr>
   <tr>
   <td>LAST_UPDATED</td>
   <td>The last time this system was updated in ISO8601 format</td>
   </tr>
   <tr>
   <td>STORAGE_PROTOCOL</td>
   <td>The protocol used to move data to and from this system</td>
   </tr>
   <tr>
   <td>STORAGE_HOST</td>
   <td>The storage host for this sytem</td>
   </tr>
   <tr>
   <td>STORAGE_PORT</td>
   <td>The storage port for this system</td>
   </tr>
   <tr>
   <td>STORAGE_RESOURCE</td>
   <td>The system resource for iRODS systems</td>
   </tr>
   <tr>
   <td>STORAGE_ZONE</td>
   <td>The system zone for iRODS systems</td>
   </tr>
   <tr>
   <td>STORAGE_CONTAINER</td>
   <td>The the object store bucket in which the <span class="code">rootDir</span> resides. </td>
   </tr>
   <tr>
   <td>STORAGE_ROOT_DIR</td>
   <td>The virtual root directory exposed on this system</td>
   </tr>
   <tr>
   <td>STORAGE_HOME_DIR</td>
   <td>The home directory on this system relative to the STORAGE_ROOT_DIR</td>
   </tr>
   <tr>
   <td>STORAGE_AUTH_TYPE</td>
   <td>The storage authentication method for this system</td>
   </tr>
   <tr>
   <td>LOGIN_PROTOCOL</td>
   <td>The protocol used to establish a session with this system (eg SSH, GSISSH, etc)</td>
   </tr>
   <tr>
   <td>LOGIN_HOST</td>
   <td>The login host for this system</td>
   </tr>
   <tr>
   <td>LOGIN_PORT</td>
   <td>The login port for this system</td>
   </tr>
   <tr>
   <td>LOGIN_AUTH_TYPE</td>
   <td>The login authentication method for this system</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>



.. raw:: html

   <table id="notification-macros-transforms" class="notification-macros hidden" border="1px" cellpadding="5">
   <thead>
   <tr>
   <th>Variable</th>
   <th>Description</th>
   </tr>
   </thead>
   <tbody>
   <tr>
   <td>UUID</td>
   <td>The UUID of the transfer</td>
   </tr>
   <tr>
   <td>EVENT</td>
   <td>The event which occurred</td>
   </tr>
   <tr>
   <td>SOURCE</td>
   <td>The source URL of this transfer</td>
   </tr>
   <tr>
   <td>DESTINATION</td>
   <td>The destination URL of this transfer</td>
   </tr>
   <tr>
   <td>STATUS</td>
   <td>The current status of this transfer in ISO8601 format</td>
   </tr>
   <tr>
   <td>CREATED</td>
   <td>The time the transfer was submitted to Agave in ISO8601 format</td>
   </tr>
   <tr>
   <td>START_TIME</td>
   <td>The time the transfer started in ISO8601 format</td>
   </tr>
   <tr>
   <td>END_TIME</td>
   <td>The time the transfer ended in ISO8601 format</td>
   </tr>
   <tr>
   <td>TOTAL_SIZE</td>
   <td>Total data size to be transferred</td>
   </tr>
   <tr>
   <td>TOTAL_TRANSFER</td>
   <td>Total bytes transferred</td>
   </tr>
   <tr>
   <td>TRANSFER_RATE</td>
   <td>Average transfer rate of all data moved in this transfer given in Gbps</td>
   </tr>
   <tr>
   <td>ATTEMPTS</td>
   <td>Number of attempts made to transfer the SOURCE data</td>
   </tr>
   </tbody>
   </table>



.. raw:: html

   <p></p>
   <p></p>
   <p></p>
   <p></p>


The value of webhook template variables is that they allow you to build custom callbacks using the values of the resource variable at run time. Several commonly used webhooks are shown in the tables above.   


.. raw:: html

   <p></p>
   <p></p>
   <p></p>
   <p></p>


..

   Receive a callback when a new user is created that includes the new user's information


.. code-block:: html

   https://example.com/sendWelcome.php?username=${USERNAME}&email=${EMAIL}&firstName=${FIRST_NAME}&lastName=${LAST_NAME}&src=agaveapi.co&nonce=1234567

..

   Receive self-describing job status updates


.. code-block:: html

   http://example.com/job/${JOB_ID}?status=${STATUS}&lastUpdated=${LAST_UPDATED}

..

   Get notified on all jobs going into and out of queues


.. code-block:: html

   http://example.com/system/${EXECUTION_SYSTEM}/queue/${QUEUE}?action=add
   http://example.com/system/${EXECUTION_SYSTEM}/queue/${QUEUE}?action=subtract

..

   Rerun an analysis when a files finishes staging


.. code-block:: html

   https://$AGAVE_BASE_URL/jobs/v2/a32487q98wasdfa9-09090b0b-007?action=resubmit

..

   Use plus mailing to route job notifications to different folders


.. code-block:: html

   nryan+${EXECUTION_SYSTEM}+${JOB_ID}@gmail.com
