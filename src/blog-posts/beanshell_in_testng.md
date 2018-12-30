---
title: 'BeanShell and TestNG'
date: '2013-08-21'
tags: ['TestNG']
---

# BeanShell and TestNG

Very recently someone asked a question if I could have the luxury of referring to VM arguments in the TestNG Suite XML file so that they had the luxury of choosing the group to be run at run-time. At first I ended up responding with “NO” as an answer.

After pondering more over this question, I decided to do a deep dive on this and see if this can actually be done. So here’s what I have found.

Yes you can do this using TestNG..!!! Baffled ??? So was I 🙂

The answer to this problem is “BeanShell”. Not sure how many of us even know the fact that TestNG works with BeanShell as well and lets one use BeanShell as one of the method selectors in a suite xml file.

If you end up providing a method selector to TestNG in your suite XML file, TestNG only honours that and conveniently ignores the for groups.

If you feel like reading more, read [TestNG documentation](http://testng.org/doc/documentation-main.html#beanshell).

Here’s a sample class that has 3 test methods and all belong to different groups:

```java
package organized.chaos;
 
import org.testng.annotations.Test;
 
public class GroupsPlayGround {
    @Test(groups = "foo")
    public void foo() {
        System.out.println("foo() was invoked.");
    }
 
    @Test(groups = "bar")
    public void bar() {
        System.out.println("bar() was invoked.");
    }
 
    @Test(groups = "foobar")
    public void fooBar() {
        System.out.println("foobar() was invoked.");
    }
}
```

Now lets take a look at how does our TestNG XML suite file look like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Suite" parallel="false">
    <test name="Test">
        <method-selectors>
            <method-selector>
                <script language="beanshell">
                <![CDATA[
                    whatGroup = System.getProperty("groupToRun");
                    groups.containsKey(whatGroup);
                ]]>
                </script>
            </method-selector>
        </method-selectors>
        <classes>
            <class name="organized.chaos.GroupsPlayGround" />
        </classes>
    </test> <!-- Test -->
</suite> <!-- Suite -->
```

That’s all it takes. We now have embedded the ability to read from VM arguments and pass it to TestNG via the XML suite file itself.

So when you run this suite xml file, all you would need to do is specify the group name to be executed via the VM argument [`-DgroupToRun=foo` for e.g.,] and TestNG will pick up that specify group for execution.

There’s a lot of pretty cool stuff that you can do with BeanShell because it lets you access a lot of the core packages of Java directly.

This post of mine is definitely not intended to unearth all of that, but just to show you how to get started 🙂
