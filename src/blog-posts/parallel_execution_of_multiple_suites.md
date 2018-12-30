---
title: 'Parallel execution of multiple TestNG suites'
date: '2016-03-29'
tags: ['TestNG']
---

# Parallel execution of multiple TestNG suites

If we would like to run more than one TestNG suite in parallel, here’s how to go about doing it.

For the sake of convenience am going to conveniently assume that your project is a Maven project.

We first start by defining two properties in our pom file – One property to accept a list of comma separated suite file names and the other property to dynamically help us control the suite’s thread pool size.

```xml
<properties>
    <threads>2</threads>
    <file>src/test/resources/default.xml</file>
</properties>
```

We now reference the above two properties in our surefire plugin as shown below :

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>2.15</version>
    <configuration>
        <suiteXmlFiles>${file}</suiteXmlFiles>
        <skipTests>false</skipTests>
        <properties>
            <property>
                <name>suitethreadpoolsize</name>
                <value>${threads}</value>
            </property>
        </properties>
    </configuration>
</plugin>
```

For the sake of completeness here’s how our test classes look like below:

```java
public class TestCaseOneForSuiteOne {
    @Test
    public void testMethodOneForSuiteOne() {
        printer();
    }
 
    @Test
    public void testMethodTwoForSuiteOne() {
        printer();
    }
 
    private void printer() {
        ITestResult result = Reporter.getCurrentTestResult();
        String name = result.getTestClass().getName() + "." 
        + result.getMethod().getMethodName() + "()  on Thread #" 
        + Thread.currentThread().getId();
        Reporter.log(name + " ran.", true);
    }
}
```

```java
public class TestCaseOneForSuiteTwo {
    @Test
    public void testMethodOneForSuiteTwo() {
        printer();
    }
 
    @Test
    public void testMethodTwoForSuiteTwo() {
        printer();
    }
 
    private void printer() {
        ITestResult result = Reporter.getCurrentTestResult();
        String name = result.getTestClass().getName() + "." 
        + result.getMethod().getMethodName() + "()  on Thread #" 
        + Thread.currentThread().getId();
        Reporter.log(name + " ran.", true);
    }
}
```

The two suite files look like below :

**suite-one-with-execution.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Suite-1" parallel="false">
  <test name="Test-1">
    <classes>
      <class name="organized.chaos.testng.execute.TestCaseOneForSuiteOne"/>
    </classes>
  </test>
</suite>
```

**suite-two-with-execution.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Suite-2" parallel="false">
    <test name="Test-2">
        <classes>
            <class name="organized.chaos.testng.execute.TestCaseOneForSuiteTwo"/>
        </classes>
    </test>
</suite>
```

Now we can pass in our desired suite file names in runtime as below from a command line :

```bash
mvn clean test 
-Dfile=src/test/resources/suite-one-with-execution.xml,src/test/resources/suite-two-with-execution.xml
```

Here’s how the output looks like:

```
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running TestSuite
organized.chaos.testng.execute.TestCaseOneForSuiteTwo.testMethodOneForSuiteTwo()  on Thread #11 ran.
organized.chaos.testng.execute.TestCaseOneForSuiteOne.testMethodOneForSuiteOne()  on Thread #10 ran.
organized.chaos.testng.execute.TestCaseOneForSuiteTwo.testMethodTwoForSuiteTwo()  on Thread #11 ran.
organized.chaos.testng.execute.TestCaseOneForSuiteOne.testMethodTwoForSuiteOne()  on Thread #10 ran.
Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.652 sec - in TestSuite

Results :

Tests run: 4, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

If we would like to change the thread pool size value we can change it via the runtime argument:

```bash
mvn clean test 
-Dfile=src/test/resources/suite-one-with-execution.xml,src/test/resources/suite-two-with-execution.xml 
-Dthreads=1
```

Here's how the output looks like

```
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running TestSuite
organized.chaos.testng.execute.TestCaseOneForSuiteOne.testMethodOneForSuiteOne()  on Thread #1 ran.
organized.chaos.testng.execute.TestCaseOneForSuiteOne.testMethodTwoForSuiteOne()  on Thread #1 ran.
organized.chaos.testng.execute.TestCaseOneForSuiteTwo.testMethodOneForSuiteTwo()  on Thread #1 ran.
organized.chaos.testng.execute.TestCaseOneForSuiteTwo.testMethodTwoForSuiteTwo()  on Thread #1 ran.
Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.303 sec - in TestSuite

Results :

Tests run: 4, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

