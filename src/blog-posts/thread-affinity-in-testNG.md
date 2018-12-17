---
title: 'Thread Affinity in TestNG'
date: '2018-11-23'
tags: ['Java', 'TestNG']
---

Most of us would have at some point or the other built a Selenium based TestNG test that kind of looks like below:

```java
public class TestClass {

  @Test
  public void a() {
    System.err.println("Running a() on Thread " + Thread.currentThread().getId());
  }

  @Test
  public void b() {
    System.err.println("Running b() on Thread " + Thread.currentThread().getId());
  }

  @Test(dependsOnMethods = "a")
  public void c() {
    System.err.println("Running c() on Thread " + Thread.currentThread().getId());
  }
}
```

When running this above class with **parallel="methods"** we would be expecting that TestNG would run the method `a()` and `c()` on the same thread.

But TestNG doesn’t do that. It guarantees that `c()` would be run only if `a()` has run to completion and if it has passed, but it doesn’t guarantee to you that they would run in the same thread.

Here’s how the output looks like:

```bash
...
... TestNG 7.0.0-beta1 by Cédric Beust (cedric@beust.com)
...
Running a() on Thread 11

Running b() on Thread 12
Running c() on Thread 13
PASSED: b
PASSED: a
PASSED: c
```

I managed to get this fixed in TestNG (Its available for use from the currently released beta version **7.0.0-beta1**) so that when you run a test class such as the one shown above, you will see both `a()` and `c()` run on the same thread.

I named this capability as **Thread affinity**. To enable this feature (This is by default turned off in TestNG or else this will cause backward compatibility problems to the current users), you merely need to add the JVM argument `-Dtestng.thread.affinity=true`.

Here’s the output of the same test class, when run with this JVM argument

```bash
...
... TestNG 7.0.0-beta1 by Cédric Beust (cedric@beust.com)
...
Running b() on Thread 12
Running a() on Thread 11
Running c() on Thread 11
PASSED: b
PASSED: a
PASSED: c

===============================================
    my-test
    Tests run: 3, Failures: 0, Skips: 0
===============================================
```

As you can see from the output, TestNG now runs both `a()` and `c()` on the same thread.

There’s a catch to this feature though. Your Test method should not depend on more than one methods, because logically speaking, if you define a method as depending on two methods and you turn on this feature, TestNG wouldn’t know which thread to pick for running the dependent test.
