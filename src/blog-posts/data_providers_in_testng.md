---
title: 'What are data providers in TestNG'
date: '2015-08-24'
tags: ['TestNG']
---

# What are data providers in TestNG

Data providers is a very common need when you are building tests that are data driven in nature.

TestNG provides for two types of data providers.

1. Greedy Data provider
2. Lazy Data provider

Both the above flavors of data providers can be used in your TestNG driven tests to satisfy the following scenarios.

1. You need to run 1 particular `@Test` annotated test method “n” times.
2. You need to run 2 or more sets of `@Test` annotated test methods “n” times wherein the test methods leverage the data provided to it for every iteration.

#### Lets take a look at what is the Greedy Data Provider in TestNG.

When you are working with a data set that is relatively small (for e.g., you are having a spreadsheet/text file/XML file/JSON file/Yaml file that has just a few 100 records) you would want to load all the data in one shot and then have TestNG work with the loaded data. This way of facilitating data driven tests is called as a Greedy Data Provider.

A simple format of a data provider of this format would look like below

```java
public class GreedyDataProviderExample {
    @DataProvider(name = "data-source")
    public Object[][] allDataInOneShot() {
        return new Object[][] { { "Java" }, { "TestNG" }, { "JUnit" } };
    }
 
    @Test(dataProvider = "data-source")
    public void myTestMethod(String info) {
        Reporter.log("Data provided was :" + info, true);
    }
}
```

For a basic understanding of the syntax and semantics of Data providers you should always refer to the [TestNG documentation](http://testng.org/doc/documentation-main.html#parameters-dataproviders)

But here’s a quick recap of the most important things that you need to remember.

* A Data provider must always return a 2 dimensional array object. You can decide on how you want to fill up the 2 dimensional array.
* A Data provider must be annotated with the annotation `@DataProvider`. You can choose to give it a name using the “name” attribute. If you don’t provide a name, then TestNG will consider the method name to be the data provider name as well.
* You use the `dataProvider` attribute of the `@Test` annotation to inform TestNG that the test method is not a regular method and it needs to be executed 1 or more times. The parameter that the Test method is expecting would be provided to it by the data provider method.

In the case of a Greedy data provider, following is how TestNG goes about executing your test.

1. TestNG first loads the Test class using Reflection and instantiates the test class by invoking the default constructor.
2. It then introspects the test class and looks for `@Test` annotated methods (which are considered to be test methods)
3. If a method has arguments as part of its declaration, TestNG then looks up the dataProvider attribute to figure out how to provide values for the arguments of the `@Test` annotated test method.
4. It then executes the logic within the `@DataProvider` annotated method and creates the 2 dimensional array of Object and stores it separately.
5. It then alternates between the test method and the 2 dimensional Object array and provides data for every iteration.

As seen above, since TestNG loads your entire test data in one shot at the beginning itself, this mechanism of working with data providers is called greedy data providers.

Now suppose you are working with a very huge data set, or lets assume that your test data flows to you via a stream (such as network call ), then you would realize that this mechanism doesn’t scale very well. This is where Lazy data providers are handy.

#### Lets take a look at what is the Lazy Data Provider in TestNG.

A Lazy Data provider in TestNG is basically a data provider, that loads the data required for a given iteration one set at a time. So lets say you have a file that has 1 million records of employees, which you want to iterate for a test method, then TestNG would ensure that it doesn’t load all the 1 million records in one shot, but only load 1 record at a time for all the 1 million iterations.

A simple format of a data provider of this format would look like below:

```java
public class LazyDataProviderExample {
    @Test(dataProvider = "data-source")
    public void myTestMethod(String info) {
        Reporter.log("Data provided was :" + info, true);
    }
 
    @DataProvider(name = "data-source")
    public Iterator<Object[]> dataOneByOne() {
        return new MyData();
 
    }
 
    private static class MyData implements Iterator<Object[]> {
        private String[] data = new String[] { "Java", "TestNG", "JUnit" };
        private int index = 0;
 
        @Override
        public boolean hasNext() {
            return (index <= (data.length - 1));
        }
 
        @Override
        public Object[] next() {
            return new Object[] { data[index++] };
        }
 
        @Override
        public void remove() {
            throw new UnsupportedOperationException("Removal of items is not supported");
        }
    }
 
}
```

Some important things to remember when working with Lazy data providers :

* Your data provider would now have to return back an Iterator of Object arrays.
* Your data source would need to implement the Iterator interface and then have to manage how does one determine whether there is any more data or not, and also how to retrieve the next set of data.
* Since your data source providing class is only interested in iterating data, we can safely disable the ability to remove items by throwing an exception. This is not a mandatory need though.

What we have seen so far is how do you bind a data provider to a single `@Test` annotated test method. So what if we wanted two or more `@Test` annotated test methods to work with a same piece of test data in a data driven fashion ?

This is where we would leverage Factories and data driven test approach in TestNG.

There are two styles in which you do this :

1. Annotate the constructor with a `@Factory` annotation and tie it to a data provider (or)
2. Introduce a static method which will work as our factory  [ of-course it would also need to be annotated with a `@Factory` annotation ] and tie it to a data provider.

So lets look at both the variants.

#### The constructor acting as the entry point for data driven tests

Here’s a sample wherein the constructor is annotated with a `@Factory` annotation and is tied to a data provider, so that we can iterator over multiple sets of data.

```java
public class ConstructorPowererdDataDrivenTest {
    private int age;
    private String name;
 
    @Factory(dataProvider = "get-data")
    public ConstructorPowererdDataDrivenTest(String name, int age) {
        this.name = name;
        this.age = age;
    }
 
    @Test
    public void testValidName() {
        Assert.assertTrue(name != null && !name.trim().isEmpty());
    }
 
    @Test
    public void testValidAge() {
        Assert.assertTrue(age > 0);
    }
 
    @DataProvider(name = "get-data")
    public static Object[][] getData() {
        return new Object[][] { { "John", 10 }, { "Peter", 20 } };
    }
}
```

#### A static method acting as the entry point for data driven tests

Here’s another sample wherein a static method produces the instances.

```java
public class FactoryMethodPoweredDataDrivenTest {
    private String name;
    private int age;
 
    public FactoryMethodPoweredDataDrivenTest(String name, int age) {
        this.name = name;
        this.age = age;
    }
 
    @Test
    public void testValidName() {
        Assert.assertTrue(name != null && !name.trim().isEmpty());
    }
 
    @Test
    public void testValidAge() {
        Assert.assertTrue(age > 0);
    }
 
    @Factory(dataProvider = "get-data")
    public static Object[] produceTestClasses(String name, int age) {
        return new Object[] { new FactoryMethodPoweredDataDrivenTest(name, age) };
    }
 
    @DataProvider(name = "get-data")
    public static Object[][] getData() {
        return new Object[][] { { "Tom", 10 }, { "Jerry", 20 } };
    }
}

```

The above samples use the Greedy data provider mechanism, but you can always replace it with a **lazy data provider** mechanism and use the `Iterator` approach.
