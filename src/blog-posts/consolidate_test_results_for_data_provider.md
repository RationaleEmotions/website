---
title: 'Reporting consolidated TestNG result for tests that use data providers'
date: '2019-01-13'
tags: ['TestNG']
---

#### Problem statement:

> I use data provider for parameterized tests. I understand that the test method execute once for every instance in the data provider returned array.

> I understand also that each test method execution is reported in TestNG report separately.

> I want to aggregate these individual test methods' execution results and execute custom logic if all of them succeed for e.g., updating an external issue tracking system with their status.



TestNG does not contain any out of the box way of doing this. But you can still get this done using TestNG listeners.

Here's how to do it. I am making use of TestNG `7.0.0-beta3` (the latest released version as of today)

* We first need to create a marker interface which expresses the intent that we need consolidated results for a particular method.
* We then annotate our data driven test method using this annotation.
* You now build a test listener which implements `org.testng.IInvokedMethodListener` wherein you start checking for every invocation if its the last iteration for the test method and if yes, you keep computing the consolidated status.

The below sample shows this in action.

Marker interface looks like below

```java
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
@Target({METHOD, TYPE})
public @interface NeedConsolidatedResults { }
```

The test class looks like below

```java
@Listeners(IListen.class)
public class TestclassSample {

  @NeedConsolidatedResults
  @Test(dataProvider = "dp")
  public void passingTestMethod(int a) {}

  @NeedConsolidatedResults
  @Test(dataProvider = "dp")
  public void failingTestMethod(int a) {
    if (a == 2) {
      Assert.fail();
    }
  }

  @Test
  public void anotherTestMethod() {}

  @DataProvider(name = "dp")
  public Object[][] getData() {
    return new Object[][] {{1}, {2}, {3}};
  }
}
```

Here's how the listener would look like

```java
public class IListen implements IInvokedMethodListener {
    private Map<String, Boolean> results = new ConcurrentHashMap<>();

    @Override
    public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
      String key = testResult.getInstanceName() + "." + method.getTestMethod().getMethodName();
      if (!results.containsKey(key)) {
        results.put(key, Boolean.TRUE);
      }
    }

    @Override
    public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
       //If no marker annotation do nothing
      if (method
              .getTestMethod()
              .getConstructorOrMethod()
              .getMethod()
              .getAnnotation(NeedConsolidatedResults.class)
          == null) {
        return;
      }
      // If not data driven do nothing
      if (!method.getTestMethod().isDataDriven()) {
        return;
      }
      String key = testResult.getInstanceName() + "." + method.getTestMethod().getMethodName();
      Boolean result = results.get(key);
      result = result && (testResult.getStatus() == ITestResult.SUCCESS);
      results.put(key, result);
      if (method.getTestMethod().hasMoreInvocation()) {
        return;
      }
      if (results.get(key)) {
      //This is where we report pass for a data driven test
        System.err.println("All invocations passed for " + testResult.getMethod().getMethodName());
      } else {
      //This is where we report failure for a data driven test
        System.err.println("Some invocations failed for " + testResult.getMethod().getMethodName());
      }
    }
}
```

Here's the execution output:

```java
java.lang.AssertionError: null

    at org.testng.Assert.fail(Assert.java:97)
    at org.testng.Assert.fail(Assert.java:102)
    at com.rationaleemotions.stackoverflow.qn54079297.TestclassSample.failingTestMethod(TestclassSample.java:25)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at org.testng.internal.MethodInvocationHelper.invokeMethod(MethodInvocationHelper.java:131)
    at org.testng.internal.TestInvoker.invokeMethod(TestInvoker.java:570)
    at org.testng.internal.TestInvoker.invokeTestMethod(TestInvoker.java:170)
    at org.testng.internal.MethodRunner.runInSequence(MethodRunner.java:46)
    at org.testng.internal.TestInvoker$MethodInvocationAgent.invoke(TestInvoker.java:790)
    at org.testng.internal.TestInvoker.invokeTestMethods(TestInvoker.java:143)
    at org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:146)
    at org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:128)
    at org.testng.TestRunner.privateRun(TestRunner.java:763)
    at org.testng.TestRunner.run(TestRunner.java:594)
    at org.testng.SuiteRunner.runTest(SuiteRunner.java:398)
    at org.testng.SuiteRunner.runSequentially(SuiteRunner.java:392)
    at org.testng.SuiteRunner.privateRun(SuiteRunner.java:355)
    at org.testng.SuiteRunner.run(SuiteRunner.java:304)
    at org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:53)
    at org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:96)
    at org.testng.TestNG.runSuitesSequentially(TestNG.java:1146)
    at org.testng.TestNG.runSuitesLocally(TestNG.java:1067)
    at org.testng.TestNG.runSuites(TestNG.java:997)
    at org.testng.TestNG.run(TestNG.java:965)
    at org.testng.IDEARemoteTestNG.run(IDEARemoteTestNG.java:73)
    at org.testng.RemoteTestNGStarter.main(RemoteTestNGStarter.java:123)

Some invocations failed for failingTestMethod

All invocations passed for passingTestMethod

===============================================
Default Suite
Total tests run: 7, Passes: 6, Failures: 1, Skips: 0
===============================================
```



