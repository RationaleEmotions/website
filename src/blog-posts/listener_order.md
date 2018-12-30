---
title: 'Dears Listeners…stand in Q please'
date: '2016-12-26'
tags: ['TestNG']
---

# Dears Listeners…stand in Q please

Yes, you read the title right.. but I was not hinting at you the readers.. but I was referring to the TestNG listeners . We have all at some point or the other wondered.. what if I could have my listeners follow some order when they are being executed by TestNG. I too wondered this. There are many ways in which you can enforce order amongst TestNG listeners. In this post we will see one easy way in which you can force TestNG to maintain order when the listeners are executed.

Here’s how.

First we need to build one dummy listener that is going to implement all the TestNG interfaces (listener interfaces) that our actual listeners are going to be using. For the sake of simplicity I am going to assume that we will need two implementations which make use of  `org.testng.IInvokedMethodListener`.

Here’s how our actual listeners are going to look like:

**CustomerListenerOne**

```java
public class CustomListenerOne implements IInvokedMethodListener {
    @Override
    public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
        String msg = String.format("%s.beforeInvocation() was invoked", getClass().getName());
        System.err.println(msg);
    }
 
    @Override
    public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
        String msg = String.format("%s.afterInvocation() was invoked", getClass().getName());
        System.err.println(msg);
    }
}
```

**CustomListenerTwo**

```java
public class CustomListenerTwo implements IInvokedMethodListener {
    @Override
    public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
        String msg = String.format("%s.beforeInvocation() was invoked", getClass().getName());
        System.err.println(msg);
    }
 
    @Override
    public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
        String msg = String.format("%s.afterInvocation() was invoked", getClass().getName());
        System.err.println(msg);
    }
}
```

Now that we have seen how our listeners look like, lets move on to the next step.

Let’s now create a text file named `listeners.txt` and place it under `META-INF/services` (The folder can be anything, but I am using this folder structure because for those of us who are well aware of how [ServiceLoading](http://docs.oracle.com/javase/6/docs/api/java/util/ServiceLoader.html) in Java works, this folder name will be quite familiar)

Here’s how the contents of the file would look like :

```
org.rationale.emotions.CustomListenerTwo
org.rationale.emotions.CustomListenerOne
```

I have intentionally put the listener that ends with `One` as the second one to demonstrate the ordering logic (and to do away with any ambiguity around chronological ordering of listeners by TestNG etc., )

So lets build a dummy test listener which will also implement the same interface. Here’s how our listener looks like.

```java
import org.testng.*;
 
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;
 
public class TestNGListenerInvoker implements IInvokedMethodListener {
    private List<ITestNGListener> listeners = new LinkedList<>();
 
    public TestNGListenerInvoker() {
        initialiseListeners();
    }
 
    @Override
    public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
        for (ITestNGListener listener : listeners) {
            //Lets filter out only IInvokedMethodListener instances.
            if (listener instanceof IInvokedMethodListener) {
                ((IInvokedMethodListener) listener).beforeInvocation(method, testResult);
            }
        }
    }
 
    @Override
    public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
        for (ITestNGListener listener : listeners) {
            //Lets filter out only IInvokedMethodListener instances.
            if (listener instanceof IInvokedMethodListener) {
                ((IInvokedMethodListener) listener).afterInvocation(method, testResult);
            }
        }
    }
 
    private void initialiseListeners() {
        String file = "META-INF/services/listeners.txt";
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(getStream(file)))) {
            String line;
            while ((line = reader.readLine()) != null) {
                listeners.add(instantiate(line));
            }
        } catch (IOException e) {
            throw new TestNGException(e);
        }
    }
 
    private static InputStream getStream(String file) {
        InputStream stream;
        stream = Thread.currentThread().getContextClassLoader().getResourceAsStream(file);
        if (stream == null) {
            throw new IllegalStateException("Unable to locate the file " + file);
        }
        return stream;
    }
 
    private static ITestNGListener instantiate(String className) {
        if (className == null || className.trim().isEmpty()) {
            throw new IllegalArgumentException("Please provide a valid class name");
        }
        try {
            Class<?> clazz = Class.forName(className);
            if (! ITestNGListener.class.isAssignableFrom(clazz)) {
                throw new IllegalArgumentException(className + " does not implement a TestNG listener");
            }
            return (ITestNGListener) clazz.newInstance();
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
            throw new TestNGException(e);
        }
    }
}
```

Now that we have this dummy listener, you can choose to wire in this listener in one of the below mechanisms :

* via the listeners tag in your suite xml file (or)
* via [Service loading](http://testng.org/doc/documentation-main.html#listeners-service-loader) that TestNG provides.

That’s about it. Now your listeners will be invoked in the order in which they were specified in the `META-INF/services/listeners.txt` file.


### What is going on behind the scenes :

1. When it is first instantiated by TestNG, we initialise it via its constructor, wherein we have written code to find the file `META-INF/services/listeners.txt` through the `CLASSPATH`, read it line by line, instantiate the classes that were found in it and then add them up into our linked list of `ITestNGListener` objects.
2. Now in our dummy listener for every TestNG interface implementation, we just iterate our list, check if the element is an appropriate instance and if yes, we resort to doing casting and then invoking the actual method of the listener.

### Some caveats:
1. The limitation of this implementation is that once we have added entries into our `META-INF/services/listeners.txt` then they will always be invoked, i.e., this implementation would be suitable only for mandatory listeners and not for optional listeners.
2. We need to make sure that our file is something unique (i.e., `listeners.txt`) because if we are using this approach to build a test framework and if our downstream consumers also have a similar file name, then there can be chances that our listener loading and ordering can be interfered.

Here’s a sample output, when executed against a simple test class.

```java
public class SimpleTestClass {
    @Test
    public void helloWorld() {
        System.err.println("Hello World from " + getClass().getName());
    }
}
```

**Output:**

```
org.rationale.emotions.CustomListenerTwo.beforeInvocation() was invoked
org.rationale.emotions.CustomListenerOne.beforeInvocation() was invoked
Hello World from org.rationale.emotions.SimpleTestClass
org.rationale.emotions.CustomListenerTwo.afterInvocation() was invoked
org.rationale.emotions.CustomListenerOne.afterInvocation() was invoked
 
===============================================
Default Suite
Total tests run: 1, Failures: 0, Skips: 0
===============================================
```

