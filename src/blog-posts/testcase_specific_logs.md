---
title: 'Testcase specific logs for a Selenium project'
date: '2016-11-18'
tags: ['TestNG', 'WebDriver']
---

# Testcase specific logs for a Selenium project

## Problem statement:

You would like to have a separate log file for every testcase so that if there are failures, its very easy for you to be able to debug and find out failures.

For going through this, I am going to be using a selenium based test as an example.

Selenium has a webdriver implementation called `EventFiringWebDriver` using which you can eavesdrop into the webdriver events. (For more information on eavesdropping into webdriver events please take a look at my blog post [here](https://rationaleemotions.wordpress.com/2015/04/18/eavesdropping-into-webdriver/)

I am going to be using the following to explain this :

1. Sl4fj (the logging framework)
2. Maven (the build tool)
3. TestNG (the test runner)

You would first need to add a dependency to sl4j as shown below (slf4j has many variants. We are just going to stick to using logback)

```xml
<!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-classic -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.0.3</version>
</dependency>
```

For more information on getting started with slf4j please refer [here](https://dzone.com/articles/adding-slf4j-your-maven).

We now need to create a `logback.xml` file as shown below.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
 
    <appender name="SIFT" class="ch.qos.logback.classic.sift.SiftingAppender">
        <discriminator>
            <key>userid</key>
            <defaultValue>unknown</defaultValue>
        </discriminator>
        <sift>
            <appender name="FILE-${userid}" class="ch.qos.logback.core.FileAppender">
                <file>${fileName}.log</file>
                <layout class="ch.qos.logback.classic.PatternLayout">
                    <pattern>%d{HH:mm:ss:SSS} | %-5level | %thread | %logger{20} | %msg%n%rEx</pattern>
                </layout>
            </appender>
        </sift>
    </appender>
 
    <root level="ALL">
        <appender-ref ref="SIFT" />
    </root>
</configuration>
```

For more information you can refer to this blog post [here](https://dzone.com/articles/siftingappender-logging).

You now can build an implementation of `org.openqa.selenium.support.events.WebDriverEventListener` (this is the listener we will be injecting into `EventFiringWebDriver`) as shown below.

```java
public class LogAwareWebDriverEventListener extends AbstractWebDriverEventListener {
 
    @Override
    public void beforeNavigateTo(String url, WebDriver driver) {
        LoggerFactory.getLogger(getClass()).info("Loading url " + url);
    }
 
    public void bindLogName(String log, String folderName) {
        String path = new File(folderName).getAbsolutePath() + File.separator;
        MDC.put("fileName", path+log);
    }
 
    public void unbind() {
        MDC.remove("fileName");
    }
}
```

Now that we have all the pieces required, lets go ahead and create our test case, which looks like below.

```java
public class ManyTestCases {
    @Test
    public void testMethod1() {
        runTest("http://www.google.com");
    }
 
    @Test
    public void testMethod2() {
        runTest("http://www.yahoo.com");
    }
 
    private void runTest(String url) {
        ChromeDriver cd = new ChromeDriver();
        EventFiringWebDriver driver = new EventFiringWebDriver(cd);
        LogAwareWebDriverEventListener listener = new LogAwareWebDriverEventListener();
        String outputFolder = Reporter.getCurrentTestResult().getTestContext().getSuite().getOutputDirectory();
        listener.bindLogName(Reporter.getCurrentTestResult().getName(), outputFolder);
        driver.register(listener);
        driver.get(url);
        driver.quit();
        listener.unbind();
    }
}
```
That’s it! Now when you run your tests, your test method specific log files will be created in the default output directory of `TestNG`. 

If running from an IDE, you should see the log files under `test-output` folder and if you are running them via maven you should see them under `target/surefire-reports` folder.
