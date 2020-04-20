---
title: 'Repeating a test invocation by time period in TestNG'
date: '2020-04-20'
tags: ['TestNG']
---

## Problem statement

As a user, I would like to be able to repeat a test ***n*** times but for a particular time duration.


### The approach

On a high-level here's what you would need to do, to achieve this:

1. Create a custom annotation that can be used to state, how many iterations to run and for what duration.
2. Now for all test methods that need this capability, annotate them with the custom annotation defined in (1).
3. Define a base class which implements the TestNG interface `org.testng.IHookable`.
4. Within the `run()` method, parse the annotation and then use an executor service to control the duration and the iterations.

## Sample code

#### The custom annotation

```java
import static java.lang.annotation.ElementType.METHOD;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
@Target({METHOD})
public @interface Repeatable {

  int forSeconds() default 0;

  int iterations() default 1;
}
```

#### The base class

```java
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.testng.IHookCallBack;
import org.testng.IHookable;
import org.testng.ITestResult;

public class AbstractTestCase implements IHookable {

  @Override
  public void run(IHookCallBack callBack, ITestResult testResult) {
    Repeatable repeatable =
        testResult.getMethod().getConstructorOrMethod().getMethod().getAnnotation(Repeatable.class);
    if (repeatable == null) {
      callBack.runTestMethod(testResult);
      return;
    }
    Callable<Void> task =
        () -> {
          for (int i = 1; i <= repeatable.iterations(); i++) {
            System.err.println("Running iteration : " + i);
            callBack.runTestMethod(testResult);
          }
          return null;
        };
    ExecutorService service = Executors.newFixedThreadPool(1);
    try {
      List<Future<Void>> result =
          service.invokeAll(
              Collections.singletonList(task), repeatable.forSeconds(), TimeUnit.SECONDS);
      service.shutdown();
      result.forEach(
          r -> {
            try {
              r.get();
            } catch (InterruptedException | ExecutionException e) {
              throw new RuntimeException(e);
            }
          });
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }
}
```

#### A sample test case

```java
import java.util.concurrent.TimeUnit;
import org.testng.annotations.Test;

public class TestClassSample extends AbstractTestCase {

  @Test
  @Repeatable(forSeconds = 5, iterations = 10)
  public void runTask() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    System.err.println("Woke up after sleeping for 1 second");
  }
}
```

#### Execution output

```
Running iteration : 1
Woke up after sleeping for 1 second
Running iteration : 2
Woke up after sleeping for 1 second
Running iteration : 3
Woke up after sleeping for 1 second
Running iteration : 4
Woke up after sleeping for 1 second
Running iteration : 5
Running iteration : 6



java.util.concurrent.CancellationException
	at java.util.concurrent.FutureTask.report(FutureTask.java:121)
	at java.util.concurrent.FutureTask.get(FutureTask.java:192)
	at com.rationaleemotions.AbstractTestCase.lambda$run$1(AbstractTestCase.java:42)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at com.rationaleemotions.AbstractTestCase.run(AbstractTestCase.java:39)
	at org.testng.internal.MethodInvocationHelper.invokeHookable(MethodInvocationHelper.java:255)
	at org.testng.internal.TestInvoker.invokeMethod(TestInvoker.java:594)
	at org.testng.internal.TestInvoker.invokeTestMethod(TestInvoker.java:174)
	at org.testng.internal.MethodRunner.runInSequence(MethodRunner.java:46)
	at org.testng.internal.TestInvoker$MethodInvocationAgent.invoke(TestInvoker.java:821)
	at org.testng.internal.TestInvoker.invokeTestMethods(TestInvoker.java:147)
	at org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:146)
	at org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:128)
	at java.util.ArrayList.forEach(ArrayList.java:1257)
	at org.testng.TestRunner.privateRun(TestRunner.java:767)
	at org.testng.TestRunner.run(TestRunner.java:588)
	at org.testng.SuiteRunner.runTest(SuiteRunner.java:384)
	at org.testng.SuiteRunner.runSequentially(SuiteRunner.java:378)
	at org.testng.SuiteRunner.privateRun(SuiteRunner.java:337)
	at org.testng.SuiteRunner.run(SuiteRunner.java:286)
	at org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:53)
	at org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:96)
	at org.testng.TestNG.runSuitesSequentially(TestNG.java:1214)
	at org.testng.TestNG.runSuitesLocally(TestNG.java:1136)
	at org.testng.TestNG.runSuites(TestNG.java:1066)
	at org.testng.TestNG.run(TestNG.java:1034)
	at com.intellij.rt.testng.IDEARemoteTestNG.run(IDEARemoteTestNG.java:66)
	at com.intellij.rt.testng.RemoteTestNGStarter.main(RemoteTestNGStarter.java:110)


===============================================
Default Suite
Total tests run: 1, Passes: 0, Failures: 1, Skips: 0
===============================================


Process finished with exit code 0
```

## References

1. [ExecutorService that interrupts tasks after a timeout - StackoverFlow](https://stackoverflow.com/a/38710673)
2. [Overriding test methods in TestNG](https://testng.org/doc/documentation-main.html#ihookable)
3. [IHookable javadocs](https://javadoc.jitpack.io/com/github/cbeust/testng/master/javadoc/org/testng/IHookable.html) 
