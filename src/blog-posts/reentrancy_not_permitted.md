---
title: 'Reentrancy Not permitted'
date: '2019-01-15'
tags: ['Go']
---

GoLang is all about its simplicity when it comes to supporting concurrency.

There are primarily just two things that one needs to know about concurrency in GoLang:

* Managing shared states
* Communication between concurrently running goroutines.

One can manage shared states in GoLang by using mutexes (via implementations of the `sync.Locker` interface).

When it comes to establishing communication between concurrently running goroutines one can make use of `Channels`.

But that is not what we are going to talk about here. There are enough detailed blogs and tutorials that show how to do that.

We are going to just talk about one unique aspect of `sync.Locker` implementations viz., Reentrancy.

In a nutshell `Reentrancy` can be defined as follows :

Quoting [Wikipedia](https://en.wikipedia.org/wiki/Reentrancy_(computing))

> In computing, a computer program or subroutine is called reentrant if it can be interrupted in the middle of its execution and then safely be called again ("re-entered") before its previous invocations complete execution. The interruption could be caused by an internal action such as a jump or call, or by an external action such as an interrupt or signal. Once the reentered invocation completes, the previous invocations will resume correct execution.

It turns out that mutex implementations in GoLang are not re-entrant in nature.

Here's a sample:

An interface that defines what a Map should support as operations:

```golang
type Map interface {
	Get(string) (interface{}, bool)
	Put(string, interface{}) bool
}
```

Here's a typical implementation which has deadlocks in them:

```golang
import "sync"

type ordinaryMap struct {
	lock sync.Mutex
	data map[string]interface{}
	Map
}

func (t *ordinaryMap) Get(key string) (interface{}, bool) {
	t.lock.Lock()
	defer t.lock.Unlock()
	data, ok := t.data[key]
	return data, ok
}

func (t *ordinaryMap) Put(key string, value interface{}) bool {
	t.lock.Lock()
	defer t.lock.Unlock()
	_, ok := t.Get(key)
	t.data[key] = value
	return ok
}

```

And here's a test which can be executed to see the deadlock in action:

```golang
func TestDemonstrateDeadLocks(t *testing.T) {
	myMap := DeadlockProneThreadSafeMap()
	myMap.Put("name", "Krishnan")
	data, found := myMap.Get("name")
	fmt.Println("Data = ", data)
	if !found {
		t.Error("should have found")
	}
}

func DeadlockProneThreadSafeMap() Map {
	return &ordinaryMap{data: make(map[string]interface{}, 0)}
}
```

Now when you run this above test, you would see something like below:

```bash
fatal error: all goroutines are asleep - deadlock!
goroutine 1 [chan receive]:
testing.(*T).Run(0xc4200a4000, 0x1138d54, 0x18, 0x113db10, 0x10685d6)
	/usr/local/go/src/testing/testing.go:790 +0x2fc
testing.runTests.func1(0xc4200a4000)
	/usr/local/go/src/testing/testing.go:1004 +0x64
testing.tRunner(0xc4200a4000, 0xc420045de0)
	/usr/local/go/src/testing/testing.go:746 +0xd0
testing.runTests(0xc42000a060, 0x11dbea0, 0x2, 0x2, 0xc42004e3b0)
	/usr/local/go/src/testing/testing.go:1002 +0x2d8
testing.(*M).Run(0xc420045f18, 0xc420045f70)
	/usr/local/go/src/testing/testing.go:921 +0x111
main.main()
```

The root cause of this problem is from this line:

```golang
myMap.Put("name", "Krishnan")
```

If you go back and see the implementation you would notice that the `Put()` method does the following:

1. Obtains a lock on the struct.
2. Then it invokes `Get()` method. But unfortunately `Get()` method also needs to lock before it can finish its operation. But the lock is already held by `Put()` method.

**End-result:** We have a dead-lock.

If you come from a programming language such as Java for e.g., you will be startled at this because locks in Java are re-entrant in nature.

Unfortunately locks in GoLang aren't so.

The correct way of implementing the same would be as below:

```golang
import "sync"

type threadSafeMap struct {
	lock sync.Mutex
	data map[string]interface{}
	Map
}

func (t *threadSafeMap) Get(key string) (interface{}, bool) {
	t.lock.Lock()
	defer t.lock.Unlock()
	return t.get(key)

}

func (t *threadSafeMap) Put(key string, value interface{}) bool {
	t.lock.Lock()
	defer t.lock.Unlock()
	return t.put(key, value)

}

func (t *threadSafeMap) get(key string) (interface{}, bool) {
	data, ok := t.data[key]
	return data, ok
}

func (t *threadSafeMap) put(key string, value interface{}) bool {
	_, ok := t.get(key)
	t.data[key] = value
	return ok
}
```

If you look closely, you would notice that we have :

* an exported method variant and 
* an un-exported method variant for the same functionality. 

Only difference is "exported methods" are guarded by locks and the un-exported methods aren't. 

The un-exported methods call each other to get the job done and the exported methods just offer **mutual exclusion** and thus **thread-safety** to its callers.

It seems that this is one of the most common ways of implementing locks.

Here's a test which shows that this new model works:

```golang
func TestDemonstrateDeadLockMitigation(t *testing.T) {
	myMap := DeadlockFreeThreadSafeMap()
	myMap.Put("name", "Krishnan")
	data, found := myMap.Get("name")
	fmt.Println("Data = ", data)
	if !found {
		t.Error("should have found")
	}
}

func DeadlockFreeThreadSafeMap() Map {
	return &threadSafeMap{data: make(map[string]interface{}, 0)}
}
```
