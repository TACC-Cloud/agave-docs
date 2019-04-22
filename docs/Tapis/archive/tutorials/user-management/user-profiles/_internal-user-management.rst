.. role:: raw-html-m2r(raw)
   :format: html


Historically many gateways providing access to HPC resources have utilized a single, shared community account through which all compute and storage activity is performed. This has several advantages, not the least of which is significantly reduced complexity in the back end infrastructure of the gateway.

While convenient for the gateway developers, this approach was not sustainable for the gateway owners because aggregate usage by all the gateway users quickly outgrew the resources available under a single community account.

The result was that gateways would experience an initial surge of new users followed by a plateau, then an oscillating cycle of usage and inactivity that was always bound by the total compute and storage resources available to the community account.

The gateways that successfully navigated this obstacle did so by implementing a mechanism where users could provide their own storage and compute accounts that the gateway would use on their behalf, thereby reducing demand on the community account resources while still reaping the full benefit of the gateway.

Tapis (Agave) supports each of these scenarios through its concept of Internal Users. An internal user is a profile object similar to those described by the Profiles service, but localized to a single user account. That is to say, if our tutorial example user, nryan, creates an internal user named bgibson, then bgibson will only be visible to nryan and not to any other user.

If you plan to take advantage of the Files, Systems, or Jobs services, you can assign authentication credentials for internal users on each system. When you authenticate to those services, the service will use the credentials of the internal user attached to the authentication token rather than the default account. This allows you to leverage both community and individual accounts through your application. :raw-html-m2r:`<aside class="notice">For more information on how to attach internal user identities to authentication tokens, see the <a title="Authentication Tutorial" href="http://agaveapi.co/authentication-tutorial/">Authentication Tutorial</a>.</aside>`\ [title size="3"]Creating a new interal user[/title]Creating a new internal user is done by posting to the internal users collection. Internal users have several preset fields, most of which are optional. The only required fields are username and email address. Usernames must be unique within the context of your application. An example of creating a new internal user is given below. :raw-html-m2r:`<code class="docutils literal"><span class="pre">shellcurl -sk -H "Authorization: Bearer de32225c235cf47b9965997270a1496c" -X POST --data "{'username':'bgibson', 'email':'bgibson@dodgers.com'}" https://public.tenants.agaveapi.co/profiles/v2/nryan/users&#96;&#96;&#96;&#96;&#96;&#96;shell{
   "status":"success",
   "message":null,
   "version":"2.1.8-SNAPSHOT-r8236",
   "result":[
      {
         "status":"active",
         "city":null,
         "country":"United States",
         "createdBy":"nryan",
         "department":null,
         "email":"bgibson@dodgers.com",
         "fax":null,
         "firstName":null,
         "gender":"",
         "institution":null,
         "lastName":null,
         "phone":null,
         "position":null,
         "researchArea":null,
         "state":null,
         "username":"bgibson",
         "_links":{
            "profile":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan"
            },
            "self":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan/users/bgibson"
            }
         }
      }
   ]
}</span></code>`

[title size="3"]Updating an internal user[/title] Updating the user later on is done by posting to the "self" link in the response snippet.\ :raw-html-m2r:`<code class="docutils literal"><span class="pre">shellcurl -sk -H "Authorization: Bearer de32225c235cf47b9965997270a1496c" -X POST --data "{'username':'bgibson', 'email':'bgibson@dodgers.com', 'firstName':'Bob', 'lastName':'Gibson', 'position': 'pitcher'}" https://public.tenants.agaveapi.co/profiles/v2/nryan/users/bgibson&#96;&#96;&#96;&#96;&#96;&#96;shell{
   "status":"success",
   "message":null,
   "version":"2.1.8-SNAPSHOT-r8236",
   "result":[
      {
         "status":"active",
         "city":null,
         "country":null,
         "createdBy":"nryan",
         "department":null,
         "email":"bgibson@dodgers.com",
         "fax":null,
         "firstName":"Bob",
         "gender":"",
         "institution":null,
         "lastName":"Gibson",
         "phone":null,
         "position":"pitcher",
         "researchArea":null,
         "state":null,
         "username":"bgibson",
         "_links":{
            "profile":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan"
            },
            "self":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan/users/bgibson"
            }
         }
      }
   ]
}</span></code>`

[title size="3"]Creating a new interal user[/title] A list of internal users can be obtained by querying the internal user collection. :raw-html-m2r:`<code class="docutils literal"><span class="pre">shellcurl -sk -H "Authorization: Bearer de32225c235cf47b9965997270a1496c" https://public.tenants.agaveapi.co/profiles/v2/nryan/users&#96;&#96;&#96;&#96;&#96;&#96;shell{
   "status":"success",
   "message":null,
   "version":"2.1.8-SNAPSHOT-r8236",
   "result":[
      {
         "status":"active",
         "city":null,
         "country":null,
         "createdBy":"nryan",
         "department":null,
         "email":"bgibson@dodgers.com",
         "fax":null,
         "firstName":"Bob",
         "gender":"",
         "institution":null,
         "lastName":"Gibson",
         "phone":null,
         "position":"pitcher",
         "researchArea":null,
         "state":null,
         "username":"bgibson",
         "_links":{
            "profile":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan"
            },
            "self":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan/users/bgibson"
            }
         }
      },
      {
         "status":"active",
         "city":null,
         "country":null,
         "createdBy":"nryan",
         "department":null,
         "email":"spaige@dodgers.com",
         "fax":null,
         "firstName":"Satchel",
         "gender":"",
         "institution":null,
         "lastName":"Paige",
         "phone":null,
         "position":"pitcher",
         "researchArea":null,
         "state":null,
         "username":"spaige",
         "_links":{
            "profile":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan"
            },
            "self":{
               "href":"https://public.tenants.agaveapi.co/profiles/v2/nryan/users/spaige"
            }
         }
      }
   ]
}</span></code>`

[title size="3"]Deleting an internal user[/title] Deleting an internal user is done by invoking a DELETE action on the any of the internal user "self" links from their json representations. :raw-html-m2r:`<code class="docutils literal"><span class="pre">shellcurl -sk -H "Authorization: Bearer de32225c235cf47b9965997270a1496c" -X DELETEhttps://public.tenants.agaveapi.co/profiles/v2/nryan/users/spaige&#96;&#96;&#96;&#96;&#96;&#96;shell{
   "message":"",
   "result":null,
   "status":"success",
   "version":"2.1.8-SNAPSHOT-r8236"
}</span></code>`


.. raw:: html

   <alert class="alert-warning">Note that after deleting an internal user, the record of the internal user is still present, however the entity will have its status set to "deleted" and all data associated with the user will be removed. Once deleted, internal users cannot be reactivated. This is due to conflicts that could arise when generating accounting records between accounts who share a common username.</alert>

