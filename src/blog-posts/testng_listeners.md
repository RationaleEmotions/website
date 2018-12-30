---
title: 'Listen to what I have to say about “TestNG” Listeners'
date: '2012-01-27'
tags: ['TestNG']
---

# “Listen” to what I have to say about “TestNG” Listeners

What are these listeners ? What does TestNG stand to offer to us with them ? This question is something that someone seemed to have. So thought I might as well add up my “2 cents” to un-ravelling its mysteries.

Although I would try my level best to explain what it is, one must never forget that I regard Cedric’s [Next Generation Testing](https://www.amazon.in/Next-Generation-Java-Testing-Advanced/dp/8131721906/) as my Bible and all that I am now going to blabber have been because I managed to read this book. Hat’s off to Cedric for that ! 🙂

In-case you have done/or exposed to windows programming you would be familiar with the term “events”. 

Events are specific actions that happen on something for e.g., button clicked! is an event. A simple e.g., would be your mobile plays a sound everytime you get a call.. another event 🙂 Incoming call is an “event” here and your mobile playing a tune is the result of an “event handler” being invoked 🙂 

Listeners are basically those entities which are tuned into one or more events that may arise.

TestNG has awesomely managed to leverage this concept and provide a cleaner way of doing things.

### So what are TestNG Listeners ?

They are basically “your” classes, which implement some interfaces that TestNG provides, so that when TestNG raises certain events it will look for all “classes” which are basically looking for such events and call the respective event handlers in them.. Confused ??

Its ok to be confused ! I was confused to the core too.

So lets start off with a sample program which will show how to use Listeners.

Here’s a sample Listener that I created, which basically takes care of Starting and Stopping a Selenium Server.

```java
package com.test.listeners;

import org.openqa.selenium.server.RemoteControlConfiguration;
import org.openqa.selenium.server.SeleniumServer;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import org.testng.Reporter;

public class SeleniumStarterListener implements ISuiteListener {
	private static SeleniumServer server = null;
	private static RemoteControlConfiguration configuration = null;
	private static boolean isServerStarted = false;

	public void onStart(ISuite suite) {

		configuration = new RemoteControlConfiguration();
		configuration.setPort(4444);
		try {
			server = new SeleniumServer(configuration);
			server.boot();
			isServerStarted = true;
			Reporter.log("Started the selenium server", true);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void onFinish(ISuite suite) {
		if (isServerStarted) {
			server.stop();
			Reporter.log("Stopped the selenium server", true);
		}
	}

}
```

If you look at this listener, its no big complex thing. It is just an ordinary class that implements an Interface named `org.testng.ISuiteListener`.

Whenever a class implements this listener, TestNG guarantees the end-user that it will invoke the methods `onStart()` and `onFinish()` before and after running a TestNG Suite.

So before TestNG picks up your suite for execution, it first makes a call to `onStart()` method and runs whatever has been scripted in this method. In a similar way, it again makes a call to `onFinish()` method after a suite has been run.

So what other listeners are there in TestNG ?

There are a lot of listeners. But I will give you an over view on the most common listeners that you would need :

* `org.testng.IReporter` : Implement this listener within your class, if you want to customize the TestNG reports (for e.g., you might want your test reports to be available as an excel sheet or a word document or even a pdf for that matter). This would be the last of the calls that TestNG makes before closing your execution.
* `org.testng.IInvokedMethodListener` : Implement this listener within your class, if you want something to be done before and after a method is invoked by TestNG. Some classic examples would be, instantiating and closing off the WebDriver for e.g.,.
* `org.testng.IInvokedMethodListener2` : Implement this listener within your class if you want all that `IInvokedMethodListener` can do, but also give you access to the `ITestContext` object. `ITestContext` object essentially is the contextual representation of all the relevant information for a given TestNG run.
* `org.testng.ITestListener` : Implement this listener within your class if you want to be notified before and after a test (`<test>`) is run. This would also give you a way in which you can specify as to what should be done when a particular test is passed/skipped/failed etc., A simple use case would be to implement some sort of a running commentary on the console indicating how many tests have so far run, how many passed and so on and so forth.

Ok, so now am guessing that you must be pretty aware of what listeners are all about and we also saw how to write a listener. Now comes the big question.

How do I let TestNG know that I have such a listener which it should invoke when it is executing my tests ?

There are essentially four ways of adding up a listener to a particular class. I will walk you through on all of the three ways [at-least these are the only ways I know of 🙂 ] :

### Using the @Listeners TestNG provided annotation.

This is the easiest way of binding your implemented TestNG Listener to your test class.

Before your class definition, you just add up this listener as below

```java
@Listeners(SeleniumStarterListener.class)
public class IUseListeners {
 
    private Selenium selenium = null;
 
    @BeforeClass
    public void setup() {
        selenium = new DefaultSelenium("localhost", 4444, "*firefox", "http://www.google.com");
        selenium.start();
    }
 
    @Test
    public void f() {
        selenium.open("http://www.facebook.com   }
 
    @AfterClass
    public void tearDown() {
        selenium.stop();
    }
}
```

Here if you notice, I am telling TestNG that for my test class `IUseListeners` I need TestNG to refer to the class `SeleniumStarterListener` and invoke the corresponding methods within it as and when a relevant TestNG “triggered” event happens. So in this case, TestNG will first invoke my `onStart()` method in my Listener class before it begins executing my Test (remember, that if you dont provide a suite for your class as I have done here, TestNG creates a default suite, defines a default Test and adds up your testclass to it). That is why I when you execute this sample test along with the listener, the listener takes care of starting the selenium server and stopping it. Clean way of doing it isn’t it ?? That is what TestNG Listeners are there for 🙂

### By using the `<listeners>` tag in your TestNG Template file.

Although approach 1 is more than enough to get you started, it’s not an “elegant” way of using Listeners, because you are forced to add this `@Listeners ` section to each of your classes, which you perhaps wont want. So what you do is, you create a TestNG Suite file and then add up the listeners section to this suite file. That way, all of your tests would essentially leverage the listener that you wrote. So in our case, before the suite starts (remember a suite can contain one or more suites within itself, one or more tests within itself and each `<test>` can have one or more test classes in it).

So here’s how a typical xml file would look like :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Suite" parallel="false">
    <listeners>
        <listener class-name="com.test.listeners.SeleniumStarterListener"/>
    </listeners>
    <test name="Test" preserve-order="false">
        <classes>
            <class name="com.test.IUseListeners" />
        </classes>
    </test>
</suite>
```

Pay close attention to the <listeners> section here. I have defined this listener at the suite level and have given the **fully qualified name** of my Listener class.


### Programmatic injection of Listeners

When you are working with TestNG class directly and want to pro-grammatically run your Tests you can specify your Listeners as below :

Here’s a sample code which shows you how to do this in a main() program of Java.

```java
public static void main(String[] args) {
    TestNG testng = new TestNG();
    Class[] classes = new Class[]{IUseListeners.class};
    testng.addListener(new SeleniumStarterListener());
    testng.setTestClasses(classes);
    testng.run();
}
```


So now if you think you are ready for some seriously complicated listeners take a look at this `AnnotationTransformer` Listener that I managed to create, sometime back..

```java
import org.testng.annotations.Test;

@Test
public class AmDependent {
	public void methodD() {
		System.out.println(this.getClass().getSimpleName()
				+ ".method D : Thread ID : " + Thread.currentThread().getId());
		
	}

	public void methodE() {
		System.out.println(this.getClass().getSimpleName()
				+ ".method E : Thread ID : " + Thread.currentThread().getId());
	}

	public void methodF() {
		System.out.println(this.getClass().getSimpleName()
				+ ".method F : Thread ID : " + Thread.currentThread().getId());
	}
}
```

```java
import org.testng.annotations.Test;

@Test
public class AmIndependent {

	public void methodA() {
		System.out.println(this.getClass().getSimpleName()
				+ ".method A : Thread ID :" + Thread.currentThread().getId());

	}

	public void methodB() {
		System.out.println(this.getClass().getSimpleName()
				+ ". method B : Thread ID : " + Thread.currentThread().getId());
	}

	public void methodC() {
		System.out.println(this.getClass().getSimpleName()
				+ ". method C : Thread ID : " + Thread.currentThread().getId());
	}
}
```

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

import org.testng.IAnnotationTransformer;
import org.testng.annotations.ITestAnnotation;

public class GroupsDependencyRuntimeInjector implements IAnnotationTransformer {
	public void transform(ITestAnnotation annotation, Class testClass,
			Constructor testConstructor, Method testMethod) {
		String []values = GroupTracker.getInstance().setDependency();
		String []groups = {values[0]};
		annotation.setGroups(groups);
		String []dependsOnGroups = {values[1]};
		dependsOnGroups[0] = values[1];
		if (!values[1].isEmpty())
			annotation.setDependsOnGroups(dependsOnGroups);
		System.out.println("Generated groupName = " + values[0]);
		System.out.println("Generated dependsOnGroupsName =" + values[1]);	
	}
}
```

```java
public class GroupTracker {
	private String groupName = null;
	private String dependsOnGroups = null;
	private String lastGroupName = null;
	private boolean isMasterGroupTaken = false;
	private static GroupTracker gp = null;
	private GroupTracker(){		
	}
	public static GroupTracker getInstance(){
		if (gp == null){
			gp = new GroupTracker();
			gp.groupName = "MasterGroup";
			gp.dependsOnGroups = "";
		}
		return gp;
	}
	public synchronized String[] setDependency(){
		String[]  returnValues = new String[2];
		if (isMasterGroupTaken){
			this.lastGroupName = groupName;
			groupName = "Group" + System.nanoTime();
			this.dependsOnGroups = this.lastGroupName;
		}
		if ("MasterGroup".equals(groupName)){
			this.isMasterGroupTaken = true;
		}
		returnValues[0] = groupName;
		returnValues[1] = dependsOnGroups;
		return returnValues;
	}
}
```

TestNG suite xml looks like below:

```xml
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Suite" parallel="methods">
	<listeners>
		<listener class-name="mypackage.GroupsDependencyRuntimeInjector" />
	</listeners>
	<test name="Test">
		<packages>
			<package name="mypackage" />
		</packages>
	</test>
</suite>
```

### Using the ServiceLoaders approach.

Rather than me duplicating things again, I am going to just point back at the relevant TestNG documentation which talks about this. Please refer [here](http://testng.org/doc/documentation-main.html#listeners-service-loader).

Hope that helps you get started working with Listeners..!
