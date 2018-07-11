.. role:: raw-html-m2r(raw)
   :format: html


Authorization
-------------

Most requests to the Agave REST APIs require authorization; that is, the user must have granted permission for an application to access the requested data. To prove that the user has granted permission, the request header sent by the application must include a valid access token.

Before you can begin the authorization process, you will need to register your client application. That will give you a unique client key and secret key to use in the authorization flows.

Supported Authorization Flows
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The Agave REST APIs currently supports four authorization flows:


#. The :raw-html-m2r:`<a href="#authorization-code">Authorization Code</a>` flow first gets a code then exchanges it for an access token and a refresh token. Since the exchange uses your client secret key, you should make that request server-side to keep the integrity of the key. An advantage of this flow is that you can use refresh tokens to extend the validity of the access token.
#. The :raw-html-m2r:`<a href="#implicit-grant">Implicit Grant</a>` flow is carried out client-side and does not involve secret keys. The access tokens that are issued are short-lived and there are no refresh tokens to extend them when they expire.
#. :raw-html-m2r:`<a href="#resource-owner-password-credentials">Resource Owner Password Credentials</a>` flow is suitable for native and mobile applications as well as web services, this flow allows client applications to obtain an access token for a user by directly providing the user credentials in an authentication request. This flow exposes the user's credentials to the client application and is primarily used in situations where the client application is highly trusted such as the command line.
#. The :raw-html-m2r:`<a href="#client-credentials">Client Credentials</a>` flow enables users to interact with their own protected resources directly without requiring browser interaction. This is a critical addition for use at the command line, in scripts, and in offline programs. This flow assumes the person registering the client application and the user on whose behalf requests are made be the same person.


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
   <tr>
   <th>Flow</th>
   <th>Can fetch a user’s data by requesting access?</th>
               <th>Uses secret key? (key exchange must happen server-side!)</th>
               <th>Access token can be refreshed?</th>
           </tr>
           <tr>
               <td>Authorization Code</td>
               <td>Yes</td>
               <td>Yes</td>
               <td>Yes</td>
           </tr>
           <tr>
               <td>Implicit Grant</td>
               <td>Yes</td>
               <td>No</td>
               <td>No</td>
           </tr>
           <tr>
               <td>Resource Owner Password Credentials</td>
               <td>Yes</td>
               <td>Yes</td>
               <td>Yes</td>
           </tr>
           <tr>
               <td>Client Credentials</td>
               <td>No</td>
               <td>Yes</td>
               <td>No</td>
           </tr>
           <tr>
               <td>Unauthorized</td>
               <td>No</td>
               <td>No</td>
               <td>No</td>
           </tr>
   </table>


Token lifetimes
^^^^^^^^^^^^^^^

There are two kinds of tokens you will obtained: access and refresh. Access token lifetimes are configured by the organization operating each tenant and vary based on the flow used to obtain them. By default, access tokens are valid for 4 hours.


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
       <tr>
         <th>Authorization Flow</th>
         <th>Access Token Lifetime</th>
         <th>Refresh Token Lifetime</th>
       </tr>
       <tr>
         <td>Authorization</td>
         <td>4 hours</td>
         <td>infinite</td>
       </tr>
       <tr>
         <td>Implicit</td>
         <td>1 hour</td>
         <td>n/a</td>
       </tr>
       <tr>
         <td>User Credential Password</td>
         <td>4 hours</td>
         <td>infinite</td>
       </tr>
       <tr>
         <td>Client Credentials</td>
         <td>4 hours</td>
         <td>n/a</td>
       </tr>
   </table>


Authorization Code
^^^^^^^^^^^^^^^^^^

The method is suitable for long-running applications in which the user logs in once and the access token can be refreshed. Since the token exchange involves sending your secret key, this should happen on a secure location, like a backend service, not from a client like a browser or mobile apps. This flow is described in :raw-html-m2r:`<a href="http://tools.ietf.org/html/rfc6749#section-4.4" title="RFC-6749">RFC-6749</a>`. This flow is also the authorization flow used in our REST API Tutorial.


.. raw:: html

   <p>
       <img src="../../images/Authorization-Code-Flow.png" alt="Authorization Code Flow Diagram" style="height: auto;"/>
   </p>


1. Your application requests authorization
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

..

   A typical request will look something like this


.. code-block:: http

   https://public.tenants.agaveapi.co/authorize/?client_id=gTgp...SV8a&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=PRODUCTION&state=866

The authorization process starts with your application sending a request to the Agave authorization service. (The reason your application sends this request can vary: it may be a step in the initialization of your application or in response to some user action, like a button click.) The request is sent to the /authorize endpoint of the Authorization service:

The request will include parameters in the query string:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Request body parameter</th>
               <th>Value</th>
           </tr>
           <tr>
               <td>response_type</td>
               <td><i>Required</i>. As defined in the OAuth 2.0 specification, this field must contain the value  "code".</td>
           </tr>
           <tr>
               <td>client_id</td>
               <td><i>Required</i>. The application's client ID, obtained when the client application was registered with Agave (see <a href="../../documentation/user-guide/client-registration/">Client Registration</a>).</td>
           </tr>
           <tr>
               <td>redirect_uri</td>
               <td><i>Required</i>. The URI to redirect to after the user grants/denies permission. This URI needs to have been entered in the Redirect URI whitelist that you specified when you registered your application. The value of <code>redirect_uri</code> here must exactly match one of the values you entered when you registered your application, including upper/lowercase, terminating slashes, etc.</td>
           </tr>
           <tr>
               <td>scope</td>
               <td><i>Optional</i>. A space-separated list of scopes. Currently only PRODUCTION is supported.</td>
           </tr>
           <tr>
               <td>state</td>
               <td><i>Optional,</i> but strongly recommended. The state can be useful for correlating requests and responses. Because your redirect_uri can be guessed, using a state value can increase your assurance that an incoming connection is the result of an authentication request. If you generate a random string or encode the hash of some client state (e.g., a cookie) in this state variable, you can validate the response to additionally ensure that the request and response originated in the same browser. This provides protection against attacks such as cross-site request forgery. See <a href="http://tools.ietf.org/html/rfc6749#section-4.4" title="RFC-6749">RFC-6749</a>. </td>
           </tr>
   </table>


2. The user is asked to authorize access within the scopes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Agave Authorization service presents details of the scopes for which access is being sought. If the user is not logged in, they are prompted to do so using their API username and password.

When the user is logged in, they are asked to authorize access to the actions and services defined in the scopes.

3. The user is redirected back to your specified URI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

..

   Let's assume you provided the following callback URL.


.. code-block:: http

   https://example.com/callback

After the user accepts (or denies) your request, the Agave Authorization service redirects back to the redirect_uri. If the user has accepted your request, the response query string contains a ``code`` parameter with the access code you will use in the next step to retrieve an access token.

..

   Sample success redirect back from the server


.. code-block:: http

   https://example.com/callback?code=Pq3S..M4sY&state=866


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Query parameter </th>
               <th>Value </th>
           </tr>
           <tr>
               <td>access_token </td>
               <td>An access token that can be provided in subsequent calls, for example to <a href="https://public.agaveapi.co/profiles/v2/me?pretty=true">Agave Profiles API</a>. </td>
           </tr>
           <tr>
               <td>token_type </td>
               <td>Value: "bearer" </td>
           </tr>
           <tr>
               <td>expires_in </td>
               <td>The time period (in seconds) for which the access token is valid. </td>
           </tr>
           <tr>
               <td>state </td>
               <td>The value of the <code>state</code> parameter supplied in the request. </td>
           </tr>
   </table>


If the user has denied access, there will be no access token and the final URL will have a query string containing the following parameters:

.. code-block:: nothing

   # Sample denial redirect back from the server
   https://example.com/callback?error=access_denied&state=867


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Query parameter 
   </th>
               <th>Value 
   </th>
           </tr>
           <tr>
               <td>error 
   </td>
               <td>The reason authorization failed, for example: “access_denied” </td>
           </tr>
           <tr>
               <td>state 
   </td>
               <td>The value of the state parameter supplied in the request. </td>
           </tr>
   </table>


4. Your application requests refresh and access tokens
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   POST https://public.tenants.agaveapi.co/token

When the authorization code has been received, you will need to exchange it with an access token by making a POST request to the Agave Authorization service, this time to its ``/token`` endpoint. The body of this POST request must contain the following parameters:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
   <tr>
               <th>Request body parameter</th>
               <th>Value</th>
           </tr>
           <tr>
               <td>grant_type</td>
               <td><i>Required</i>. As defined in the OAuth 2.0 specification, this field must contain the value  "authorization_code".</td>
   </tr></table>


5. The tokens are returned to your application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: json

   # An example cURL request
   curl -X POST -d "grant_type= authorization_code"
       -d "code=Pq3S..M4sY"
       -d "client_id=gTgp...SV8a"
       -d "client_secret=hZ_z3f...BOD6"
       -d "redirect_uri=https%3A%2F%2Fwww.foo.com%2Fauth"
       https://public.tenants.agaveapi.co/token

..

   The response would look something like this:


.. code-block:: json

   {
       "access_token": "a742...12d2",
       "expires_in": 14400,
       "refresh_token": "d77c...Sacf",
       "token_type": "bearer"
   }

On success, the response from the Agave Authorization service has the status code 200 OK in the response header, and a JSON object with the fields in the following table in the response body:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Key 
   </th>
               <th>Value type</th>
               <th>Value description
   </th>
           </tr>
           <tr>
               <td>access_token 
   </td>
               <td>string</td>
               <td>An access token that can be provided in subsequent calls, for example to Agave REST APIs. 
   </td>
           </tr>
           <tr>
               <td>token_type 
   </td>
               <td>string</td>
               <td>How the access token may be used: always "Bearer". 
   </td>
           </tr>
           <tr>
               <td>expires_in 
   </td>
               <td>int</td>
               <td>The time period (in seconds) for which the access token is valid. (Maximum 14400 seconds, or 4 hours.)
   </td>
           </tr>
           <tr>
               <td>refresh_token</td>
               <td>string</td>
               <td>A token that can be sent to the Spotify Accounts service in place of an authorization code. (When the access code expires, send a POST request to the Accounts service <code>/token</code> endpoint, but use this code in place of an authorization code. A new access token will be returned. A new refresh token might be returned too.) </td>
           </tr>
   </table>


6. Use the access token to access the Agave REST APIs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

..

   Make a call to the API


.. code-block:: bash

   curl -H "Authorization: Bearer a742...12d2"
       https://public.tenants.agaveapi.co/profiles/v2/me?pretty=true&naked=true

..

   The response would look something like this:


.. code-block:: json

   {
       "create_time": "20140905072223Z",
       "email": "rjohnson@mlb.com",
       "first_name": "Randy",
       "full_name": "Randy Johnson",
       "last_name": "Johnson",
       "mobile_phone": "(123) 456-7890",
       "phone": "(123) 456-7890",
       "status": "Active",
       "uid": 0,
       "username": "rjohnson"
   }

Once you have a valid access token, you can include it in ``Authorization`` header for all subsequent requests to APIs in the Platform.

7. Requesting access token from refresh token
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   curl -sku "Authorization: Basic Qt3c...Rm1y="
       -d grant_type=refresh_token
       -d refresh_token=d77c...Sacf
       https://public.tenants.agaveapi.co/token

..

   The response would look something like this.


.. code-block:: json

   {
       "access_token": "61e6...Mc96",
       "expires_in": 14400,
       "token_type": "bearer"
   }

Access tokens are deliberately set to expire after a short time, usually 4 hours, after which new tokens may be granted by supplying the refresh token originally obtained during the authorization code exchange.

The request is sent to the token endpoint of the Agave Authorization service:

.. code-block::

   POST https://public.tenants.agaveapi.co/token

The body of this POST request must contain the following parameters:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">

           <tr>
               <th>Request body parameter</th>
               <th>Value</th>
           </tr>

           <tr>
               <td>grant_type</td>
               <td><i>Required.</i> Set it to "refresh_token". 
   refresh_token </td>
           </tr>
           <tr>
               <td>refresh_token</td>
               <td><i>Required.</i> The refresh token returned from the authorization code exchange.</td>
           </tr>

   </table>


The header of this POST request must contain the following parameter:

Implicit Grant
^^^^^^^^^^^^^^

Implicit grant flow is for clients that are implemented entirely using JavaScript and running in resource owner's browser. You do not need any server side code to use it. This flow is described in :raw-html-m2r:`<a href="http://tools.ietf.org/html/rfc6749#section-4.4" title="RFC-6749">RFC-6749</a>`.

:raw-html-m2r:`<img src="../../images/Implicit-Flow.png" alt="Implicit Flow" style="width: 100%; height:auto"/>`

1. Your application requests authorization
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: json

   https://public.tenants.agaveapi.co/authorize?client_id=gTgp...SV8a&redirect_uri=http:%2F%2Fexample.com%2Fcallback&scope=PRODUCTION&response_type=token&state=867

The flow starts off with your application redirecting the user to the ``/authorize`` endpoint of the Authorization service. The request will include parameters in the query string:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Request body parameter</th>
               <th>Value</th>
           </tr>
           <tr>
               <td>response_type</td>
               <td><i>Required</i>. As defined in the OAuth 2.0 specification, this field must contain the value  "token".</td>
           </tr>
           <tr>
               <td>client_id</td>
               <td><i>Required</i>. The application's client ID, obtained when the client application was registered with Agave (see <a href="../../documentation/user-guide/client-registration/">Client Registration</a>).</td>
           </tr>
           <tr>
               <td>redirect_uri</td>
               <td><i>Required</i>. This parameter is used for validation only (there is no actual redirection). The value of this parameter must <i>exactly</i> match the value of <code>redirect_uri</code> supplied when requesting the authorization code.</td>
           </tr>
           <tr>
               <td>scope</td>
               <td><i>Required</i>. A space-separated list of scopes. Currently only PRODUCTION is supported.</td>
           </tr>
           <tr>
               <td>state</td>
               <td><i>Optional,</i> but strongly recommended. The state can be useful for correlating requests and responses. Because your redirect_uri can be guessed, using a state value can increase your assurance that an incoming connection is the result of an authentication request. If you generate a random string or encode the hash of some client state (e.g., a cookie) in this state variable, you can validate the response to additionally ensure that the request and response originated in the same browser. This provides protection against attacks such as cross-site request forgery. See <a href="http://tools.ietf.org/html/rfc6749#section-4.4" title="RFC-6749">RFC-6749</a>. </td>
           </tr>
           <tr>
               <td>show_dialog</td>
               <td><i>Optional</i>. Whether or not to force the user to approve the app again if they’ve already done so. If <code>false</code> (default), a user who has already approved the application may be automatically redirected to the URI specified by <code>redirect_uri</code>. If <code>true</code>, the user will not be automatically redirected and will have to approve the app again.</td>
           </tr>
   </table>


2. The user is asked to authorize access within the scopes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Agave Authorization service presents details of the scopes for which access is being sought. If the user is not logged in, they are prompted to do so using their API username and password.

When the user is logged in, they are asked to authorize access to the services defined in the scopes. By default all of the Core Science APIs fall under a single scope called, ``PRODUCTION``.

3. The user is redirected back to your specified URI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

..

   Let's assume we specified the following callback address.


.. code-block:: http

   https://example.com/callback

..

   A valid success response would be


.. code-block:: http

   https://example.com/callback#access_token=Vr17...amUa&token_type=bearer&expires_in=3600&state=867

After the user grants (or denies) access, the Agave Authorization service redirects the user to the ``redirect_uri``. If the user has granted access, the final URL will contain the following data parameters in the query string.


.. raw:: html

   <aside class="alert">Notice the token information is appended the the callback url as a URL <em>fragment</em>, not query parameters. This is important if you are manually parsing the callback response because the <span class="code">access_token</span> will not be available as a query parameter. You will need to either parse the fragment from the URL yourself, or use an URL library in your development language to handle it for you.</aside>



.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
               <th>Query parameter </th>
               <th>Value </th>
           </tr>
           <tr>
               <td>access_token </td>
               <td>An access token that can be provided in subsequent calls, for example to <a href="https://public.agaveapi.co/profiles/v2/me?pretty=true">Agave Profiles API</a>. </td>
           </tr>
           <tr>
               <td>token_type </td>
               <td>Value: "bearer" </td>
           </tr>
           <tr>
               <td>expires_in </td>
               <td>The time period (in seconds) for which the access token is valid. </td>
           </tr>
           <tr>
               <td>state </td>
               <td>The value of the <code>state</code> parameter supplied in the request. </td>
           </tr>
   </table>


If the user has denied access, there will be no access token and the final URL will have a query string containing the following parameters:

..

   A failed response would resemble something like


.. code-block:: bash

   https://example.com/callback?error=access_denied&state=867


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Query parameter 
   </th>
               <th>Value 
   </th>
           </tr>
           <tr>
               <td>error 
   </td>
               <td>The reason authorization failed, for example: “access_denied” </td>
           </tr>
           <tr>
               <td>state 
   </td>
               <td>The value of the state parameter supplied in the request. </td>
           </tr>
   </table>


4. Use the access token to access the Agave REST APIs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   curl -H "Authorization: Bearer 61e6...Mc96" https://public.tenants.agaveapi.co/profiles/v2/me?pretty=true

..

   The response would look something like this:


.. code-block:: json

   {
       "create_time": "20140905072223Z",
       "email": "nryan@mlb.com",
       "first_name": "Nolan",
       "full_name": "Nolan Ryan",
       "last_name": "Ryan",
       "mobile_phone": "(123) 456-7890",
       "phone": "(123) 456-7890",
       "status": "Active",
       "uid": 0,
       "username": "nryan"
   }

The access token allows you to make requests to any of the Agave REST APIs on behalf of the authenticated user.

Resource Owner Password Credentials
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The method is suitable for scenarios where there is a high degree of trust between the end-user and the client application. This could be a Desktop application, shell script, or server-to-server communication where user authorization is needed. This flow is described in :raw-html-m2r:`<a href="http://tools.ietf.org/html/rfc6749#section-4.4" title="RFC-6749">RFC-6749</a>`.

:raw-html-m2r:`<img src="../../images/Resource-Owner-Password-Flow.png" style="width:100%; height:auto;">`

1. Your application requests authorization
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   curl -sku "Authorization: Basic Qt3c...Rm1y="
       -d grant_type=password
       -d username=rjohnson
       -d password=password
       -d scope=PRODUCTION
       https://public.tenants.agaveapi.co/token

..

   The response would look something like this:


.. code-block:: json

   {
       "access_token": "3Dsr...pv21",
       "expires_in": 14400,
       "refresh_token": "dyVa...MqR0",
       "token_type": "bearer"
   }

The request is sent to the ``/token`` endpoint of the Agave Authentication service. The request will include the following parameters in the request body:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Request body parameter</th>
       <th align="left">Value</th>
     </tr><tr>
       <td>Grant_type</td>
       <td><i>Required.</i> Set it to "refresh_token"</td>
     <tr></tr>
       <td>username</td>
       <td><i>Required.</i> The username of an active API user</td>
     <tr></tr>
       <td>password</td>
       <td><i>Required.</i> The password of an active API user</td>
     <tr></tr>
       <td>scope</td>
       <td><i>Required.</i> A space-separated list of scopes. Currently only PRODUCTION is supported</td>
     </tr> 
   </table>


The header of this POST request must contain the following parameter:

.. list-table::
   :header-rows: 1

   * - Header parameter
     - Value
   * - Authorization
     - :raw-html-m2r:`<i>Required.</i>`\ Set it to "refresh_token"\ :raw-html-m2r:`<i>Required.</i>` Base 64 encoded string that contains the client ID and client secret key. The field must have the format: :raw-html-m2r:`<code>Authorization: Basic encoded client_id:client_secret></code>`. (\ :raw-html-m2r:`<i>This can also be achieved with curl using the `-u` option and specifying the raw colon separated client_id and client_secret.</i>`\ )



.. raw:: html

   <aside class="notice">It is not necessary for the username and password sent in the authorization request correspond to those of the client credentials owner, you can obtain an access token for any user provided you have their username and password. It is important to note that this flow should ***only*** be used in situations of high trust where no browser is available to handle the HTTP redirects required by the Authorization Code flow. Collecting and/or unnecessarily exposing user passwords is a violation of the Terms of Service and subject to immediate account revocation.</aside>


.. code-block:: bash

   https://example.com/callback?error=access_denied

If the user has not accepted your request or an error has occurred, the response query string contains an error parameter indicating the error that occurred during login. For example:

2. Use the access token to access the Agave REST APIs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   curl -H "Authorization: Bearer 3Dsr...pv21"
       https://public.tenants.agaveapi.co/profiles/v2/me?pretty=true

..

   The response would look something like this:


.. code-block:: json

   {
       "create_time": "20140905072223Z",
       "email": "rjohnson@mlb.com",
       "first_name": "Randy",
       "full_name": "Randy Johnson",
       "last_name": "Johnson",
       "mobile_phone": "(123) 456-7890",
       "phone": "(123) 456-7890",
       "status": "Active",
       "uid": 0,
       "username": "rjohnson"
   }

The access token allows you to make requests to any of the Agave REST APIs on behalf of the authenticated user.

3. Requesting access token from refresh token
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   curl -sku "Authorization: Basic Qt3c...Rm1y="
       -d grant_type=refresh_token
       -d refresh_token=dyVa...MqR0
       -d scope=PRODUCTION
       https://public.tenants.agaveapi.co/token

..

   The response would look something like this:


.. code-block:: json

   {
       "access_token": "8erF...NGly",
       "expires_in": 14400,
       "token_type": "bearer"
   }

Access tokens are deliberately set to expire after a short time, usually 4 hours, after which new tokens may be granted by supplying the refresh token obtained during original request.

The request is sent to the token endpoint of the Agave Authorization service. The body of this POST request must contain the following parameters:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Request body parameter</th>
               <th>Value</th>
           </tr>
           <tr>
               <td>grant_type</td>
               <td><i>Required.</i> Set it to "refresh_token". 
   refresh_token </td>
           </tr>
           <tr>
               <td>refresh_token</td>
               <td><i>Required.</i> The refresh token returned from the authorization code exchange.</td>
           </tr>
           <tr>
               <td>scope</td>
               <td>Required. A space-separated list of scopes. <i>Required.</i> Currently only PRODUCTION is supported.</td>
           </tr>
   </table>


Client Credentials
^^^^^^^^^^^^^^^^^^

The method is suitable for authenticating your requests to the Agave REST API. This flow is described in :raw-html-m2r:`<a href="http://tools.ietf.org/html/rfc6749#section-4.4" title="RFC-6749">RFC-6749</a>`.

:raw-html-m2r:`<img src="../../images/Client-Credentials-Flow.png" style="width:100%; height:auto;">`

1. Your application requests authorization
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   curl -sku "Authorization: Basic Qt3c...Rm1y="
       -d grant_type=client_credentials
       -d scope=PRODUCTION
       https://public.tenants.agaveapi.co/token

..

   The response would look something like this:


.. code-block:: json

   {
       "access_token": "61e6...Mc96",
       "expires_in": 14400,
       "token_type": "bearer"
   }

The request is sent to the ``/token`` endpoint of the Agave Authentication service. The request must include the following parameters in the request body:


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
           <tr>
               <th>Request body parameter</th>
               <th>Value</th>
           </tr>
           <tr>
               <td>grant_type</td>
               <td><i>Required.</i> Set it to "client_credentials".</td>
           </tr>
           <tr>
               <td>scope</td>
               <td><i>Optional.</i> A space-separated list of scopes. Currently on PRODUCTION is supported.</td>
           </tr>
   </table>


2. Use the access token to access the Agave REST APIs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   curl -H "Authorization: Bearer 61e6...Mc96"
        https://public.tenants.agaveapi.co/profiles/v2/me

..

   The response would look something like this:


.. code-block:: json

   {
       "email": "nryan@mlb.com",
       "firstName" : "Nolan",
       "lastName" : "Ryan",
       "position" : "null",
       "institution" : "Houston Astros",
       "phone": "(123) 456-7890",
       "fax" : null,
       "researchArea" : null,
       "department" : null,
       "city" : "Houston",
       "state" : "TX",
       "country" : "USA",
       "gender" : "M",
       "_links" : {
         "self" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/nryan"
         },
         "users" : {
           "href" : "https://public.tenants.agaveapi.co/profiles/v2/nryan/users"
         }
       }
   }

The access token allows you to make requests to any of the Agave REST APIs on behalf of the authenticated user.
