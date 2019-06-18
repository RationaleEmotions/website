---
title: 'Instrumenting your Java code'
date: '2019-06-18'
tags: ['Instrumentation', 'Java']
---

## Modes of instrumentation

Basically there are two ways in which one can instrument their java code.

#### On-the-fly instrumentation

In this model, one basically just attachs the instrumentation tool provided java agent jar to the JVM when it is coming up. Since the Java Instrumentation APIs provides access to the classes being loaded to the [JavaAgent](https://www.baeldung.com/java-instrumentation), the agent can very easily instrument the classes on the fly.

#### Offline instrumentation

In this model, one needs to use the CLI interface that the instrumentation tool provides and then go about instrumenting the classes. From what I have read, this is a bit cumbersome and so I am going to be skipping this for this exercise.

## What all did I need

#### A sample java project

Since I needed a sample project for doing this, I thought I would quickly leverage what is available on github instead of trying to build my own. 

For this exercise, I have made use of the sample project available in [this](https://github.com/saraivamarco/spring-rest-example) project.

Couple of things if you are using this project:

1. This sample project assumes that your tomcat server would be running in `9090` port. If that is not the case, make sure you change the port number [here](https://github.com/saraivamarco/spring-rest-example/blob/master/webapp/index.jsp#L12)
2. You would need to build this project locally by running `mvn clean package`. But doing that would generate a `war` file appended with the snapshot version. If you dont want that to happen, remember to add `<finalName>spring-rest-example</finalName>` within `<build>..</build>` tag.

#### The Jacoco tool

The jacoco tool can be downloaded from https://www.eclemma.org/jacoco/ ==Under Release builds section==

Its available as a zip file.
The zip contains a lot of stuff. But for our exercise, we would only need the following:

1. `lib/jacocoagent.jar` - This is the Java agent jar which we would be using to attach/hook to a JVM.
2. `lib/jacococli.jar` - This is the command line interface which we would use for generating the reports.

## How to instrument your web application on an offline mode

1. Copy `jacocoagent.jar` to your tomcat `lib` folder.
2. Now in the tomcat installation directory, under `bin` folder, create a file called:
    1. `setenv.bat` (if you are on windows)
    2. `setenv.sh` (if you are on unix or OSX. Dont forget to give it execution permissions by running `chmod +x`)
3. Populate this setenv file with the below contents

**For OSX/Unix**

`JAVA_OPTS="-javaagent:$CATALINA_HOME/lib/jacocoagent.jar=includes=com.journaldev.*,destfile=/Users/krmahadevan/jacoco.exec"`

**For windows**

`
JAVA_OPTS="-javaagent:%CATALINA_HOME%/lib/jacocoagent.jar=includes=com.journaldev.*,destfile=/Users/krmahadevan/jacoco.exec"
`

**Here:**

* We are writing the report to a file. In the above case, the location of that file is `/Users/krmahadevan/jacoco.exec`
* We are letting jacoco know that we are specifically interested only in `com.journaldev` package.

4. Now bring up the tomcat instance and start running your tests. The coverage file would get populated only when you bringdown the tomcat instance.
5. Once the coverage file is generated, you can download it (if the tomcat is running on a different machine) and then view the reports.
6. For viewing the reports, you need to use `jacococli.jar` from the jacoco zip file that you downloaded.
7. The below command should be able to generate the reports.

**To generate a report of all the classes that are found in the war file use:**

```
java -jar jacococli.jar report ../jacoco.exec --html ~/jacoco/reports --classfiles ~/githome/PlayGround/code_coverage_research/spring-rest-example/target/spring-rest-example.war
```

**The above command If you would like to have it focus only on your project jar files, then you can give the below command**

```
java -jar jacococli.jar report ../jacoco.exec --html ~/jacoco/reports --classfiles ~/githome/PlayGround/code_coverage_research/spring-rest-example/target/classes/
```

But for this to work, you would need to ensure that you have compiled your project locally as well (Here the .class files are available in the target folder since this is a maven project)

### References
* https://www.eclemma.org/jacoco/trunk/doc/agent.html
* https://www.eclemma.org/jacoco/trunk/doc/cli.html
* https://blogs.perficient.com/2017/03/08/accurate-functional-test-based-code-coverage/
* http://atuljacococodecover.blogspot.com/
* https://automationrhapsody.com/code-coverage-of-manual-or-automated-tests-with-jacoco/
