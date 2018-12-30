---
title: 'Running tests which don’t have TestNG annotations'
date: '2016-02-17'
tags: ['TestNG']
---

# Running tests which don’t have TestNG annotations

This question came up very recently on the TestNG forum and I found it to be quite interesting. So I decided to spend sometime trying to figure out how to get this to work.

The reason why this problem statement sounded interesting was because it was mentioned that the classes in question are all legacy and there is no access to source code so that they can be modified and TestNG annotations be added to them so that they can be executed properly.

Am pretty sure that there are much more elegant solutions to solving this problem but here’s how I thought of solving this problem.

You would need to rely on a library such as [JavaAssist](http://jboss-javassist.github.io/javassist/tutorial/tutorial.html) since we are going to be doing byte code manipulation.

You now need to build a utility class that can inject TestNG annotations into a class’s bytecode.

Here’s how that utility class would look like.

```java
import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.NotFoundException;
import javassist.bytecode.AnnotationsAttribute;
import javassist.bytecode.ClassFile;
import javassist.bytecode.ConstPool;
import javassist.bytecode.annotation.Annotation;
import org.testng.annotations.Test;
 
import java.util.ArrayList;
import java.util.List;
 
public class TestNGAnnotationInjector {
 
    public static Class[] addAnnotationToTestClass(String... classNames) throws NotFoundException, CannotCompileException {
        List<Class> classes = new ArrayList<>();
        for (String classname : classNames) {
            classes.add(addAnnotationToTestClass(classname));
        }
        return classes.toArray(new Class[classes.size()]);
    }
 
    public static Class addAnnotationToTestClass(String className) throws NotFoundException, CannotCompileException {
        ClassPool pool = ClassPool.getDefault();
        CtClass cc = pool.getCtClass(className);
        ClassFile ccFile = cc.getClassFile();
        ConstPool constpool = ccFile.getConstPool();
        AnnotationsAttribute attr = new AnnotationsAttribute(constpool, AnnotationsAttribute.visibleTag);
        Annotation annot = new Annotation(Test.class.getCanonicalName(), constpool);
        attr.addAnnotation(annot);
        ccFile.addAttribute(attr);
        return cc.toClass();
    }
}
```

I used [this blog post](http://ayoubelabbassi.blogspot.com/2011/01/how-to-add-annotations-at-runtime-to.html) as a reference for understanding how to work with JavaAssist.

Now we need to create a class with a main method because this class would now act as a mechanism for loading our legacy classes and then calling the newly built utility class shown above to inject the annotations. 

We will be using the TestNG APIs for doing this.

```java
import javassist.CannotCompileException;
import javassist.NotFoundException;
import org.testng.TestNG;
import org.testng.internal.PackageUtils;
 
import java.io.IOException;
import java.util.ArrayList;
 
public class TestNGAnnotationDemo {
    public static void main(String[] args)
        throws NotFoundException, 
        CannotCompileException, 
        ClassNotFoundException, IOException {
        String[] classes =
            PackageUtils.findClassesInPackage("organized.chaos.testng.legacy",
            new ArrayList<String>(), 
            new ArrayList<String>());
        Class[] clazz = TestNGAnnotationInjector.addAnnotationToTestClass(classes);
        TestNG testNG = new TestNG();
        testNG.setTestClasses(clazz);
        testNG.setVerbose(3);
        testNG.run();
    }
}
```
Here we are assuming that our legacy classes are located under the package `organized.chaos.testng.legacy`

When you run the above mentioned class class you should be able to see your legacy classes being executed by TestNG.

#### Points to remember:

* We are piggy backing on TestNG’s logic to decide on what should be branded as a test method [ Normally its always public methods with void return types ]. 
* We are also re-using TestNG’s internal implementation for finding classes in a given package by using `org.testng.internal.PackageUtils#findClassesInPackage`

Hope that helps!
