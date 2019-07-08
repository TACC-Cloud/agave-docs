In this extended tutorial we will be working within the TACC tenant. The base URL for the TACC tenant is: https://api.tacc.utexas.edu

Note: In the Getting Started guide, the develop environment was used so all the base URLs were different. None of the Agave objects you created (including clients, systems, apps, etc.) will exist in the (production) TACC tenant.



**Systems and Files**

1. Register an OAuth client to your TACC account by making a POST request to the /clients/v2 endpoint and use the password grant flow to generate a bearer token from the /token endpoint.

2. Verify that your token is valid by retrieving the profile associated with your token; do this by making a GET request to the /profiles/v2/me endpoint.

    #. The request should have an Authorization header with a value equal to the string “Bearer <your_token>”.

    #. Use the -H flag to set a header with curl.

3. Every HTTP request with a non-empty message body (sometimes called the request “payload”) should specify the type of data being included in the body by setting a Content-type header. Content-type header values have the format <type>/<subtype>. Some common values Content-type you will run into often include:

    #. text/html

    #. multipart/form

    #. application/json

    #. application/octet-stream

    #. application/x-www-form-urlencoded

Some additional explanation:

    * text/html is used to send html such as when serving a static webpage.

        * multipart means the message is divided into multiple parts separated by boundaries; this is the most efficient way to send heterogenous data such as a mix of binary and text data. multipart/form is often used when a web app submits a web form that has a mix of simple type fields (strings, integers, choice boxes, etc.) and binary files being uploaded.

        * application/json is used for JSON encoded data.

        * application/octet-stream is used as a catch-all for (unformatted) binary data.

        * application/x-www-form-urlencoded implies the message body is sent as one long string with name=value pairs separated by ampersand (&) characters. This value is used for simple HTML forms that don’t include binary data.

Register the storage system you worked with in the Getting Started guide under your account in the TACC tenant by making a POST request to the /systems/v2 endpoint passing a description of the system based on the system.json file. Agave gives you two ways to do this:

i). Make a multipart-form POST request with a message of the form “fileToUpload=<some_file>” and where the contents of the file are valid JSON. In curl, multipart-form is used when specifying an input file via the -F flag.

ii). Make an application/json POST request where the entire message body is pure JSON.

In the Getting Started guide, which method was used?  

4. A file path specified to the Agave API in the context of a storage system requires some care. The first thing to understand is that every storage system has a rootDir attribute which works like chroot in Linux (see https://en.wikipedia.org/wiki/Chroot). The effect of the rootDir attribute on an Agave storage system is to make the root path (i.e., “/”) equivalent to the rootDir. For example, if the rootDir attribute is set to /data for some storage system, then specifying a path of /experiment1 on that storage system resolves to the physical path /data/experient1 on the storage system. Similarly, if the rootDir attribute were set to /apps/bio, then a file path of /fastqc/bin would actually resolve to /apps/bio/fastqc/bin. In other words, file paths are appended to the rootDir attribute and therefore, no file path can ever be accessed outside of the rootDir (just like with chroot).

Second, every storage system also has a homeDir attribute. This attribute is used when relative paths are provided to the API, that is, paths that do not begin with a slash (/) character. Continuing with the example above, if the homeDir attribute is set to /home/jdoe for some storage system, then specifying a path of experiment1 (no beginning slash) on that storage system resolves to the physical path /home/jdoe/experient1

Register a second storage system using the same system.json file but set different rootDir and homeDir attributes. Make sure that at least the homeDir attribute lives within the a directory that the user specified in the “auth” stanza has access to (e.g., /home/testuser1). Also this time, try to use method ii) described above to make the POST request. In order to use method ii), you’ll need to set the Content-type header explicitly: by default, curl will try to use a different content type. But don’t try to type the JSON out on the command line - you can tell curl to read it in directly from the file.

Note: by passing -v to curl, it will run in “verbose” mode and show you all the headers being passed.

5. All files API (/files/v2) endpoints are divided into two subcollections: “listings” and “media”. The /files/v2/listings collection returns information similar to the ls command (i.e., metadata about the files and directories) while the /files/v2/media collection returns the actual contents of the files themselves. Each of these subcollections is further divided by storage system. Therefore, we have valid endpoints such as:

    #. /files/v2/listings/system/<system_id> and

    #. /files/v2/media/system/<system_id>

In order to work with a specific file or directory, a path is appended to the end of the endpoint and this path is either absolute (has an additional slash) or is relative. For example:

    /files/v2/listings/system/<system_id>/path/to/some/file.csv

    /files/v2/listings/system/<system_id>//path/to/some/file.csv

In the case of one slash, the path (/path/to/some/file.csv) is relative to the homeDIr while in the case of two slashes (//path/to/some/file.csv) the path is relative to the rootDir.

i.  Issue several API calls to the listings collection for different paths on your two storage systems to make sure you understand paths. What HTTP method are you using?

ii. Make an API call to the media collection for a specific file on one of the storage systems to download the file. Use a command line redirect to pipe the output of curl to a file.

iii. Make an API call to upload a file to a particular path on one of your storage systems. Which subcollection should you use and which HTTP method? Which content type? Note the JSON response as well, in particular, the “status” field. This is indicating that Agave has queued the task of transferring the upload to the remote storage system but it may take some time before it is complete.

6. An Agave URI is a unique identifier of a file or directory on a storage system and has the form agave://<system_id>/<path> where <path> could either begin with a slash or not. For example, for a storage system with id my.storage.system, the agave URI

agave://my.storage.system/path/to/test.json

represents the path/to/test.json relative to the homeDir attribute and

agave://my.storage.system//path/to/test.json

represents path/to/test/json relative to the rootDir. To make an (asynchronous) transfer from one storage system to another with Agave, make a POST request to the API endpoint of the form:

    /files/v2/media/system/<target_system_id>/<target_path>

with a JSON message payload of the form

    {“urlToIngest”: “agave://<source_system_id>/<source_path>”, "fileName":"test.json"}



The source path will be copied to the target path.

Issue several API calls to transfer files between your two storage systems. As with the upload, the transfers are processed asynchronously and therefore don’t complete right away. This is indicated by the “status” returned.



**Apps**

1. In order to allow apps to run in different ways for different jobs, two types of attributes can be defined in the app.json: inputs are files that should be provided to the app and parameters are all other kinds of arguments to the app such flags and switches. Each input and parameter has an “id” attribute which can be referenced in the wrapper.sh script for the app. Parameters also have a type attribute. Here are two minimal examples:

an input:

{

 "id": "input1"

}

a parameter:

{

 "id": "parameter1",

 "value": {

   "type": "string"

 }

}

For a list of all attributes for inputs and parameters see http://developer.tacc.cloud/docs/guides/apps/app-inputs-and-parameters-tutorial.html

Within the wrapper.sh script, the app author can reference the values of these using macros. To use a macro, enclose the id within a single dollar sign ($) and braces ({}) - for example, ${input1} or ${parameter1}. In the case of an input, Agave will replace the macro with the path on the execution system where the input file was staged. In the case of a parameter, Agave will replace the macro with actual value of the parameter supplied in the job. For more details on the wrapper script see http://developer.tacc.cloud/docs/guides/apps/app-wrapper-templates

Write and register an app to count the words in an input file. The input file should be a required input to the app. Use the GNU word count command line tool, wc, in the wrapper.sh template. It might be helpful to experiment with wc at the command line first; for instance, try running

$ wc <some_file.txt>

2. Once you have your word count app registered, submit a job to run the word count app with an input file from one of your storage systems.

3. Modify your original word count app to write the output of the word count to a file (by default, wc writes the output to standard out). Submit a job to the new version of word count with archiving set to True so that Agave archives the job directory to one of your storage systems.

4. Make a files API request to download the output file from the job in step 3 once the job is finished.



**Making Agave API Calls in Python with agavepy**

All of the above API calls could be made in Python using the requests library or the Agave Python agavepy library. To install agavepy, use pip:

pip install agavepy

Agavepy wraps the requests library to handle error checking, JSON serialization and deserialization, and conveinece methods for doing file uploads, working with asynchronous API calls, etc.

Get started by walking through the “Pure Python” section of README here:

https://github.com/TACC/agavepy

to instantiate an agavepy.agave.Agave client object and get an access token. You can skip to the “Reuse an existing Oauth client” section since you already have an OAuth client.

This jupyter notebook introduces agavepy and walks through the apps service:

https://github.com/TACC/jupyterhub_images/blob/master/designsafe/agavepy_example.ipynb

This jupyter notebook builds upon the previous one to submit an opensees job using agavepy:

https://github.com/TACC/jupyterhub_images/blob/master/designsafe/opensees-submit-example.ipynb

A (mostly) complete agavepy API reference is available here: http://agavepy.readthedocs.io/en/latest/