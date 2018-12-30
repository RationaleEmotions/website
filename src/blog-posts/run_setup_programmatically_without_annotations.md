---
title: 'Running setup only once per Test/Suite Without Using @BeforeSuite/@BeforeTest'
date: '2017-09-25'
tags: ['TestNG']
---

# Running setup only once per Test/Suite Without Using @BeforeSuite/@BeforeTest

This is a common question that I am noticing asked by many users in the TestNG google forums and also on StackOverFlow.

So instead of constantly repeating myself in all these places, I thought I should just blog it as a solution for others to refer to it.

Lets say you have a scenario wherein you would like to trigger some initialisation (for e.g., selenium webdriver instantiation) only once per `<test>` tag (or) once per `<suite>` tag.

The easiest way of doing this would be to annotate the initialisation logic using :

* `@BeforeTest` – A method that is annotated with this annotation gets invoked only once per `<test>` tag
* `@BeforeSuite` – A method that is annotated with this annotation gets invoked only once per `<suite>` tag

Now lets complicate the situation by adding a few what if’s:

1. What if I had a bunch of classes and all of them are dependent on this initialisation.
2. What if I wanted to be able to run all these classes together as a batch or had to have the ability to run the test classes individually (or) even selectively.

To solve what if (1), you might say, we could easily create a base class, house the `@BeforeSuite` (or) `@BeforeTest` method reside in the base class and have all the test classes extend the base class.

The problem with that is what if (2) is going to be impacted especially in a batch mode, because TestNG would invoke the `@BeforeTest`/`@BeforeSuite` method only for the first class and would start skipping it from the second class and thus causing the famous `NullPointerException`.

Lets say that you would like to pass in the browser flavor that needs to be used, via a parameter in the suite xml file.

So lets see how to solve this using TestNG.

* Move the initialisation logic as part of either
    * `org.testng.ITestListener` – If you would like the setup to be executed only once per test tag ( i.e., instead of using `@BeforeTest`)
    * `org.testng.ISuiteListener` – If you would like the setup to be executed only once per suite tag ( i.e., instead of using `@BeforeSuite`)
* Use the `setAttribute()` method to persist the initialised data as an attribute of either the `ITestContext` (this represents a `<test>` tag ) or `ISuite` (this represents a `<suite>` tag).
* Wire in this listener into TestNG via  (You can read more about listeners and wiring in mechanisms from this blog of mine) :
    * the listeners tag (or)
    * the @Listeners annotation (or)
    * Service loaders.

Lets see all of this in action :

Here’s how an implementation that makes use of `org.testng.ISuiteListener` would look like:

```java
package com.rationaleemotions.wordpress;
 
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import org.testng.ITestResult;
import org.testng.Reporter;
 
public class SuiteLevelBrowserCreator implements ISuiteListener {
    private static final String DRIVER = "driver";
 
    @Override
    public void onStart(ISuite suite) {
        RemoteWebDriver driver;
        String browserType = suite.getParameter("browserType");
        switch (browserType) {
            case "chrome":
                driver = new ChromeDriver();
                break;
            default:
                driver = new FirefoxDriver();
        }
        suite.setAttribute(DRIVER, driver);
    }
 
    @Override
    public void onFinish(ISuite suite) {
        Object driver = suite.getAttribute(DRIVER);
        if (driver == null) {
            return;
        }
        if (!(driver instanceof RemoteWebDriver)) {
            throw new IllegalStateException("Corrupted WebDriver.");
        }
        ((RemoteWebDriver) driver).quit();
        suite.setAttribute(DRIVER, null);
    }
 
    /**
     * @return - A valid {@link RemoteWebDriver} instance only when invoked from within a <code>@Test</code> annotated
     * test method.
     */
    public static RemoteWebDriver getDriver() {
        ITestResult result = Reporter.getCurrentTestResult();
        if (result == null) {
            throw new UnsupportedOperationException("Please invoke only from within an @Test method");
        }
        Object driver = result.getTestContext().getSuite().getAttribute(DRIVER);
        if (driver == null) {
            throw new IllegalStateException("Unable to find a valid webdriver instance");
        }
        if (!(driver instanceof RemoteWebDriver)) {
            throw new IllegalStateException("Corrupted WebDriver.");
        }
        return (RemoteWebDriver) driver;
    }
}
```

Here’s how an implementation that makes use of  `org.testng.ITestListener` would look like:

```java
package com.rationaleemotions.wordpress;
 
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;
import org.testng.Reporter;
 
public class TestLevelBrowserCreator implements ITestListener {
    private static final String DRIVER = "driver";
    @Override
    public void onTestStart(ITestResult result) { }
 
    @Override
    public void onTestSuccess(ITestResult result) { }
 
    @Override
    public void onTestFailure(ITestResult result) { }
 
    @Override
    public void onTestSkipped(ITestResult result) { }
 
    @Override
    public void onTestFailedButWithinSuccessPercentage(ITestResult result) { }
 
    @Override
    public void onStart(ITestContext context) {
        RemoteWebDriver driver;
        String browserType = context.getCurrentXmlTest().getParameter("browserType");
        switch (browserType) {
            case "chrome":
                driver = new ChromeDriver();
                break;
            default:
                driver = new FirefoxDriver();
        }
        context.setAttribute(DRIVER, driver);
    }
 
    @Override
    public void onFinish(ITestContext context) {
        Object driver = context.getAttribute(DRIVER);
        if (driver == null) {
            return;
        }
        if (!(driver instanceof RemoteWebDriver)) {
            throw new IllegalStateException("Corrupted WebDriver.");
        }
        ((RemoteWebDriver) driver).quit();
        context.setAttribute(DRIVER, null);
    }
 
    /**
     * @return - A valid {@link RemoteWebDriver} instance only when invoked from within a <code>@Test</code> annotated
     * test method.
     */
    public static RemoteWebDriver getDriver() {
        ITestResult result = Reporter.getCurrentTestResult();
        if (result == null) {
            throw new UnsupportedOperationException("Please invoke only from within an @Test method");
        }
        Object driver = result.getTestContext().getAttribute(DRIVER);
        if (driver == null) {
            throw new IllegalStateException("Unable to find a valid webdriver instance");
        }
        if (!(driver instanceof RemoteWebDriver)) {
            throw new IllegalStateException("Corrupted WebDriver.");
        }
        return (RemoteWebDriver) driver;
    }
}
```

**Explanations**:

* The listener expects the browser flavor to be specified as a parameter via the TestNG suite xml file which is used to instantiate a web driver.
* All the `@Test` methods are expected to **ONLY** query the web driver instance that they require via the static utility method `getDriver()`.
* Since now the listener manages the instantiation and cleanup logic, the tests should not be doing the same at their end.

Here’s how a test class which consumes this, would look like :

```java
package com.rationaleemotions.wordpress;
 
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;
 
@Listeners(SuiteLevelBrowserCreator.class)
public class MyFirstTestCase {
 
    @Test
    public void testGooglePage() {
        launchPage("http://www.google.com");
    }
 
    @Test
    public void testFaceBookPage() {
        launchPage("http://www.facebook.com");
    }
 
    private void launchPage(String url) {
        RemoteWebDriver driver = SuiteLevelBrowserCreator.getDriver();
        driver.get(url);
        System.err.println("Page Title :" + driver.getTitle());
    }
}
```

That’s about it. This should now help you run your setups once per  or once per  without using the annotations.

Lastly, remember to use **TestNG v6.10** or higher, because the older versions of TestNG have an issue wherein they run same listener code multiple times (once for every instance). This issue is fixed in **TestNG v6.10** and so despite multiple listener instances being injected, TestNG would now just add only one instance.
