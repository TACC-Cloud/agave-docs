.. role:: raw-html-m2r(raw)
   :format: html


Non-members: Creating a storage system
=========================
.. raw:: html

**Prerequisites**:
    #. You have a TACC account and email
    #. You already have a host on the public internet to use
    #. You have an Oauth client
    #. You have an access token



**Instructions**:
Create your RSA key pair from your local terminal:

    ssh-keygen -m PEM -t rsa -b 4096 -C "<your_tacc_email>"



Copy your newly created RSA public key to your destination host:

    ssh-copy-id -i ~/.ssh/authorized_keys/<public key file> <your_tacc_username>@<host_on_public_internet>



SSH into your host (make sure it doesn't ask you for credentials anymore)

    ssh -i ~/.ssh/authorized_keys/<private key file> <your_tacc_username>@<host_on_public_internet>

    exit



Create a file named <storage_name>-storage-ext.json in your home directory

Populate it with the following and replace the bold text with the respective information:

{

   "id": "**<storage_name>**-storage-ext-01",

   "name": "System Configured as Storage System",

   "status":"UP",

   "type":"STORAGE",

   "description":"creating a Storage System for …",

   "site":"tacc.cloud",

   "default":"true",

   "storage":{

      "host":"**<host_on_public_internet>**",

      "port":"22",

      "protocol":"SFTP",

      "rootDir":"/",

      "homeDir":"/home/**<your_tacc_username>**",

      "auth":{

         "username":"**<your_tacc_username>**",

         "publicKey": "**<your_public_key>**",

         "privateKey": "**<your_private_key>**",

         "type": "SSHKEYS"

      }

   }

}

**You can get your public key by executing**:

    cat ~/.ssh/**<your_public_key>**

Private key:

    cat ~/.ssh/**<your_private_key>**



From your home directory, do a post request to the TACC tenant, uploading your storage-ext file:

    cd

    curl -k -H "Authorization: Bearer **<access_token>**" -X POST -F 'fileToUpload=@**<storage_name>**-storage-ext.json' https://api.tacc.utexas.edu/systems/v2

Verify that everything worked by attempting a file listing:

    curl -k -H "Authorization: Bearer **<access_token>**" https://api.tacc.utexas.edu/files/v2/listings/system/**<storage_name>**-storage-ext.json?pretty=true

This should return a successful JSON response containing objects representing the files on your new storage system.