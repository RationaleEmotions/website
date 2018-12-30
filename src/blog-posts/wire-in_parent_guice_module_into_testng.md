---
title: 'Automatically wire-in a parent Guice-module into your TestNG test'
date: '2018-01-20'
tags: ['TestNG']
---

# What is dependency injection ?

Quoting WikiPedia, here’s the definition of dependency injection:

> In software engineering, dependency injection is a technique whereby one object supplies the dependencies of another object. A dependency is an object that can be used (a service). An injection is the passing of a dependency to a dependent object (a client) that would use it. The service is made part of the client’s state. Passing the service to the client, rather than allowing a client to build or find the service, is the fundamental requirement of the pattern.

This fundamental requirement means that using values (services) produced within the class from new or static methods is prohibited. The class should accept values passed in from outside. This allows the class to make acquiring dependencies someone else’s problem.

The intent behind dependency injection is to decouple objects to the extent that no client code has to be changed simply because an object it depends on needs to be changed to a different one.

## What is Guice ?

**Guice** is a dependency injection framework provided by Google.  If you are looking for a quick start guide, then you can refer to this excellent [getting started guide](http://www.baeldung.com/guice) and as always refer [here](https://github.com/google/guice/wiki/GettingStarted) for an exhaustive documentation from Google on Guice.

TestNG supports two forms of dependency injection.

* **Native Dependency Injection** – In this form of dependency injection, TestNG automatically injects objects into your Test methods as parameters. Some of the examples for this is, TestNG injecting an ITestContext object into your Test or configuration method. For more details on Native Dependency Injection, refer to the TestNG documentation [here](http://testng.org/doc/documentation-main.html#dependency-injection).
* **External Dependency Injection** – In this form of dependency injection, TestNG lets you use an external dependency injection framework via which you can inject the dependencies that are required to be fulfilled in order for your object to be created.  More details including some samples are available in the TestNG documentation [here](http://testng.org/doc/documentation-main.html#dependency-injection).

In this post, we are going to look at a specific need viz., being able to wire in a guice parent module into your TestNG execution, without having to do it via your suite xml file.

## What exactly is a parent guice module?

Imagine the parent guice module to be something like a base class for all other guice modules in your project. The dependency injections that are common across your project would be defined in the parent guice module and the ones that are specific to a particular test method would be provided via the `@Guice` annotation.

## How does TestNG support wiring in a parent guice module ?

TestNG lets you wire in a parent guice module via the `parent-module` attribute of your `suite` tag. The value for this `parent-module` attribute would be a fully qualified class name.

## What is the problem with TestNG’s way of wiring in a parent guice module ?

The only problem is that TestNG lets you wire in a parent guice module only via your TestNG suite xml file. So you may ask, what’s the issue with that ? Well, what if your project has a wide variety of suite xml files, that are created for various different needs ? You would need to update every single suite xml file to refer to the parent guice module. So its more of a convenience issue than anything else.

## Does this mean, we need a code change in TestNG to support this ?

No. Not necessarily. There’s an easy way of doing it with the current implementation of TestNG.

Here’s how you do it.

1. You would first need to define an implementation of the TestNG listener `org.testng.IAlterSuiteListener`.
2. Within the above listener’s implementation, you extract out the first `XmlSuite` and then set the fully qualified class name of your parent Guice module.
3. You now create a file called `org.testng.ITestNGListener` and place it in a folder structure defined as `META-INF/services`. If your listeners are production listeners that reside under `src/main/java` then this file resides in your `src/main/resources`. If your  listeners are test listeners that reside under `src/test/java` then this file resides in `src/test/resources`.

For demonstrating this, we are going to be using **TestNG 6.13.1**

Here’s a sample interface, that represents the ability to query different attributes associated with an execution environment.

```java
public interface EnvInfo {
    String getBrowserFlavor();
}
```

Here’s a concrete implementation of the above mentioned interface.

```java
public class DefaultEnvInfo implements EnvInfo {
    @Override
    public String getBrowserFlavor() {
        //Keeping it simple for the sake of example. 
        //You can make it fancy by having this read from JVM arguments.
        return "firefox";
    }
}
```

Here’s how our default Guice parent module would look like :

```java
import com.google.inject.AbstractModule;
 
public class DefaultParentModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(EnvInfo.class).to(DefaultEnvInfo.class);
    }
}
```

Here’s how the TestNG listener implementation would look like :

```java
import org.testng.IAlterSuiteListener;
import org.testng.xml.XmlSuite;
 
import java.util.List;
 
public class GuiceParentModuleInjector implements IAlterSuiteListener {
    @Override
    public void alter(List suites) {
        XmlSuite suite = suites.get(0);
        suite.setParentModule(DefaultParentModule.class.getName());
    }
}
```

Now lets look at how a sample interface which represents the web driver instantiation capabilities looks like:

```java
import org.openqa.selenium.remote.RemoteWebDriver;
 
public interface WebDriverProducer {
    RemoteWebDriver newInstance();
}
```

Here’s a concrete implementation of the above cited interface:

```java
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
 
import javax.inject.Inject;
 
public class DefaultWebDriverProducerImpl implements WebDriverProducer {
 
    private String flavor;
 
    @Inject
    public DefaultWebDriverProducerImpl(EnvInfo info) {
        this.flavor = info.getBrowserFlavor().trim().toLowerCase();
    }
 
    @Override
    public RemoteWebDriver newInstance() {
        switch (flavor) {
            case "firefox":
                return new FirefoxDriver();
            default:
                return new ChromeDriver();
        }
 
    }
}
```

Here’s a test specific Guice module.

```java
import com.google.inject.Binder;
import com.google.inject.Module;
 
public class WebDriverModule implements Module {
    @Override
    public void configure(Binder binder) {
        binder.bind(WebDriverProducer.class).to(DefaultWebDriverProducerImpl.class);
    }
}
```

Here’s a sample test class which will consume the above specified test specific Guice Module and implicitly consume the default Guice Parent module as well.

```java
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Guice;
import org.testng.annotations.Test;
 
import javax.inject.Inject;
 
@Guice(modules = WebDriverModule.class)
@Test
public class SampleTestClass {
 
    private RemoteWebDriver driver;
 
    @Inject
    public SampleTestClass(WebDriverProducer producer) {
        driver = producer.newInstance();
    }
 
    public void testMethod() {
        driver.get("http://the-internet.herokuapp.com/");
        Assert.assertEquals("The Internet", driver.getTitle());
    }
 
    @AfterClass
    public void cleanup() {
        driver.quit();
    }
}
```

A look at how the folder structure looks like for our service loader file

```
9:12 $ tree src/test/resources/META-INF/services/
src/test/resources/META-INF/services/
└── org.testng.ITestNGListener
 
0 directories, 1 file
```

Here’s the contents of the file `org.testng.ITestNGListener`

```
~/githome/PlayGround/testbed
09:12 $ cat src/test/resources/META-INF/services/org.testng.ITestNGListener
com.rationaleemotions.github.issue1667.GuiceParentModuleInjector
~/githome/PlayGround/testbed
09:13 $
```

Here’s a sample execution of all this using **TestNG 6.13.1**

```
1516333469849   geckodriver INFO    geckodriver 0.19.1
1516333469936   geckodriver INFO    Listening on 127.0.0.1:14716
1516333470472   mozrunner::runner   INFO    Running command: "/Applications/Firefox.app/Contents/MacOS/firefox-bin" "-marionette" "-profile" "/var/folders/mj/81r6v7nn5lqgqgtfl18spfpw0000gn/T/rust_mozprofile.rrBHzcAuHdHV"
1516333471175   Marionette  INFO    Enabled via --marionette
2018-01-19 09:14:32.082 plugin-container[7336:260934] *** CFMessagePort: bootstrap_register(): failed 1100 (0x44c) 'Permission denied', port = 0xab43, name = 'com.apple.tsm.portname'
See /usr/include/servers/bootstrap_defs.h for the error codes.
1516333472630   Marionette  INFO    Listening on port 53846
1516333472664   Marionette  WARN    TLS certificate errors will be ignored for this session
1516333472727   Marionette  DEBUG   Register listener.js for window 2147483649
Jan 19, 2018 9:14:32 AM org.openqa.selenium.remote.ProtocolHandshake createSession
INFO: Detected dialect: W3C
1516333472869   Marionette  DEBUG   Received DOM event "beforeunload" for "about:blank"
1516333473477   Marionette  DEBUG   Received DOM event "pagehide" for "about:blank"
1516333473477   Marionette  DEBUG   Received DOM event "unload" for "about:blank"
1516333475640   Marionette  DEBUG   Received DOM event "DOMContentLoaded" for "http://the-internet.herokuapp.com/"
1516333475866   Marionette  DEBUG   Received DOM event "pageshow" for "http://the-internet.herokuapp.com/"
 
===============================================
Default Suite
Total tests run: 1, Failures: 0, Skips: 0
===============================================
```
