---
title: 'Sharing parameters among different TestNG suites'
date: '2014-02-06'
tags: ['TestNG']
---

# Sharing parameters among different TestNG suites

Off late I have been seeing a couple of queries every now and then which asks **How do I share parameters across multiple TestNG suite xmls**, so I thought I would perhaps write up a post which details it.

There are two ways in which this can be done.

## Approach (1)

Leverage what TestNG directly has to offer, which is “create a suite of suites”. Incase you are wondering how to get this done, here’s how you do it.

For example sake, lets assume that we have the below test class.

```java
package com.rationaleemotions.wordpress.sharing;
 
import org.testng.Assert;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;
 
public class ReadParameters {
    @Test
    @Parameters({ "username" })
    public void f(String userName) {
        Assert.assertTrue(userName.equals("testng"));
        System.err.println("User name is " + userName);
    }
}
```

As you can see this is a simple Test class, which accepts a parameter via the `@Parameters` annotation and then runs an Assert on it.

Now lets look at how our suite xml file would look like : [ We will call this suite file as `testng-childsuite.xml` which is located under `src/test/resources` in my project]

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="MyTestSuite" parallel="false" verbose="2">
    <test name="MyTest">
        <classes>
            <class name="com.rationaleemotions.wordpress.sharing.ReadParameters" />
        </classes>
    </test> 
</suite>
```

Now lets create a Suite of Suites as below : [ We will call this suite file as `testng-mastersuite.xml`]

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="MasterSuite" parallel="false">
    <parameter name="username" value="testng"></parameter>
    <suite-files>
        <suite-file path="src/test/resources/testng-childsuite.xml"/>        
    </suite-files>
</suite> <!-- MasterSuite -->
```

Now run `testng-mastersuite.xml` and you will see that the parameter `username` that I had in my master suite automatically got passed over to the child suite viz., `testng-childsuite.xml` automatically and the assert passes.

## Approach (2)

This was a new learning for me as well and I picked up this from [this post](https://groups.google.com/d/msg/testng-users/5LhzoDiazsM/Vvy94iNAb2gJ) on the testng-users google forum.

Our Test class is going to remain the same. So I am not going to be duplicating it again here.

Now lets create a simple xml file and add up all the parameters that we feel need to be shared across multiple suites.

Lets call it `parameters.xml` and it is available under `src/test/resources/sharing` folder in our test project.

Here’s how it's contents would look like :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<parameter name="username" value="testng"/>
```

Now lets create a basic TestNG xml suite file and then refer to the above mentioned `parameters.xml` in it. Lets call it as `standalone-testsuite.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite [<!ENTITY parent SYSTEM "src/test/resources/sharing/parameters.xml">]>
<suite name="MyTestSuite" parallel="false" verbose="2">
  <parameters>&parent;</parameters>
  <test name="MyTest">
    <classes>
      <class name="com.rationaleemotions.wordpress.sharing.ReadParameters"/>
    </classes>
  </test>
</suite>
```

Couple of items that are worth mentioning here.

* `[<!ENTITY parent SYSTEM "src/test/resources/sharing/parameters.xml">]>` is basically our way of saying that this xml file has an entity (which we will call as `parent`) and it maps to the resource `parameters.xml` that resides under `src/test/resources/sharing/` folder.

* `&parent;` is basically our way of saying that within the tag we are going to be replacing the contents of `parameters.xml`, which we are denoting via the name `parent` (notice that we gave our entity its name as `parent`). The entity name is supposed to be prefixed by an **ampersand** and it is supposed to end with a **semi-colon**.

Now run the `standalone-testsuite.xml` and you would notice that the assert passes.

Hope that helps you understand how to share parameters across different TestNG suite xmls.

### Note

* This suite may not be recognized properly by IDEs such as **IntelliJ**
* This suite will run fine when run from the command prompt using a build tool such as `maven`.
* When executed using TestNG `7.0.0.-beta1` you may see a warning such as below (which encourages you to add the **DOCTYPE** tag. If the tag is added then the suite xml will become invalid. Also its not sure till when would TestNG be lenient with suite xml files that don't have the **DOCTYPE** tag and start mandating it. Until then, this solution would work.

```bash
[INFO] --- maven-surefire-plugin:3.0.0-M1:test (default-test) @ testbed ---
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running TestSuite
[TestNGContentHandler] [WARN] It is strongly recommended to add "<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd" >" at the top of your file, otherwise TestNG may fail or not work as expected.
...
... TestNG 7.0.0-beta1 by Cédric Beust (cedric@beust.com)
...

User name is testng
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.384 s - in TestSuite
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  15.861 s
[INFO] Finished at: 2018-12-31T10:22:36+05:30
[INFO] ------------------------------------------------------------------------

```



