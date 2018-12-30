---
title: 'Parallel WebDriver executions using TestNG'
date: '2013-07-31'
tags: ['TestNG', 'WebDriver']
---

# Parallel WebDriver executions using TestNG

In this post, we will see how does one make use of TestNG to kick off parallel UI tests using WebDriver.

So here are the ingredients that are required.

* A Factory class that will create WebDriver instances
* A Manager class that can be accessed to retrieve a WebDriver instance
* A TestNG listener that will be responsible for instantiating the WebDriver instance automatically

So without wasting any time lets see how this all blends in.

First lets look at our Factory class. This is a very simplified Factory class that will create instances of WebDriver based upon the browser flavour. I have purposefully kept it simple only for illustration purposes:
Here’s how the Factory class will look like:

```java
package organized.chaos;
 
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
 
class LocalDriverFactory {
    static WebDriver createInstance(String browserName) {
        WebDriver driver = null;
        if (browserName.toLowerCase().contains("firefox")) {
            driver = new FirefoxDriver();
            return driver;
        }
        if (browserName.toLowerCase().contains("internet")) {
            driver = new InternetExplorerDriver();
            return driver;
        }
        if (browserName.toLowerCase().contains("chrome")) {
            driver = new ChromeDriver();
            return driver;
        }
        return driver;
    }
}
```

As you can see its a very simple class with a static method that creates WebDriver instances. 

The one interesting part to be noted here is that the class has been purposefully given only package visibility [ notice how the keyword `public` is missing from the class declaration ]. 

One of the many aspects that are involved in designing APIs is *Hide what is not necessary to be visible to your user*. 

For you to be able to drive a car, you don’t need to know how the piston works or how the fuel injection happens do you 🙂

Now lets take a look at how our Manager class would look like. The Manager class essentially uses a concept in java called [ThreadLocal variables](http://docs.oracle.com/javase/6/docs/api/java/lang/ThreadLocal.html).

The code would look like below :

```java
package organized.chaos;
 
import org.openqa.selenium.WebDriver;
 
public class LocalDriverManager {
    private static ThreadLocal<WebDriver> webDriver = new ThreadLocal<WebDriver>();
 
    public static WebDriver getDriver() {
        return webDriver.get();
    }
 
    static void setWebDriver(WebDriver driver) {
        webDriver.set(driver);
    }
}
```


We basically have a static `ThreadLocal` variable wherein we are setting webDriver instances and also querying webdriver instances as well.

Next comes the TestNG listener. The role of the TestNG listener is to perform *Automatic webdriver instantiation* behind the scenes without your test code even realising it. 

For this we will make use of `org.testng.IInvokedMethodListener` so that the WebDriver gets instantiated right before a Test Method gets invoked and the webDriver gets automatically quit right after the Test method.

You can improvize this by incorporating custom annotations as well and parsing for your custom annotations [ The current implementation that you will see basically spawns a browser irrespective of whether you want to use it or not. That’s not a nice idea all the time is it ]

```java
package organized.chaos;
 
import org.openqa.selenium.WebDriver;
import org.testng.IInvokedMethod;
import org.testng.IInvokedMethodListener;
import org.testng.ITestResult;
 
public class WebDriverListener implements IInvokedMethodListener {
 
    @Override
    public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
        if (method.isTestMethod()) {
            String browserName = method.getTestMethod().getXmlTest().getLocalParameters().get("browserName");
            WebDriver driver = LocalDriverFactory.createInstance(browserName);
            LocalDriverManager.setWebDriver(driver);
        }
    }
 
    @Override
    public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
        if (method.isTestMethod()) {
            WebDriver driver = LocalDriverManager.getDriver();
            if (driver != null) {
                driver.quit();
            }
        }
    }
}
```

Now that we have shown all of the ingredients, lets take a look at a sample test as well, which is going to use all of this.

```java
package organized.chaos;
 
import org.testng.annotations.Test;
 
public class ThreadLocalDemo {
    @Test
    public void testMethod1() {
        invokeBrowser("http://www.ndtv.com");
    }
 
    @Test
    public void testMethod2() {
        invokeBrowser("http://www.facebook.com");
 
    }
 
    private void invokeBrowser(String url) {
        System.out.println("Thread " + Thread.currentThread().getId());
        System.out.println("HashcodeebDriver instance = " + 
        LocalDriverManager.getDriver().hashCode());
        LocalDriverManager.getDriver().get(url);
    }
}
```

As you can see its a very simple test class with two test methods. Each of the test methods opens up a different website. I have also add print statements for printing the thread id [yes thats the only reliable way of figuring out if your test method is running in parallel or in sequential mode. If you see unique values for `Thread.currentThread().getId()` then you can rest assured that TestNG is invoking your test methods in parallel.

We are printing the `hashCode()` values for the browser to demonstrate the fact that there are unique and different webDriver instances being created for every test method. [ Remember `hashCode()` value for an object would always be unique ]

Now lets take a look at how our suite file looks like :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Suite" parallel="methods">
    <listeners>
        <listener class-name="organized.chaos.WebDriverListener"/>
    </listeners>
    <test name="Test">
        <parameter name="browserName" value="firefox"></parameter>
        <classes>
            <class name="organized.chaos.ThreadLocalDemo" />
        </classes>
    </test> <!-- Test -->
</suite> <!-- Suite -->
```

So when you run this test this is how your output would look like [ apart from you seeing two firefox windows popup on your desktop ]

```
[TestNG] Running:
  /githome/PlayGround/testbed/src/test/resources/threadLocalDem.xml
 
Thread id = 10
Hashcode of webDriver instance = 1921042184
Thread id = 9
Hashcode of webDriver instance = 2017986718
 
===============================================
Suite
Total tests run: 2, Failures: 0, Skips: 0
===============================================
```

And thus we have managed to leverage TestNG and run WebDriver tests in parallel without having to worry about race conditions or leaving browsers open etc.,

Hope that clears out some of the confusions and helps you get started with WebDriver automation powered by TestNG.
