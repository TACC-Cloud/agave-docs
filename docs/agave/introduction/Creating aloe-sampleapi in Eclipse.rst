Creating an Aloe Web App
========================

This page describes how to create a sample web application in Aloe.  The web application aloe-sampleapi (https://bitbucket.org/tacc-cic/aloe/src/aloe-test-service/aloe-sampleapi/) can be used as a skeleton for an real application.  The sample application supports these capabilities when run on the localhost:

    *. Implements a static service page: http://localhost:8080/sample/
    *. Implements a GET REST call: http://localhost:8080/sample/v2/hello
    *. Populates the aloe.version, build.time and git.info resource files at compile time.

**Creating aloe-sampleapi in Eclipse**

The aloe-sampleapi project was created in Eclipse by performing the following steps.  The same procedure can be followed to create a new REST API project in Aloe by just changing the project and path names appropriately.

1. Click File→New→Maven Project. 
    a. Check the "Create a simple project (skip archetype selection)" checkbox.
    b. Make sure the project is created in a subdirectory of the aloe root directory.  For example, if your new project is going to be named aloe-newapi, then previously from the command line you should have created the subdirectory aloe-newapi in the aloe directory.  
2. Click Next.
    a. Fill in the new project group and artifact values.
    b. Set packaging to war.
    c. Fill in the parent project group, artifact and version values.
3. Click Finish.
    a. The src and target directories are created under the aloe-sampleapi project directory.
    b. The following subdirectories are created under src/main: java, resources and webapp. 
4. Edit pom.xml.
    a. Remove the version element under the new artifactId (the parent's version is all that's needed).
    b. Add the javax-servlet-api and jersey-container-servlet dependencies.
    c. Add the build stanza after the dependencies element.
        i. Add the sourceDirectory and finalName elements.
        ii. Add the build-maven-plugin plugin for capturing compile-time information.
5. Right click the project name in the Navigator view.
    a. Select Properties→Project Facets.
    b. The Dynamic Web Module, Java, JavaScript and JAX-RS (REST Web Services) boxes should be checked.
        i. Make sure the JAX-RS version is 2.0.
6. Add web application files.
    a. Create webapp/WEB-INF/web.xml as shown.
    b. Create webapp/index.html as shown.
7. Add Java class files.
    a. Create the src/main/java/edu/utexas/tacc/aloe/sample/api directory.
        i. Create the SampleApplication.java file in the new directory.
8. Create the src/main/java/edu/utexas/tacc/aloe/sample/api/resources directory.
Create the TestGetResource.java file in the new directory.
Add resource files.
Add the aloe.version, build.time and git.info files to the src/main/resources directory.
From the command line outside of Eclipse issue the following commands to generate a WAR file.
cd to the aloe-sampleapi project directory.
Make sure Java and Maven are on the PATH.
mvn clean install
From inside Eclipse, select the aloe-sampleapi project directory.
Right click→Refresh
Add the aloe-sampleapi web app to your Tomcat configuration.
Run the web app in Tomcat.
From a browser, issue the two URLs given in the introduction.