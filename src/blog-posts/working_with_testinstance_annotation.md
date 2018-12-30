---
title: 'Working with @TestInstance annotation'
date: '2016-06-06'
tags: ['TestNG']
---

# Working with @TestInstance annotation

Sometimes one would need to gain access to the test class instance to which an `@Test` annotated test method belongs to, from within a data provider. This could be particularly useful in cases, wherein the data provider may need to behave differently based on the type of the class to which the `@Test` method belongs to.

This is where the `@TestInstance` annotation from TestNG comes into picture. This annotation is typically used on the parameter of a data provider method.

Here’s a sample data provider.

```java
public static class LocalDataProvider {
    @DataProvider (name="data-provider")
    public static Object[][] getData(@TestInstance Object object) {
        System.err.println("The instance passed in was " + object.getClass().getCanonicalName());
        return new Object[][] {
            {1},
            {2}
        };
    }
}
```
Here are two test classes that make use of the above cited data provider.

**First test class**

```java
public static class FirstTestClass {
    @Test (dataProvider="data-provider", dataProviderClass=LocalDataProvider.class)
    public void testmethod(int number) {
        System.err.println("Value = " + number);
    }
}
```

**Second test class**

```java
public static class SecondTestClass {
    @Test (dataProvider = "data-provider", dataProviderClass=LocalDataProvider.class)
    public void testmethod(int number) {
        System.err.println("Value = " + number);
    }
}
```

Now when you run both the above mentioned test classes, you should see an output as below :

```
[TestNG] Running:
  /Users/krmahadevan/Library/Caches/IntelliJIdea2016.1/temp-testng-customsuite.xml
The instance passed in was organized.chaos.TestClassContainer.FirstTestClass
Value = 1
Value = 2
 
The instance passed in was organized.chaos.TestClassContainer.SecondTestClass
Value = 1
Value = 2
 
===============================================
Default Suite
Total tests run: 4, Failures: 0, Skips: 0
===============================================
```
