---
title: 'Working with Threads in TestNG'
date: '2012-07-06'
tags: ['TestNG']
---

# Working with Threads in TestNG


Sometime back, me and my friend were trying to play around with Threads in `@Test` annotated TestNG methods and we found something which to me was a good learning exercise. 

So just thought of sharing that here, in-case someone needs a similar thing. I learnt that TestNG works using Reflection. Now reflection suffers from one setback when used with Threads. 

For example, I have a main method `public static void main(String[] args)` which is spawning a new child thread using reflection. Now for some reason the new child thread throws an exception, then main method would never get to know about this exception at all !! Why ?? 

Because the new thread was spawned via Reflection. Because of this setback in Java, TestNG also ends up inheriting this limitation. But I learnt that there is a way in which you can get past this behavior. 

The way to circumvent this problem is to use `ExecutorService` (as suggested by **Cedric Beust**).

Here’s a working example, that has 4 test methods. The below test methods use ExecutorService for Thread management and as such always pass.

* `testUsingExecutorService()`
* `testUsingExecutorServiceWithException()`

However the below test methods spawn Threads in the normal way and as such one of the tests will always fail.

* `testUsingThreads()`
* `testUsingThreadsWithExceptions()` – This method would always fail even though it expects a RuntimeException because the main thread wherein the Test method runs never gets to know the exceptions being thrown in the child thread it spawns.

```java
package testng.samples;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.testng.annotations.Test;
public class ThreadExecutorServiceDemo {
    private static final String ERROR_MSG = "From thread you asked me throw an exception";
    @Test
    public void testUsingExecutorService() throws InterruptedException, ExecutionException {
        MyCallableService service = new MyCallableService(false);
        Future<String> returnValue = Executors.newSingleThreadScheduledExecutor().submit(service);
        System.out.println(returnValue.get());
    }
    @Test(expectedExceptions = ExecutionException.class, expectedExceptionsMessageRegExp = ".*" + ERROR_MSG + ".*")
    public void testUsingExecutorServiceWithException() throws InterruptedException, ExecutionException {
        MyCallableService anotherService = new MyCallableService(true);
        Future<String> anotherReturnValue = Executors.newSingleThreadScheduledExecutor().submit(anotherService);
        System.out.println(anotherReturnValue.get());
    }
    @Test
    public void testUsingThreads() throws InterruptedException {
        MyThreadService mt = new MyThreadService(false);
        mt.start();
        while (mt.isAlive() == true) {
            Thread.sleep(10000);
        }
        System.out.println(mt.getServiceName());
    }
    @Test(expectedExceptions = RuntimeException.class, expectedExceptionsMessageRegExp = ERROR_MSG)
    public void testUsingThreadsWithExceptions() throws InterruptedException {
        MyThreadService mt = new MyThreadService(true);
        mt.start();
        while (mt.isAlive() == true) {
            Thread.sleep(10000);
        }
        System.out.println(mt.getServiceName());
    }
    public class MyThreadService extends Thread {
        private boolean throwException;
        private String serviceName;
        public String getServiceName() {
            return serviceName;
        }
       public MyThreadService(boolean throwException) {
            this.throwException = throwException;
        }
        public void run() {
            try {
                sleep(25000);
                this.serviceName = "TestNG threaded Service";
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            if (throwException) {
                throw new RuntimeException(ERROR_MSG);
            }
        }
    }
    public class MyCallableService implements Callable<String> {
        private boolean throwException;
        public MyCallableService(boolean throwException) {
            this.throwException = throwException;
        }
        @Override
        public String call() throws Exception {
            Thread.sleep(25000);
            if (throwException) {
                throw new RuntimeException(ERROR_MSG);
            }
            return "Callable Service Invoked";
        }
    }
}
```

Output is as below:

```
[TestNG] Running:
  C:\Users\krmahadevan\AppData\Local\Temp\testng-eclipse--667883055\testng-customsuite.xml

Callable Service Invoked
TestNG threaded Service
Exception in thread "Thread-2" java.lang.RuntimeException: From thread you asked me throw an exception
	at testng.samples.ThreadExecutorServiceDemo$MyThreadService.run(ThreadExecutorServiceDemo.java:71)
TestNG threaded Service
PASSED: testUsingExecutorService
PASSED: testUsingExecutorServiceWithException
PASSED: testUsingThreads
FAILED: testUsingThreadsWithExceptions
org.testng.TestException: 
Expected exception java.lang.RuntimeException but got org.testng.TestException: 
Method ThreadExecutorServiceDemo.testUsingThreadsWithExceptions()
[pri:0, instance:testng.samples.ThreadExecutorServiceDemo@4fbc9499] should have thrown an exception of 
class java.lang.RuntimeException
	at org.testng.internal.Invoker.handleInvocationResults(Invoker.java:1485)
	at org.testng.internal.Invoker.invokeTestMethods(Invoker.java:1233)
	at org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:127)
	at org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:111)
	at org.testng.TestRunner.privateRun(TestRunner.java:768)
	at org.testng.TestRunner.run(TestRunner.java:617)
	at org.testng.SuiteRunner.runTest(SuiteRunner.java:334)
	at org.testng.SuiteRunner.runSequentially(SuiteRunner.java:329)
	at org.testng.SuiteRunner.privateRun(SuiteRunner.java:291)
	at org.testng.SuiteRunner.run(SuiteRunner.java:240)
	at org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:53)
	at org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:87)
	at org.testng.TestNG.runSuitesSequentially(TestNG.java:1188)
	at org.testng.TestNG.runSuitesLocally(TestNG.java:1113)
	at org.testng.TestNG.run(TestNG.java:1025)
	at org.testng.remote.RemoteTestNG.run(RemoteTestNG.java:109)
	at org.testng.remote.RemoteTestNG.initAndRun(RemoteTestNG.java:202)
	at org.testng.remote.RemoteTestNG.main(RemoteTestNG.java:173)
Caused by: org.testng.TestException: 
Method ThreadExecutorServiceDemo.testUsingThreadsWithExceptions()
[pri:0, instance:testng.samples.ThreadExecutorServiceDemo@4fbc9499] should have thrown an exception of 
class java.lang.RuntimeException
	at org.testng.internal.Invoker.handleInvocationResults(Invoker.java:1500)
	at org.testng.internal.Invoker.invokeMethod(Invoker.java:751)
	at org.testng.internal.Invoker.invokeTestMethod(Invoker.java:894)
	at org.testng.internal.Invoker.invokeTestMethods(Invoker.java:1219)
	... 16 more


===============================================
    Default test
    Tests run: 4, Failures: 1, Skips: 0
===============================================


===============================================
Default suite
Total tests run: 4, Failures: 1, Skips: 0
===============================================
```
