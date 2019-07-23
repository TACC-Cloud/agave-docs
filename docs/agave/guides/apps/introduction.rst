
Apps
----

An app, in the context of Tapis, is an executable code available for invocation through the Tapis Jobs service on a specific execution system. Put another way, an app is a piece of code that you can run on a specific system. If a single code needs to be run on multiple systems, each combination of app and system needs to be defined as an app.

Apps are language agnostic and may or may not carry with them their own dependencies. (More on bundling your app in a moment.) Any code that can be forked at the command line or submitted to a batch scheduler can be registered as an Tapis app and run through the Jobs service.

The Apps service is the central registry for all Tapis apps. The Apps service provides permissions, validation, archiving, and revision information about each app in addition to the usual discovery capability. The rest of this tutorial explains in detail how to register an app to the Apps service, how to manage and share apps, and what the different application scopes mean.
