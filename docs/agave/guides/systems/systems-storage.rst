.. role:: raw-html-m2r(raw)
   :format: html


Storage systems
===============

A storage systems can be thought of as an individual data repository that you want to access through Tapis (Agave). The following JSON object shows how a basic storage systems is described.

.. code-block:: json

   {
      "id":"sftp.storage.example.com",
      "name":"Example SFTP Storage System",
      "type":"STORAGE",
      "description":"My example storage system using SFTP to store data for testing",
      "storage":{
         "host":"storage.example.com",
         "port":22,
         "protocol":"SFTP",
         "rootDir":"/",
         "homeDir":"/home/systest",
         "auth":{
            "username":"systest",
            "password":"changeit",
            "type":"PASSWORD"
         }
      }
   }

The first four attributes are common to both storage and execution systems. The ``storage`` attribute describes the connectivity and authentication information needed to connect to the remote system. Here we describe a SFTP server accessible on ``port`` 22 at ``host`` storage.example.com. We specify that we want the ``rootDir``\ , or virtual system root exposed through Tapis (Agave), to be the system's physical root directory, and we want the authenticated user's home directory to be the ``homeDir``\ , or virtual home directory and base of all relative paths given to Agave. Finally, we tell Tapis (Agave) to use password based authentication and provided the necessary credentials.

This example is given as a simple illustration of how to describe a systems for use by Tapis (Agave). In most situations you should **NOT** provide your username and password. In fact, if you are using a compute or storage systems from your university or government-funded labs it is, at best, against the user agreement and, at worst, illegal to give your password to a third party service such as Tapis (Agave). In these situations, use one of the many other authentication options such as SSH keys, X509 authentication, or a 3rd party authentication service like the MyProxy Gateway.

The full list of storage system attributes is described in the following table.


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
               <td>available</td>
               <td>boolean</td>
               <td>Whether the system is currently available for use in the API. Unavailable systems will not be visible to anyone but the owner. This differs from the `status` attribute in that a system may be UP, but not available for use in Tapis (Agave). Defaults to true</td>
           </tr>
           <tr>
               <td>description</td>
               <td>string</td>
               <td>Verbose description of this system.</td>
           </tr>
           <tr>
               <td>id</td>
               <td>string </td>
               <td><b>Required:</b> A unique identifier you assign to the system. A system id must be globally unique across a tenant and cannot be reused once deleted. </td>
           </tr>
           <tr>
               <td>name</td>
               <td>string</td>
               <td><b>Required:</b> Common display name for this system.</td>
           </tr>
           <tr>
               <td>site</td>
               <td>string</td>
               <td>The site associated with this system. Primarily for logical grouping.</td>
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
               <td><b>Required:</b> Must be STORAGE.</td>
           </tr>
       </tbody>
   </table>
|

Supported data and authentication protocols
-------------------------------------------

The example above described a system accessible by SFTP. Tapis (Agave) supports many different data and authentication protocols for interacting with your data. Sample configurations for many protocol combinations are given below.


.. raw:: html

   <select id="storage-config-selector" name="storage-config-selector" onChange="$('.storage-config').addClass('hidden'); $('#' + $(this).val()).removeClass('hidden');">
       <option value="sftp-password">SFTP</option>
       <option value="sftp-sshkeys">SFTP w/ SSH Keys</option>
       <option value="sftp-tunnel">SFTP w/ tunnel</option>
       <option value="irods">IRODSv3</option>
       <option value="irods-pam">IRODSv3 w/ PAM</option>
       <option value="irods-myproxy">IRODSv3 w/ MyProxy</option>
       <option value="irods4">IRODSv4</option>
       <option value="gridftp">GridFTP</option>
       <option value="gridftp-myproxy">GridFTP w/ MyProxy</option>
       <option value="gridftp-mpg">GridFTP w/ MyProxy Gateway</option>
       <option value="s3">Amazon S3</option>
       <option value="local">Local</option>
   </select>


Sample storage system definition with each supported data protocol and authentication configuration.


.. raw:: html

   <pre id="sftp-password" class="json storage-config" style="white-space:pre-wrap;">
   {
      "id":"sftp.storage.example.com",
      "name":"Example SFTP Storage System",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using SFTP to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"storage.example.com",
         "port":22,
         "protocol":"SFTP",
         "rootDir":"/",
         "homeDir":"/home/systest",
         "auth":{
            "username":"systest",
            "password":"changeit",
            "type":"PASSWORD"
         }
      }
   }
   </pre>



.. raw:: html

   <pre id="sftp-sshkeys" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"sftp.storage.example.com",
      "name":"Example SFTP Storage Host",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using SFTP to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"texas.rangers.mlb.com",
         "port":22,
         "protocol":"SFTP",
         "rootDir":"/",
         "homeDir":"/home/nryan",
         "auth":{
            "username":"nryan",
            "publicKey": "ssh-rsa AAAAB3NzaC1yc2EBBAADAQABMQPRgQChJ6bzejqSuJdTi+VwMif8qotuSSlYwrVt0EWVduKZHpzOnS1zlknAyYXmQQFcaJ+vNAQayVMTqv+A+1lzxppTdgZ0Dn42EOYWRa6B/IEMPzDuKb7F0qNFiH9m+OZJDYdIWS1rlN1oK32jHUi0xV8kM3KOLf2TIjDBUyZRpMGyQ== Generated by Nova",
            "privateKey": "-----BEGIN RSA PRIVATE KEY-----nMIVCXAIBAAKBgQRhJ6bzejqSuJdTi+VwMif8qoyuSSlYwrVt0EWVduKZHpzOnSManlknAyYXmQQFcaJ+vNAQayVqTqv+A+1lzxppTdgZ0Dn42EOYWRa6B/IEMPzDuKb7Fn0uNFiH9x+OZJDYdIWS1rN1oK4DjHUi0xV8kMN3OPSIU23asx1UyZRpMGyQIDAQABnAoGATrW4NAkJ3Kltt6+HQ1Ir95sxFNrE6AZJaLYllke3iwPJpCX1dDdpDcXa8AGbVnjFXJUGA+dPrJqbyGCHA7E3H342837k/twSRGkcCNpRx/MMdWnw3asea/K5L4XVeunXAn79vo/e28D4Uue62dSwIvDJKIFWMSAgUoD53ImushqlLUCQQDPkObaowzkboLCnv3Nyj16KFZ5Lp7r5q5MYfRxO7t53Z7AWoflr++KrAT3UbSKtqmC68CqbPzxSd6qHnbnkWaD0HAkEAxsJZh7xorwAtdYznMFOsO0w5HDHOB7MuAnjwUvYZVaM0wA7HkE4rnH5SFAwEMlwx82OJxv83CnkRdlXOexn95rwJBALd8cnboGCd/AZzCvX2R+5K5lZtvnhLvczkWho3qrcoG/aUw4l1K78h4VFOFKMJOwv53BXQisF9kW6+qY3/XM49UCQHqDn4AYQOALvPBZCdVtPqFGg6W8csCAE7a5ud8zbj8A+6swcEB0+YcyEkvzID8en1ekmno/ET1wwRnhH6g/tdJlcCQM55QS4Z7rR4psgFDkFvA+wmxlqTGsXJD32sw15g4A0bmzSXnbfFg8TBAjGTDW7l0P8prFrtQ8Wml14390b29l1ptAyE=n-----END RSA PRIVATE KEY-----",
            "type": "SSHKEYS"
         }
      }
   }
   </pre>



.. raw:: html

   <pre id="sftp-tunnel" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"sftp.storage.example.com",
      "name":"Example SFTP Tunnel Storage Host",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using SFTP via an ssh tunnel to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"storage.example.com",
         "port":22,
         "protocol":"SFTP",
         "rootDir":"/",
         "homeDir":"/home/nryan",
         "auth":{
            "username":"systest",
            "password":"changeit",
            "type":"PASSWORD"
         },
         "proxy":{
            "name":"My gateway proxy server",
            "host":"proxy.example.com",
            "port":22
         }
      }
   }
   </pre>



.. raw:: html

   <pre id="irods" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"irods.storage.example.com",
      "name":"Example IRODS Storage Host",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using IRODS to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"storage.example.com",
         "port":1247,
         "protocol":"IRODS",
         "homeDir":"/systest",
         "rootDir":"/demoZone/home",
         "auth":{
            "username":"systest",
            "password":"changeit",
            "type":"PASSWORD"
         },
         "resource":"demoResc",
         "zone":"demoZone"
      }
   }
   </pre>



.. raw:: html

   <pre id="irods-pam" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"irods.storage.example.com",
      "name":"Example IRODS Storage Host",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using IRODS with PAM authentication to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"storage.example.com",
         "port":1247,
         "protocol":"IRODS",
         "homeDir":"/systest",
         "rootDir":"/demoZone/home",
         "auth":{
            "username":"systest",
            "password":"changeit",
            "type":"PAM"
         },
         "resource":"demoResc",
         "zone":"demoZone"
      }
   }
   </pre>



.. raw:: html

   <pre id="irods-myproxy" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"irods.storage.example.com",
      "name":"Example IRODS Storage Host",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using IRODS to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"storage.example.com",
         "port":1247,
         "protocol":"IRODS",
         "homeDir":"/systest",
         "rootDir":"/demoZone/home",
         "auth":{
            "username":"systest",
            "password":"changeit",
            "type":"X509",
            "server":{
               "name":"IRODS MyProxy Server",
               "endpoint":"myproxy.example.com",
               "port":7512,
               "protocol":"MYPROXY"
            }
         },
         "resource":"demoResc",
         "zone":"demoZone"
      }
   }
   </pre>



.. raw:: html

   <pre id="irods4" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"irods.storage.example.com",
      "name":"Example IRODS Storage Host",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using IRODS to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"storage.example.com",
         "port":1247,
         "protocol":"IRODS4",
         "homeDir":"/systest",
         "rootDir":"/demoZone/home",
         "auth":{
            "username":"systest",
            "password":"changeit",
            "type":"PASSWORD"
         },
         "resource":"demoResc",
         "zone":"demoZone"
      }
   }
   </pre>



.. raw:: html

   <pre id="gridftp" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
     "id": "demo.storage.example.com",
     "name": "Demo GRIDFTP demo vm",
     "status": "UP",
     "type": "STORAGE",
     "description": "My example storage system using GridFTP to store data for testing",
     "site": "example.com",
     "storage": {
       "host": "gridftp.example.com",
       "port": 2811,
       "protocol": "GRIDFTP",
       "rootDir": "/",
       "homeDir": "/home/systest",
       "auth": {
         "credential": "-----BEGIN CERTIFICATE-----nMIIDqjCCApKgAwIBAgIDJSFGMA0GCSqGSIb3DQEBBQUAMHsxCzAJBgNVBAYTAlVTnMTgwNgYDVQQKEy9OYXRpb25hbCBDZW50ZXIgZm9yIFN1cGVyY29tcHV0aW5nIEFwncGxpY2F0aW9uczEgMB4GA1UECxMXQ2VydGlmaWNhdGUgQXV0aG9yaXRpZXMxEDAOnBgNVBAMTB015UHJveHkwHhcNMTMxMDE0MDcyMjE4WhcNMTMxMDE0MTkyNzE4WjBnnMQswCQYDVQQGEwJVUzE4MDYGA1UEChMvTmF0aW9uYWwgQ2VudGVyIGZvciBTdXBlncmNvbXB1dGluZyBBcHBsaWNhdGlvbnMxHjAcBgNVBAMTFWlwbGFudCBDb21tdW5pndHkgVXNlcjCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAwfHbmtmJ1OUVwgDdn5oA8EsqihwRAi2xhZJYG/FFmOs38+0y7wTfORhVX/79XQMD3NqRJN8xhHQpmuoRynH9l9sbA9gbKaQsrpIYyExygrJ+qaZY0PccD+VAyPDjdLD86316AzWltEdV2E9b+OnCVioz62esJWSqOho8wya4Vo5svUCAwEAAaOBzjCByzAOBgNVHQ8BAf8EBAMCBLAwnHQYDVR0OBBYEFIJXT/jYmxaRywDbZudb1EXbxla5MB8GA1UdIwQYMBaAFNf8pQJ2nOvYT+iuh4OZQNccjx3tRMAwGA1UdEwEB/wQCMAAwNAYDVR0gBC0wKzAMBgorBgEEnAaQ+ZAIFMAwGCiqGSIb3TAUCAgMwDQYLKoZIhvdMBQIDAgEwNQYDVR0fBC4wLDAqnoCigJoYkaHR0cDovL2NhLm5jc2EudWl1Yy5lZHUvZjJlODlmZTMuY3JsMA0GCSqGnSIb3DQEBBQUAA4IBAQBDyW3FJ0xEIXEqk2NtiMqOM99MgufDPL0bxrR8CvPY5GRNn58EXU8RnSSJIuxL95PKclRPPOhGdB48eeF2H1MusOEUEEnHwzrZ1OUFUEpwKuqG6n0h411l3niRRx9wdJL4YITzAWZwpadzwj3d8aO9O/ttVJjGRc8A93I/d3fFAvHyvKnmlEaDrQZNBp1EtClW8xuxsfeUmyXkFlkRiKwqjkJGB8xBuzr8DfLomWq/mXaOkHznCo9nQxAs3gntszLOh+8U9aMxaeCsychRWxG3Y6Z33hrE0yz4AaVonVXu3Z7M+EN+nKbSVRblAzeKfQYYDOgsoFrugYbR9klv1so3Dt+n6n-----END CERTIFICATE-----n-----BEGIN RSA PRIVATE KEY-----nMIICWwIBAAKBgQDB8dua2YnU5RXCAN3mgDwSyqKHBECLbGFklgb8UWY6zfz7TLvBnN85GFVf/v1dAwPc2pEk3zGEdCma6hHIf2X2xsD2BsppCyukhjITHKCsn6ppljQ9xnwP5UDI8ON0sPzrfXoDNaW0R1XYT1v44JWKjPrZ6wlZKo6GjzDJrhWjmy9QIDAQABnAoGAcjrJZYMLM2FaV1G7YK/Wshq3b16JxZSoKF5U7vfihnAcuMaRL1R3IcAgfHlunIq2E7aIFnd+6sygVKXYo4alv5denekiucvKAyXK9F/VTTtLtajUnrvekLvSycKiEnbN9IgQ0ABCnlWyjgQMf64UUYBQtvU+lbRCs4jbuHxuyn5WECQQD8fJhlBHgA49hjnZBKnU9Xb+LEKhWDCEyIiOMMGY+2XhrGVvGF5KqJVusZEv8lbXNjzgSQFgLohEXVzn9v8tDFMzAkEAxKS5qCYHsTfgPlw3l1DLJRmG3SXrpevXSccBGpXQiUne9gfc9mlgnVTr5QQCXvvI673Y2LnNcnd94KEgvSrzhNwJACeS38/1g1mgXKo3ZTUUztBLinQ7sn463sQHsI6U8xGCbm/n8LMrxA8CsJadg6A6J3vdLpnm2U3YbZm1mqVhGNkQJAdsxxnoUVAdm8kWWhK6W6VG9e9I1OqdrXxfY/tecsyjg6D1a1Qb8mfuj4DoaKjCme69To8nZ3moZXRBWkypzYQopwJAB/zr1UpFz6vY4sIm3Gw3ll/ruNGCr2dzjTyLSGglCOf0nUljJ1FGLyW647JzGPMLcfdb0iEexzCEii9YUFUN1Ow==n-----END RSA PRIVATE KEY-----",
         "type": "X509"
       }
     }
   }
   </pre>



.. raw:: html

   <pre id="gridftp-myproxy" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
     "id": "demo.storage.example.com",
     "name": "Demo GRIDFTP + MyProxy Storage System",
     "status": "UP",
     "type": "STORAGE",
     "description": "My example storage system using GridFTP with MyProxy to store data for testing",
     "site": "example.com",
     "storage": {
       "host": "gridftp.example.com",
       "port": 2811,
       "protocol": "GRIDFTP",
       "rootDir": "/",
       "homeDir": "/home/systest",
       "auth": {
         "username": "systest",
         "password": "changeit",
         "type": "X509",
         "server": {
           "name": "XSEDE MyProxy Server",
           "endpoint": "myproxy.example.com",
           "port": 7512,
           "protocol": "MYPROXY"
         }
       }
     }
   }
   </pre>



.. raw:: html

   <pre id="gridftp-mpg" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
     "id": "demo.storage.example.com",
     "name": "Demo GRIDFTP + MyProxy Storage System",
     "status": "UP",
     "type": "STORAGE",
     "description": "My example storage system using GridFTP with MyProxy to store data for testing",
     "site": "example.com",
     "storage": {
       "host": "gridftp.example.com",
       "port": 2811,
       "protocol": "GRIDFTP",
       "rootDir": "/",
       "homeDir": "/home/systest",
       "auth": {
         "type": "X509",
         "server": {
           "name": "My Trusted MPG Server",
           "endpoint": "https://api.example.com/myproxy/v2/",
           "port": 443,
           "protocol": "MPG"
         }
       }
     }
   }
   </pre>



.. raw:: html

   <pre id="s3" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"demo.storage.example.com",
      "name":"Example Amazon S3 Storage System",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using Amazon S3 to store data for testing",
      "site":"aws.amazon.com",
      "storage":{
         "host": "s3-website-us-east-1.amazonaws.com",
         "port": 443,
         "protocol": "S3",
         "homeDir": "/",
         "rootDir": "/",
         "container": "mybucket",
         "auth": {
             "publicKey": "AKCA...1RCF",
             "privateKey": "8xj3...g/4+",
             "type": "APIKEYS"
         }
      }
   }
   </pre>



.. raw:: html

   <pre id="local" class="json storage-config hidden" style="white-space:pre-wrap; word-wrap:break-word;">
   {
      "id":"local.storage.example.com",
      "name":"Example LOCAL Storage Host",
      "status":"UP",
      "type":"STORAGE",
      "description":"My example storage system using the local file system to store data for testing",
      "site":"example.com",
      "storage":{
         "host":"localhost",
         "protocol":"LOCAL",
         "rootDir":"/",
         "homeDir":"/home/systest"
      }
   }
   </pre>


In each of the examples above, the ``storage`` objects were slightly different, each unique to the protocol used. Descriptions of every attribute in the ``storage``\ > object and its children are given in the following tables.

``storage`` attributes give basic connectivity information describing things like how to connect to the system and on what port.


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
               <td><b>Required:</b> A JSON object describing the default authentication credential for this system.</td>
           </tr>
           <tr>
               <td>container</td>
               <td>string</td>
               <td>The container to use when interacting with an object store. Specifying a container provides isolation when exposing your cloud storage accounts so users do not have access to your entire storage account. This should be used in combination with delegated cloud credentials such as an AWS IAM user credential.</td>
           </tr>
           <tr>
               <td>homeDir</td>
               <td>string</td>
               <td>The path on the remote system, relative to <code>rootDir</code> to use as the virtual home directory for all API requests. This will be the base of any requested paths that do not being with a '/'. Defaults to '/', thus being equivalent to <code>rootDir</code>.</td>
           </tr>
           <tr>
               <td>host</td>
               <td>string</td>
               <td><b>Required:</b> The hostname or ip address of the storage server</td>
           </tr>
           <tr>
               <td>port</td>
               <td>int</td>
               <td><b>Required:</b> The port number of the storage server.</td>
           </tr>
           <tr>
               <td>mirror</td>
               <td>boolean</td>
               <td>Whether the permissions set on the server should be pushed to the storage system itself. Currently, this only applies to IRODS systems.</td>
           </tr>
           <tr>
               <td>protocol</td>
               <td>FTP, GRIDFTP, IRODS, IRODS4, LOCAL, S3, SFTP</td>
               <td><b>Required:</b> The protocol used to authenticate to the storage server.</td>
           </tr>
           <tr>
               <td>publicAppsDir</td>
               <td>string</td>
               <td>The path on the remote system where apps will be stored if this system is used as the default public storage system.</td>
           </tr>
           <tr>
               <td>proxy</td>
               <td>JSON Object</td>
               <td>The proxy server through with Tapis (Agave) will tunnel when submitting jobs. Currently proxy servers will use the same authentication mechanism as the target server.</td>
           </tr>
           <tr>
               <td>resource</td>
               <td>string</td>
               <td>The name of the default resource to use when defining an IRODS system.</td>
           </tr>
           <tr>
               <td>rootDir</td>
               <td>string</td>
               <td>The path on the remote system to use as the virtual root directory for all API requests. Defaults to '/'.</td>
           </tr>
           <tr>
               <td>zone</td>
               <td>string</td>
               <td>The name of the default zone to use when defining an IRODS system.</td>
           </tr>
       </tbody>
   </table>
|

``storage.auth`` attributes give authentication information describing how to authenticate to the system specified in the ``storage`` config above.


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
               <td>credential</td>
               <td>string</td>
               <td>The credential used to authenticate to the remote system. Depending on the authentication protocol of the remote system, this could be an OAuth Token, X.509 certificate.</td>
           </tr>
           <tr>
               <td>internalUsername</td>
               <td>string</td>
               <td>The username of the internal user associated with this credential.</td>
           </tr>
           <tr>
               <td>password</td>
               <td>string</td>
               <td>The password on the remote system used to authenticate.</td>
           </tr>
           <tr>
               <td>privateKey</td>
               <td>string</td>
               <td>The private ssh key used to authenticate to the remote system.</td>
           </tr>
           <tr>
               <td>publicKey</td>
               <td>string</td>
               <td>The public ssh key used to authenticate to the remote system.</td>
           </tr>
           <tr>
               <td>server</td>
               <td>JSON object</td>
               <td>A JSON object describing the authentication server from which a valid credential may be obtained. Currently only  auth type X509 supports this attribute.</td>
           </tr>
           <tr>
               <td>type</td>
               <td>APIKEYS, LOCAL, PAM, PASSWORD, SSHKEYS, or X509</td>
               <td><b>Required:</b> The path on the remote system where apps will be stored if this system is used as the default public storage system.</td>
           </tr>
           <tr>
               <td>username</td>
               <td>string</td>
               <td>The remote username used to authenticate.</td>
           </tr>
       </tbody>
   </table>
|

``storage.auth.server`` attributes give information about how to obtain a credential that can be used in the authentication process. Currently only systems using the X509 authentication can leverage this feature to communicate with :raw-html-m2r:`<a href="http://grid.ncsa.illinois.edu/myproxy/" title="MyProxy Server" target="_blank">MyProxy</a>` and :raw-html-m2r:`<a href="https://bitbucket.org/taccaci/myproxy-gateway" title="MyProxy Gateway" target="_blank">MyProxy Gateway</a>` servers.


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
               <td>name</td>
               <td>string</td>
               <td>A descriptive name given to the credential server</td>
           </tr>
           <tr>
               <td>endpoint</td>
               <td>string</td>
               <td><b>Required:</b> The endpoint of the authentication server.</td>
           </tr>
           <tr>
               <td>port</td>
               <td>integer</td>
               <td><b>Required:</b> The port on which to connect to the server.</td>
           </tr>
           <tr>
               <td>protocol</td>
               <td>MPG, MYPROXY</td>
               <td><b>Required:</b> The protocol with which to obtain an authentication credential.</td>
           </tr>
       </tbody>
   </table>
|

``system.proxy`` configuration attributes give information about how to connect to a remote system through a proxy server. This often happens when the target system is behind a firewall or resides on a NAT. Currently proxy servers can only reuse the authentication configuration provided by the target system.


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
               <td>name</td>
               <td>string</td>
               <td><b>Required:</b> A descriptive name given to the proxy server.</td>
           </tr>
           <tr>
               <td>host</td>
               <td>string</td>
               <td><b>Required:</b> The hostname of the proxy server.</td>
           </tr>
           <tr>
               <td>port</td>
               <td>integer</td>
               <td><b>Required:</b> The port on which to connect to the proxy server. If null, the port in the parent storage config is used.</td>
           </tr>
       </tbody>
   </table>
|

If you have not yet set up a system of your own, now is a good time to grab a sandbox system to use while you follow along with the rest of this tutorial.

Creating a new storage system
-----------------------------

.. code-block:: plaintext

   systems-addupdate -v -F sftp-password.json

.. container:: foldable

     .. container:: header

        :fa:`caret-right`
        **Show curl**

     .. code-block:: shell

      curl -sk -H "Authorization: Bearer $ACCESS_TOKEN" -F "fileToUpload=@sftp-password.json" https://api.tacc.utexas.edu/systems/v2
|


The response from the service will be similar to the following:

.. code-block:: json

   {
     "site": null,
     "id": "sftp.storage.example.com",
     "revision": 1,
     "default": false,
     "lastModified": "2016-09-06T17:46:42.621-05:00",
     "status": "UP",
     "description": "My example storage system using SFTP to store data for testing",
     "name": "Example SFTP Storage System",
     "owner": "nryan",
     "globalDefault": false,
     "available": true,
     "uuid": "4036169328045649434-242ac117-0001-006",
     "public": false,
     "type": "STORAGE",
     "storage": {
       "mirror": false,
       "port": 22,
       "homeDir": "/home/systest",
       "protocol": "SFTP",
       "host": "storage.example.com",
       "publicAppsDir": null,
       "proxy": null,
       "rootDir": "/",
       "auth": {
         "type": "PASSWORD"
       }
     },
     "_links": {
       "roles": {
         "href": "https://api.tacc.utexas.edu/systems/v2/sftp.storage.example.com/roles"
       },
       "owner": {
         "href": "https://api.tacc.utexas.edu/profiles/v2/nryan"
       },
       "credentials": {
         "href": "https://api.tacc.utexas.edu/systems/v2/sftp.storage.example.com/credentials"
       },
       "self": {
         "href": "https://api.tacc.utexas.edu/systems/v2/sftp.storage.example.com"
       },
       "metadata": {
         "href": "https://api.tacc.utexas.edu/meta/v2/data/?q=%7B%22associationIds%22%3A%224036169328045649434-242ac117-0001-006%22%7D"
       }
     }
   }

Congratulations, you just added your first system. This storage system can now be used by the :raw-html-m2r:`<a title="File Management" href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/files/introduction.html">Files service</a>` to manage data, the Transfer service as a source or destination of data movement, the Apps service as a application repository, and the :raw-html-m2r:`<a title="Job Submission" href="https://tacc-cloud.readthedocs.io/projects/agave/en/latest/agave/guides/jobs/introduction.html">Jobs Service</a>` as both a staging and archiving destination.

Notice that the JSON returned from the Systems service is different than what was submitted. Several fields have been added, and several other have been removed. On line 3, the UUID of the system has been added. This is the same UUID that is used in notifications and metadata references. On line 5, the ``status`` value was added in and assigned a default value since we did not specify it. Ditto for the ``site`` attribute on line 8.

Three new fields were added on lines 9-11. ``revision`` is the number of times this system has been updated. This being our first time registering the system, it is set to :raw-html-m2r:`<em>1</em>`. ``public`` tells whether this system is published as a shared resource for all users. We will cover this more in the section on System scope. ``lastModified`` is a timestamp of the last time the system was updated.

In the ``storage`` object, the ``publicAppsDir`` and ``mirror`` fields were both added and set to their default values. In this example we are not using a ``proxy`` server, so it was defaulted to :raw-html-m2r:`<em>null</em>`. Last, and most important, all authentication information has been omitted from the response object. Regardless of the authentication type, no user credential information will ever be returned once they are stored.
