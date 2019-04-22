
Jupyter Hub
-----------

Jupyter notebooks (formerly iPython notebooks) provide users with interactive computing documents that contain both computer code and a mix of rich text elements such as data visualizations, text paragraphs, hyperlinks, formatted equations, etc. The code cells in notebooks can be executed interactively, cell by cell, and the results of the executions are displayed in subsequent cells in the notebook. The notebooks can also be exported to a serialized JSON formatted file and executed like a traditional program.

JupyterHub is an open source project to provide multi-user hosted notebook servers as a service. When a user signs in to JupyterHub, a notebook server with pre-configured software is automatically launched for them. The Tapis (Agave) team integrated JupyterHub into its identity and access management stack and made several other additional enhancements and customizations to enable the use of Tapis' (Agave) language SDKs such as agavepy and the CLI, persistent storage, and multiple kernel support, directly from their notebooks with very minimal setup. Agave’s deployment of JupyterHub, which runs each user’s notebook server in a Docker container to further enhance reproducibility, is freely available for use in Agave's Public Tenant. 

You can get started with JupyterHub today at `https://jupyter.tacc.cloud <https://jupyter.tacc.cloud>`_.
