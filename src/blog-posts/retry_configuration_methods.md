---
title: 'Retrying configuration methods in TestNG'
date: '2020-04-19'
tags: ['TestNG']
---

## Problem statement

Build a capability such that configuration methods can be retried if there's a failure in a previous attempt.

## Pre-requistes

This requires that you use TestNG version `7.2.0` (or) higher because this is dependent on the fix for the issue [GITHUB-2257](https://github.com/cbeust/testng/issues/2257).

## How to do it.

The following steps can be followed to accomplish this.

1. Build a base class that implements `org.testng.Configurable` and ensure that all test classes extend this class.
2. Within its `run()` method you implement the retry aware logic.
3. Create a custom annotation that identifies configurations that need to be retried and don't need to be retried.
4. Parse the custom annotation from (3) in (2) and trigger the retry logic only if the custom annotation defined in (3) was found.


## Sample code


#### Custom annotation to express the intent to retry a configuration method

```java
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * Custom annotation that signals that a configuration method should be retried.
 */
@Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
@Target({METHOD, TYPE})
public @interface Retriable {

  /**
   * @return - How many times should a configuration be retried.
   */
  int attempts() default 1;
}
```

#### Base class which all test classes are expected to extend

```java
import org.testng.IConfigurable;
import org.testng.IConfigureCallBack;
import org.testng.ITestResult;

public class AbstractTestCase implements IConfigurable {

  @Override
  public void run(IConfigureCallBack callBack, ITestResult testResult) {
    Retriable retriable =
        testResult.getMethod().getConstructorOrMethod().getMethod().getAnnotation(Retriable.class);
    int attempts = 1;
    if (retriable != null) {
      attempts = retriable.attempts();
    }
    for (int attempt = 1; attempt <= attempts; attempt++) {
      callBack.runConfigurationMethod(testResult);
      if (testResult.getThrowable() == null) {
        break;
      }
    }
  }
}
```

#### Sample test class where-in a configuration is to be retried.

```java
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Test;

public class SampleTestCase extends AbstractTestCase {

  private int counter = 1;

  @BeforeSuite
  @Retriable(attempts = 4)
  public void beforeClass() {
    if (counter <= 3) {
      String msg = "Simulating a failure for attempt " + counter++;
      System.err.println(msg);
      throw new RuntimeException(msg);
    }
    System.err.println("Finally the configuration passed");
  }

  @Test
  public void testCase() {
    System.err.println("Running a testcase");
  }
}
```


#### Execution output

```
Simulating a failure for attempt 1
Simulating a failure for attempt 2
Simulating a failure for attempt 3
Finally the configuration passed

Running a testcase


===============================================
Default Suite
Total tests run: 1, Passes: 1, Failures: 0, Skips: 0
===============================================


Process finished with exit code 0
```
