---
title: 'Using the listener factory in TestNG'
date: '2013-02-10'
tags: ['TestNG']
---


# Using the listener factory in TestNG


Sometime back I stumbled into a `ListenerFactory` in TestNG.

I have tried hunting for information about it, but so far, here’s what I have as information about it.

A `ListenerFactory` is a factory for instantiating your test specific listeners. This factory can be plugged into TestNG only via the `@Listeners` annotation. So this means that this factory can be inserted into Test classes on a per class basis but you cannot add it via the `<listeners>` tag to your suite file.

The second thing that I learnt about this listener factory is that per JVM there can only exist ONE instance of a TestListener factory that can exist. I haven’t yet tried figuring out what happens when there are more than one instances of such a listener.

You begin by implementing the `org.testng.ITestNGListenerFactory` and then you associate this class via the `@Listeners` annotation.

Here’s how a sample looks like 

```java
package testng.samples;

import org.testng.IExecutionListener;
import org.testng.ITestNGListener;
import org.testng.ITestNGListenerFactory;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

/*

 The following points are worth keeping in mind :

 1. The class that implements ITestNGListenerFactory must be made known to TestNG only via the @Listeners annotation. 
    Using <listeners> tag in the suite file will NOT cause this listener to be invoked, 
    because this is a "Test" class listener.
 2. As per the javadocs of ITestNGListenerFactory, ONLY one instance of the object that implements ITestNGListenerFactory 
    must exist in memory.
 */


@Listeners(PlayingWithListenerFactory.class)
public class PlayingWithListenerFactory implements ITestNGListenerFactory, ITestNGListener {

	@Test
	public void foo() {
		System.out.println("Hello world foo()");
	}

	@Override
	public ITestNGListener createListener(Class<? extends ITestNGListener> listenerClass) {
		System.out.println("create listener called");
		return new MyExecutionListener();
	}

	public static class MyExecutionListener implements IExecutionListener {

		public MyExecutionListener() {
			System.out.println("Listener instantiated");
		}

		@Override
		public void onExecutionStart() {
			System.out.println("exec start");

		}

		@Override
		public void onExecutionFinish() {
			System.out.println("exec finished");

		}
	}

}
```

The following points are worth keeping in mind :

1. The class that implements `org.testng.ITestNGListenerFactory` must be made known to TestNG only via the `@Listeners` annotation. Using tag in the suite file will NOT cause this listener to be invoked, because this is a **Test** class listener.
2. As per the javadocs of `org.testng.ITestNGListenerFactory`, ONLY one instance of the object that implements `org.testng.ITestNGListenerFactory` must exist in memory.
