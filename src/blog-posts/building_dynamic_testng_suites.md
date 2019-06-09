---
title: 'Building Dynamic TestNG Suites'
date: '2017-09-27'
tags: ['TestNG']
---

We have all at some point wished that we had a way wherein we could dynamically build the TestNG suite xml file based upon some parameters and still make use of built in test execution mechanisms such as maven surefire plugin to run our tests.

Its very easy to build these sort of customizations if you are working with TestNG APIs.

But some of the challenges with using TestNG APIs are :

* Using TestNG APIs requires one to build our own main() method way of executing tests.
* Its usually not straight forward to integrate this sort of execution mechanism into build tools such as Maven.

Well, what if I told you, TestNG provides you with a mechanism to customize the suite xml file via a listener and you don’t need to even worry about using the TestNG APIs.

Using this listener, you can tweak :

* Thread count
* Parallel execution mode switch (enable/disable parallel execution)
* Add more `<test>` tags into your suite xml.
* and many more such use cases.

So lets see a simple example, wherein we would like to choose  packages for execution in a dynamic manner.

You begin with implementing `org.testng.IAlterSuiteListener`. TestNG injects a list of suite objects into this listener and lets you tweak alter its behavior at will. Unlike other listeners, TestNG injects the actual suite references that it would be using, so you can be assured that your changes would be effected for sure.

Lets look at it’s implementation:

```java
package com.rationaleemotions.wordpress;
 
import org.testng.IAlterSuiteListener;
import org.testng.xml.XmlPackage;
import org.testng.xml.XmlSuite;
import org.testng.xml.XmlTest;
 
import java.util.Collections;
import java.util.List;
 
public class SimpleSuiteAlterer implements IAlterSuiteListener {
    @Override
    public void alter(List suites) {
        XmlSuite suite = suites.get(0);
        XmlTest xmlTest = new XmlTest(suite);
        xmlTest.setName("CommandLine_Test");
        String packages = System.getProperty("package", suite.getParameter("package"));
        XmlPackage xmlPackage = new XmlPackage(packages);
        xmlTest.setXmlPackages(Collections.singletonList(xmlPackage));
    }
}
```

Now let’s look at the suite xml file that consumes this listener.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Package-Suites" verbose="2">
    <parameter name="package" value="com.rationaleemotions"/>
    <listeners>
        <listener class-name="com.rationaleemotions.wordpress.SimpleSuiteAlterer"/>
    </listeners>
</suite>
```

As you can see in the above xml, we didn’t include any tag at all. Our listener basically creates a  tag dynamically and injects that into the suite object.

We get the package name from a JVM argument, but we also have defined a fall back default value in our suite xml file. So if no package is specified we fall back to picking up tests from `com.rationaleemotions` and if it’s specified via the JVM argument `-Dpackage` we use that.

If I were using Maven, I would trigger my execution via :

```bash
mvn clean test -DsuiteXmlFile=alter_suites.xml -Dpackage=com.rationaleemotions.stackoverflow.qn46448014
```

There are many such use cases for `org.testng.IAlterSuiteListener`. The goal of this post was just to introduce you to the possibilities of what you can build using this listener.
