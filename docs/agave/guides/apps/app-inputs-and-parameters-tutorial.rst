
Inputs and Parameters
=====================

In this section we take a detailed look at the ``inputs`` and ``parameters`` sections of your app descriptions. Each of these sections takes an array of JSON objects. Each JSON object represents either a data source that needs staging in prior to job execution or a primary value passed into your app as a parameter. In either case, the JSON object only requires an ``id`` by which to reference the object in a job request, and a ``type`` field indicating primary type if the object represents a parameter.

In practice, you will want to add some descriptive information, constraints, and runtime validation checks to reduce the amount of error users can run into when attempting to run your app. The full lists of app input and parameter attributes are provided in their respective sections below. However, before we dive deeper into the next section on app inputs, let's first get a big picture view of what we are doing when we define our app's input and parameters.


.. image:: {{site.baseurl}}/assets/images/App-Job-Information-Flow-1.png
   :target: {{site.baseurl}}/assets/images/App-Job-Information-Flow-1.png
   :alt: Input and Parameter Information Flow


When a user submits a job request in step 1, they specify the inputs and parameters needed to run that job. Those attributes are defined in your app description. The Jobs service will use your app description to validate the values in the job request and either reject it with a descriptive error message as in step 2, or accept it as in step 4. Once the job request is accepted, the values provided for the inputs and parameters given in the job request are used to replace their corresponding template placeholder values in the wrapper script. For example, the job request assigned a value of *foo* for the input with id equal to *input1*. Before submitting the job request to the remote system, the Jobs service will replace all occurrences of ``${input1}`` in the app wrapper script with *foo*. The same will happen with *param1* and *param2*. All occurrences of ``${param1}`` will be replaced with *bar* and all occurrences of ``${param2}`` will be replaced with *2*\ , just as specified in the job request.

..

   :information_source: Notice that Agave will not handle variable quoting for you. It is up to you to handle any type casting, escaping, and quoting of template values necessary for your app's logic.


As we look at how to define inputs and parameters for your app, keep this big picture in mind. The purpose of inputs is to specify data that needs to be staged prior to your job running and to tell your wrapper script about them. The purpose of parameters is to specify variables that need to be passed to your wrapper script. To do this, we only need a simple id by which to reference the values in a job request. The rest of what we will discuss in this tutorial is the mechanism that Agave provides for you to validate, describe, discover, and restrict application inputs and parameters to provider better user and developer experiences using your app.

Inputs
------

The ``inputs`` attribute of your app description contains a JSON array of input objects. An input represents one or more pieces of data that your app will use at runtime. That data can be a single file, a directory, or a response from a web service. It can reside on a system that Agave knows about, or at a publicly accessible URL. Regardless of where it lives and what it is, Agave will grab the data (recursively if need be) and copy it to your job's working directory just before execution.

..

   :information_source: In the Job management tutorial, we talk in detail about the job lifecycle. Here we simply point out that Agave will handle the staging of your app's ``deploymentPath`` separately from the staging of your assets. Thus, as a best practice, it is preferable to include all of the assets your app needs to run in your ``deploymentPath`` rather than defining them as inputs. This will allow Agave to make better caching decisions and reduce the overall throughput when running a job.


A minimal input object contains a single ``inputs.[].id`` attribute that uniquely identifies it within the context of your app. Any alphanumeric value under 64 characters can be an identifier, but it must be unique among all the inputs and parameters in that app.

.. code-block:: json

   {
     "id": "input1"
   }

Most of the time, such a minimal definition is not helpful. At the very least, you would want some descriptive information, a restriction on the cardinality, and potentially a default value. This can be achieved with the ``details``\ , ``semantics``\ , and ``value`` objects. The full list of input attributes is shown in the following table. We cover each attribute in the corresponding section below.

.. list-table::
   :header-rows: 1

   * - Name
     - Type
     - Description
   * - id
     - string
     - *Required*\ : The textual id of this input. This value must be unique within all inputs and inputs for an app description.
   * - details
     - JSON object
     - 
   * - details.argument
     - string
     - A command line argument or flag to be prepended before the input value.
   * - details.description
     - string
     - Human-readable description of the input. Often used to create contextual help in automatically generated UI.
   * - details.label
     - string
     - Human-readable label for the input. Often implemented as text label next to the field in automatically generated UI.
   * - details.showArgument
     - boolean
     - Whether to include the argument value for this input when performing the template variable replacement during job submission. If true, the ``details.argument`` value will be prepended, without spaces, to the actual input value(s).
   * - details.repeatArgument
     - boolean
     - When multiple values are provided for this input, this attribute determines whether to include the argument value before each user-supplied value when performing the template variable replacement during job submission. The ``details.showArgument`` value must be *true* for this value to be applied.
   * - semantics
     - JSON object
     - Describes the semantic definition of this inputs and the filetypes it represents. Multiple ontologies and values are supported.
   * - semantics.fileTypes
     - JSON array
     - Array of string values describing the file types represented by this input. The types correspond to values from the Transforms service. Use “raw-0” for the time being.
   * - semantics.minCardinality
     - integer
     - Minimum number of values this input must have.
   * - semantics.maxCardinality
     - integer
     - Maximum number of values this input can have. A null value or value of -1 indicates no limit.
   * - semantics.ontology
     - JSON array
     - List of ontology terms (or URIs pointing to ontology terms) applicable to the input. We recommend at least specifying an `XSL Schema Simple Type <http://www.schemacentral.com/sc/xsd/s-datatypes.xsd.html>`_.
   * - value
     - JSON object
     - A description of the anticipated value and the situations when it is required.
   * - value.default
     - string, JSON array
     - The default value for this input. This value is optional except when ``value.required`` is *true* and ``value.visible`` is *false*. Values may be absolute or relative paths on the user’s default storage sytem, an agave URI, or any valid URL with a supported schema.
   * - value.order
     - integer
     - The order in which this input should appear when auto-generating a command line invocation.
   * - value.required
     - boolean
     - *Required*\ : Is specification of this input mandatory to run a job?
   * - value.validator
     - string
     - `Perl-formatted regular expression <Perl-formatted regular expression to restrict valid values>`_ to restrict valid values.
   * - value.visible
     - boolean
     - When automatically generated a UI, should this field be visible to end users? If *false*\ , users will not be able to set this value in their job request.
   * - value.enquote
     - boolean
     - Should the value be surrounded in quotation marks prior to injecting into the wrapper template at job runtime.


Input details section
---------------------

The ``inputs.[].details`` object contains information specifying how to describe an input in different contexts. The ``description`` and ``label`` values provide human readable information appropriate for a tool tip and form label respectively. Neither of these attributes are required, however they dramatically improve the readability of your app description if you include them.

Often times you will need to translate your input value into actual command line arguments. By default, Agave will replace all occurrences of your attribute ``inputs.[].id`` in your wrapper script with the value of that attribute in your job description. That means that you are responsible for inserting any command line flags or arguments into the wrapper script yourself. This is a pretty straightforward process, however in situations where an input is optional, the resulting command line could be broken if the user does not specify an input value in their job request. One way to work around this is to add a conditional check to the variable assignment and exclude the command line flag or argument if it does not have a value set. Another is to use the ``inputs.[].details.argument`` attribute.

The ``inputs.[].details.argument`` value describes the command line argument that corresponds to this input, and the ``inputs.[].details.showArgument`` attribute specifies whether the ``inputs.[].details.argument`` value should be injected into the wrapper template in front of the actual runtime value. The following table illustrates the result of these attributes in different scenarios.

.. list-table::
   :header-rows: 1

   * - argument
     - showArgument
     - Input value from job request
     - Value injected into wrapper template
   * - 
     - true
     - /etc/motd
     - /etc/motd
   * - -f
     - true
     - /etc/motd
     - -f/etc/motd
   * - -f (trailing space)
     - true
     - /etc/motd
     - -f /etc/motd
   * - -f
     - false
     - /etc/motd
     - /etc/motd
   * - –filename
     - true
     - /etc/motd
     - –filename/etc/motd
   * - –filename=
     - true
     - /etc/motd
     - –filename=/etc/motd
   * - –filename
     - false
     - /etc/motd
     - /etc/motd


Input semantics section
-----------------------

The ``inputs.[].semantics`` object contains semantic information about the input. The ``minCardinality`` attribute specifies the minimum number of data sources that can be specified for the input. This attribute is used to validate the value(s) provided for the input in a job request. The ``ontology`` attribute specifies a JSON array of URLs pointing to the ontology definitions of this file type. (We recommend at least specifying an `XSL Schema Simple Type <http://www.schemacentral.com/sc/xsd/s-datatypes.xsd.html>`_\ {:target="_blank"}.) Finally, the ``fileTypes`` attribute contains a JSON array of file type strings as specified in the transforms service. (In most situations you will leave the fileTypes attribute null or specify *RAW-0* as the single file type in the array.)

Input value section
-------------------

The ``inputs.[].value`` object contains the information needed to validate user-supplied input values in a job request. The ``validator`` attribute accepts a Perl regular expression which will be applied to the input value(s). Any submissions that do not match the ``validator`` expression will be rejected.

..

   :information_source: If ``inputs[].semantics.minCardinality`` is greater than 1, multiple values will be accepted for input. These values may be provided in a semicolon delimited list or in a JSON array. The values may be relative paths to the user's default storage system, or URLs. Whatever value(s) the user provides, the validator will be applied independently to the entire value, not just the name.


The ``default`` attribute allows you to specify a default value for the input. This will be used in lieu of a user-supplied value if the input is ``required``\ , but not ``visible``. All default values must match the ``validator`` expression, if provided.

The ``required`` attribute specifies whether the input must be specified during a job submission.

The ``visible`` attribute takes a boolean value specifying whether the input should be accepted as a user-supplied value in a job request. If false, the value will be ignored at job submission and the ``default`` value will be used instead. Whenever ``visible`` is set to false, ``required`` must be true.

The ``order`` attribute is used to specify the order in which inputs should be listed in the response from the API and in command-line generation. By default, ``order`` is set to zero. Thus, providing a value greater than zero is sufficient to force any single input to be listed last.

Validating inputs
-----------------

The previous section covered different ways you can specify for Agave to validate and restrict the data inputs to your app. When a user submits an job request, the order in which they are applied is as follows.


#. visible
#. required
#. minCardinality
#. maxCardinality
#. validator

Once an input passes these tests, Agave will check that it exists and that the user has permission to access the data. Assuming everything passes, the input is accepted and scheduled for staging.

Parameters
----------

The ``parameters`` attribute of your app description contains a JSON array of parameter objects. A parameter represents one or more arguments that your app will use at runtime. Those arguments can be more or less anything you want them to be. If, for some reason, your app handles data staging on its own and you do not want Agave to move the data on your behalf, but you do need a data reference passed in, you can define it as a parameter rather than an input.

A minimal parameter object contains a single ``id`` attribute that uniquely identifies it within the context of your app and a ``value.type`` attribute specifying the primary type of the parameter. Any alphanumeric value under 64 characters can be an identifier, but it must be unique among all the inputs and parameters in that app. The parameter type is restricted to a handful of primary types listed in the table below.

.. code-block:: json

   {
     "id": "parameter1",
     "value": {
       "type": "string"
     }
   }

In most situations you will want some descriptive information and validation of the user-supplied values for this parameter. As with your app inputs, app parameters have ``details``\ , ``semantics``\ , and ``value`` objects that allow you to do just that. The full list of parameter attributes is shown in the following table. We cover each attribute in the corresponding section below.

.. list-table::
   :header-rows: 1

   * - Name
     - Type
     - Description
   * - id
     - string
     - *Required*\ : The textual id of this parameter. This value must be unique within all parameters and parameters for an app description.
   * - details
     - JSON object
     - 
   * - details.argument
     - string
     - A command line argument or flag to be prepended before the parameter value.
   * - details.description
     - string
     - Human-readable description of the parameter. Often used to create contextual help in automatically generated UI.
   * - details.label
     - string
     - Human-readable label for the parameter. Often implemented as text label next to the field in automatically generated UI.
   * - details.showArgument
     - boolean
     - Whether to include the argument value for this parameter when performing the template variable replacement during job submission. If true, the ``details.argument`` value will be prepended, without spaces, to the actual parameter value(s).
   * - details.repeatArgument
     - boolean
     - When multiple values are provided for this input, this attribute determines whether to include the argument value before each user-supplied value when performing the template variable replacement during job submission. The ``details.showArgument`` value must be *true* for this value to be applied.
   * - semantics
     - JSON object
     - Describes the semantic definition of this parameters and the filetypes it represents. Multiple ontologies and values are supported.
   * - semantics.minCardinality
     - integer
     - Minimum number of values this parameter must have.
   * - semantics.maxCardinality
     - integer
     - Maximum number of values this parameter can have. A null value or value of -1 indicates no limit.
   * - semantics.ontology
     - JSON array
     - List of ontology terms (or URIs pointing to ontology terms) applicable to the parameter. We recommend at least specifying an `XSL Schema Simple Type <http://www.schemacentral.com/sc/xsd/s-datatypes.xsd.html>`_.
   * - value
     - JSON object
     - A description of the anticipated value and the situations when it is required.
   * - value.default
     - string, JSON array
     - The default value for this parameter. This value is optional except when ``value.required`` is *true* and ``value.visible`` is *false*. If the ``value.type`` is of this parameter is *enumeration*\ , this value must be one of the specified ``value.enumValues``. If the ``value.type`` is of this parameter is *bool* or *flag*\ , then only boolean values are accepted here.
   * - value.enumValues
     - JSON array
     - An array of values specifying the possible values this parameter may have when ``value.type`` is *enumeration*. Both JSON Objects and strings are supported in the array. If a JSON Object is given, the object must be a single value attribute. The key will be the value passed into the wrapper template. The value will be the display value shown when auto-generating the option element in the select box representing this input.
   * - value.order
     - integer
     - The order in which this parameter should appear when auto-generating a command line invocation.
   * - value.required
     - boolean
     - *Required*\ : Is specification of this parameter mandatory to run a job?
   * - value.type
     - string, number, enumeration, bool, flag
     - JSON type for this parameter (used to generate and validate UI).
   * - value.validator
     - string
     - `Perl-formatted regular expression <Perl-formatted regular expression to restrict valid values>`_ to restrict valid values.
   * - value.visible
     - boolean
     - When automatically generated a UI, should this field be visible to end users? If *false*\ , users will not be able to set this value in their job request.
   * - value.enquote
     - boolean
     - Should the value be surrounded in quotation marks prior to injecting into the wrapper template at job runtime.


Parameter details section
-------------------------

The ``parameters.[].details`` object contains information specifying how to describe a parameter in different contexts and is identical to the ``inputs.[].details`` object.

Parameter semantics section
---------------------------

The ``parameters.[].semantics`` object contains semantic information about the parameter. Unlike the ``inputs.[].semantics`` object, it only has a single attribute, ``ontology``. The ``ontology`` attribute specifies a JSON array of URLs pointing to the ontology definitions of this parameter type. (We recommend at least specifying an `XSL Schema Simple Type <http://www.schemacentral.com/sc/xsd/s-datatypes.xsd.html>`_\ {:target="_blank"}.)

Parameter value section
-----------------------

The ``parameters.[].value`` object contains the information needed to validate user-supplied parameter values in a job request. The ``type`` attribute defines the primary type of this parameter's values. The available types are:


* *number*\ : any real number.
* *string*\ : any JSON-escaped alphanumeric string.
* *bool*\ : true or false.
* *flag*\ : true or false. Identical to boolean, but only the ``argument`` value will be inserted into the wrapper template.
* *enumeration*\ : a JSON array of strings values or JSON objects representing the acceptable values for this parameter. If an array of JSON objects is given, each object should have a single attribute with the key being a desired enumeration value, and the value being a human readable descriptive name for the enumerated value. The value of using objects vs strings is that object values provide a way to create more descriptive user interfaces by customizing both the content and value of a HTML select box's option elements. An example of both is given below.

.. code-block:: json

   [
     "red",
     "white",
     "green",
     "black"
   ]

   [
     { "red": "Deep Cherry Red" },
     { "white": "Bright White" },
     { "green": "Black Forest Green" },
     { "black": "Brilliant Black Crystal Pearl" }
   ]

The ``validator`` attribute accepts a Perl regular expression which will be applied to the input value(s). Any submissions that do not match the ``validator`` expression will be rejected. This attribute is available both to parameters of type *number* and *string*. It is not available to *bool* or *flag* parameter types, or to *enumeration* parameters as they require the ``enumValues`` attribute instead.

The ``default`` attribute allows you to specify a default value for the parameter. This will be used in lieu of a user-supplied value if the parameter is ``required``\ , but not ``visible``. All default values must match the appropriate ``validator`` if ``type`` is *number* or *string*\ , or be one of the values in the ``enumValues`` array if ``type`` is *enumeration*.

The ``enumValues`` attribute is a JSON array of alphanumeric values specifying the acceptable values for this input. This attribute only exists for *enumeration* parameter types.

The ``required`` attribute specifies whether the parameter must be specified during a job submission.

The ``visible`` attribute takes a boolean value specifying whether the parameter should be accepted as as a user-supplied value in a job requests. If false, the value will be ignored at job submission and the ``default`` value will be used instead. Whenever ``visible`` is set to false, ``required`` must be true.

The ``order`` attribute is used to specify the order in which parameters should be listed in the response from the API and in command-line generation. By default, ``order`` is set to 0. Thus, providing a value greater than zero is sufficient to force any single parameter to be listed last.

Validating parameters
---------------------

The previous section covered different ways you can tell for Agave to validate and restrict the parameters to your app. When a user submits an job request, the order in which they are applied is as follows.


#. visible
#. required
#. type
#. validator / enumValues
