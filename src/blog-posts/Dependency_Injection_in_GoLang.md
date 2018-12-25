---
title: 'Dependency Injection in Go - My learnings'
date: '2018-12-25'
tags: ['Go']
---


Some of the expectations from a dependency injection container framework is as below (Borrowed from [this](https://medium.com/@minjiezha/alice-an-additive-dependency-injection-container-for-golang-883b0112cbeb) post on [medium](https://medium.com) by **Minjie Zha**):

1. **No code pollution:** 
    * There should be assistance in building the dependency graph. 
    * It should not require any change to existing components, either to start using a container or to remove a container. 
    * Components should have no knowledge of a container. 

2. **No partial object:** DI container should not encourage to create partially initialized objects.

3. **Easy to navigate the dependency graph:** A DI container should allow to put the graph definition in a central place, and make it easy to figure out how exactly an object is created and how the dependency is wired.

There are basically just two philosophies when it comes to Dependency injection in Golang.

1. Compile time Dependency Injection
2. Runtime Dependency Injection.

## Compile time Dependency Injection.

It basically makes use of code generation for getting the job done.
A user of this approach would need to ensure that all the required factory methods (Constructor methods of the corresponding structs) are handcrafted and made available. These are the building blocks for Dependency Injection.

The user then starts writing the injector function, wherein he/she expresses how to use various different providers (the factory methods that we created) to construct a new object in question. The Dependency Injection framework (such as `wire`) merely uses these functions to generate code (the generated code would have a function that matches the injector function signature) which contains all the verbose calls to all the different providers that are involved to create the object.

Since this is generated code it is idiomatic to golang. 

[Wire](https://github.com/google/wire) from **Google** relies heavily on this approach.

## Runtime dependency injection.

In this approach there's a heavy relying on reflection to get this done. Its done at runtime. So any missing dependencies that may not have been expressed, will fail only at runtime. This can be equated to what sophisticated Dependency Injection frameworks in Java such as `Spring` (or) `Guice` do.

* [Inject](https://github.com/facebookgo/inject) from **FaceBook** (and) 
* [Dig](https://github.com/uber-go/dig) from **Uber** 
* [Alice](https://github.com/magic003/alice) 

work on the reflection based approach.

## Dependency Injection frameworks out there

* Wire (Google) - https://github.com/google/wire
* Dig (Uber) - https://github.com/uber-go/dig
* Dargo *modelled after* [HK2 - Dependency Injection Kernel](https://javaee.github.io/hk2/) - https://github.com/jwells131313/dargo
* Alice - https://github.com/magic003/alice
* Inject (Facebook) - https://github.com/facebookgo/inject 
* Inject (codegansta) - https://github.com/codegangsta/inject 

## Code Samples

Now lets look at some code samples and cross compare them with different implementations. 

The sample has been borrowed from Drew Olson's [repository](https://gitlab.com/drewolson/go_di_example)

To begin with, following is how the problem statement can be displayed as:

The below entities are standalone and don't need anything else for them to be instantiated:

* `Config`
* `Person`

We have a type named `PersonRepository` that depends on `sql.DB` object and exposes a method named `FindAll()` which returns a slice of `Person` objects.

We have a custom end-point called `/people` which is bound to a handler. 
This handler makes use of a service named `PersonService` to retrieve the slice of `Person` objects.

The complete entities involved in the problem statement is found [here](https://github.com/krmahadevan/di/blob/master/pblm_statement.go).

### Manual way of doing dependency injection.

Here's how the code would look like:

```golang
func Main() {
	fmt.Println("Handcrafting Dependency Injection manually")
	config := di.NewConfig()
	fmt.Println("Database to be read from ", config.DatabasePath)

	db, err := di.ConnectDatabase(config)

	if err != nil {
		panic(err)
	}

	personRepository := di.NewPersonRepository(db)
	personService := di.NewPersonService(config, personRepository)
	server := di.NewServer(config, personService)
	server.Run()
}
```

### Dependency injection for the same problem using Uber's dig.

Here's how the code would look like:

```golang
func Main() {
	fmt.Println("Making use of [dig] as Dependency Injection")
	container := BuildContainer()
	err := container.Invoke(func(server *di.Server) {
		server.Run()
	})

	if err != nil {
		panic(err)
	}
}

func BuildContainer() *dig.Container {
	container := dig.New()
	_ = container.Provide(di.NewConfig)
	_ = container.Provide(di.ConnectDatabase)
	_ = container.Provide(di.NewPersonRepository)
	_ = container.Provide(di.NewPersonService)
	_ = container.Provide(di.NewServer)
	return container
}
```

### Dependency injection for the same problem using Google's wire

Here's how the code would look like:

```golang
func Main() {
	fmt.Println("Making use of [wire] as Dependency Injection")
	server, err := NewServerInstance()
	if err != nil {
		panic(err)
	}
	server.Run()
}
```

Contents of `wire.go` (This would need to be written by us)

```golang
//+build wireinject

package wire

import (
	"github.com/google/wire"
	"github.com/krmahadevan/di"
)

func NewServerInstance() (*di.Server, error) {
	wire.Build(di.NewConfig,
		di.ConnectDatabase, //Since this can return an error, we need to ensure we return back that same error
		di.NewPersonRepository,
		di.NewPersonService,
		di.NewServer)
	return &di.Server{}, nil
}
```

Now when you run `wire` from the command prompt the generated code would look like this:

```golang
// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package wire

import (
	"github.com/krmahadevan/di"
)

// Injectors from wire.go:

func NewServerInstance() (*di.Server, error) {
	config := di.NewConfig()
	db, err := di.ConnectDatabase(config)
	if err != nil {
		return nil, err
	}
	personRepository := di.NewPersonRepository(db)
	personService := di.NewPersonService(config, personRepository)
	server := di.NewServer(config, personService)
	return server, nil
}
```

## Reading material

* [Dependency Injection in Go by Márk Sági-Kazár](https://banzaicloud.com/blog/dependency-injection-go/)
* [Dependency Injection in Go by Drew Olson](https://blog.drewolson.org/dependency-injection-in-go)
* [Alice: an additive dependency injection container for Golang](https://medium.com/@minjiezha/alice-an-additive-dependency-injection-container-for-golang-883b0112cbeb)
* [Is there a better dependency injection pattern in golang? - Stackoverflow](https://stackoverflow.com/q/41900053)
* [Dependency injection containers will never really become a thing in Go](http://blog.jexia.com/dependency-injection-containers-will-never-really-become-thing-go/)

