---
title: 'How to run test methods in parallel but test classes in sequence'
date: '2016-08-17'
tags: ['TestNG']
---

# How to run test methods in parallel but test classes in sequence

This question came up recently on the TestNG forum. Since when solving this question I had a chance to use one of the lesser known features of TestNG, I thought I should perhaps capture this as a blog so that it can help someone.

### Here’s the problem statement :

**A user on the forum wanted to have his/her test classes be executed in sequence, but wanted to have all the `@Test` annotated test methods in each of the test classes in parallel.**

As we know, TestNG provides the following parallel execution strategies :

* `tests` – This means that each of the `<test>` tags in the suite xml file would be executed in parallel.
* `classes` – This means that all of the test classes would be executed in parallel
* `methods` – This means that all of the `@Test` methods would be executed in parallel
* `instances` – This is applicable in the case of factories that are powered by a data provider and when set would cause the instances produced by a factory to run in parallel
* `false` – This disables parallel execution behaviour.

As you can see, with the above mentioned options, our problem statement cannot be solved directly.

I resorted to making use of a TestNG suite xml file for this.

So here’s how my Suite xml file looks like :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Class1Suite" parallel="methods" group-by-instances="true"
object-factory="organized.chaos.forums.testng.MyObjectFactory">
    <test name="instances">
        <packages>
            <package name="organized.chaos.forums.testng.*"/>
        </packages>
    </test>
</suite> 
```

If you looked closer, you would notice that we used a new attribute named `object-factory`.
From the [TestNG DTD](http://testng.org/testng-1.0.dtd.php) here’s the explanation for this attribute.

> A class that implements IObjectFactory that will be used to instantiate the test objects.


As the description says, if we provide a full qualified package name of a class that implements the TestNG provided interface `org.testng.IObjectFactory2`, then TestNG will create Test class (a test class is nothing but an ordinary java class that contains one or more `@Test` annotated test methods) instances only via our provided object-factory.

So lets take a look at how the class `organized.chaos.forums.testng.MyObjectFactory` looks like :

```java
package organized.chaos.forums.testng;
 
import org.testng.IObjectFactory2;
 
public class MyObjectFactory implements IObjectFactory2 {
    public MyObjectFactory() {
        System.err.println("Custom Factory being created");
    }
 
    @Override
    public Object newInstance(Class<?> cls) {
        try {
            return cls.newInstance();
        } catch (InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

Here’s how one of the test classes that resides in `organized.chaos.forums.testng` package looks like. I have about four of such classes, with each class having 2 methods.

```java
public class ClassOne {
    @Test
    public void testMethod() {
        String method = Reporter.getCurrentTestResult().getMethod().getMethodName();
        System.err.println("Running " + getClass().getName() + "." + method + "() on Thread [" + Thread.currentThread().getId() + "]");
    }
 
    @Test
    public void anotherTestMethod() {
        String method = Reporter.getCurrentTestResult().getMethod().getMethodName();
        System.err.println("Running " + getClass().getName() + "." + method + "() on Thread [" + Thread.currentThread().getId() + "]");
    }
}
```

Here’s how the output looks like. As you can see, the classes are being instantiated one after the other (at-least the output gives that impression) and within each of the classes, the test methods run in parallel.

```
Custom Factory being created
[TestNG] Running: multiple-classes.xml
Running organized.chaos.forums.testng.ClassTwo.anotherTestMethod() on Thread [11]
Running organized.chaos.forums.testng.ClassTwo.testMethod() on Thread [12]
Running organized.chaos.forums.testng.ClassFour.testMethod() on Thread [14]
Running organized.chaos.forums.testng.ClassFour.anotherTestMethod() on Thread [13]
Running organized.chaos.forums.testng.ClassOne.anotherTestMethod() on Thread [15]
Running organized.chaos.forums.testng.ClassOne.testMethod() on Thread [13]
Running organized.chaos.forums.testng.ClassThree.anotherTestMethod() on Thread [12]
Running organized.chaos.forums.testng.ClassThree.testMethod() on Thread [13]
 
===============================================
Class1Suite
Total tests run: 8, Failures: 0, Skips: 0
===============================================
```
