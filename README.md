# Yape Code Challenge :rocket:

¡Bienvenido al Yape Code Challenge! Aquí encontrarás el código hecho por Julio Sarmiento.

## Table of Contents

- [Getting started](#getting-started)
- [Resolvers and Queries](#resolvers-and-queries)
- [Create a new transaction](#create-a-new-transaction)
- [Get a transaction](#get-a-transaction)
- [Domain Driven Architectures](#domain-driven-architectures)
- [DDD and Clean Architecture](#ddd-and-clean-architecture)
  - [Clean Architecture layers](#clean-architecture-layers)
  - [Project anatomy](#project-anatomy)
  - [The Dependency Rule](#the-dependency-rule)
  - [Server, Routes and Plugins](#server-routes-and-plugins)
  - [Controllers](#controllers)
  - [Use Cases](#use-cases)
- [ATDD](#atdd)
  - [What is ATDD?](#what-is-atdd)
  - [The Main Benefits](#the-main-benefits)
  - [Gherkin](#gherkin)
- [TDD](#tdd)
  - [What is TDD?](#what-is-tdd)
  - [How?](#how)
- [Pattern](#pattern)
  - [Bounded Context](#bounded-context)
  - [Mother Object](#mother-object)
  - [Value Object](#value-object)


## Getting started 

```
run: npm run dev
```

```
build: npm run prod
```

In your GraphQL GUI, open http://your_host:3001/graphql

## Resolvers and Queries

En el archivo `transactionResolver.ts`, se han definido resolvers para obtener y crear transacciones:


## Create a new transaction
```graphql
mutation CreateTransaction {
  createTransaction(input: {
    accountExternalIdDebit: "guid1",
    accountExternalIdCredit: "guid2",
    transferTypeId: 1,
    value: 800
	})
}
```
## Get a transaction
```graphql
query GetTransaction {
  getTransaction(transactionExternalId: "10ccea13-6127-45bf-83c0-97069ec0beb2") {
    id
    accountExternalIdDebit
    accountExternalIdCredit
    transferTypeId
    value
    transactionExternalId
    transactionType
    status
    createdAt
    updatedAt
  }
}

## Domain Driven Architectures

Software design is a very hard thing. From years, a trend has appeared to put the business logic, a.k.a. the (Business) Domain, and with it the User, in the heart of the overall system. Based on this concept, different architectural patterns was imaginated.

One of the first and main ones was introduced by E. Evans in its [Domain Driven Design approach](http://dddsample.sourceforge.net/architecture.html).

![DDD Architecture](https://res.cloudinary.com/practicaldev/image/fetch/s--5Izc96n2--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/neskpxcjjz9a53hs9xir.png)

Based on it or in the same time, other applicative architectures appeared like [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) (by. J. Palermo), [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) (by A. Cockburn) or [Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html) (by. R. Martin).

This repository is an exploration of this type of architecture, mainly based on DDD and Clean Architecture, on a concrete and modern JavaScript application.

## DDD and Clean Architecture

The application follows the Uncle Bob "[Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)" principles and project structure :

### Clean Architecture layers

![Schema of flow of Clean Architecture](https://1048636645-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-MAffO8xa1ZWmgZvfeK2%2F-MBmS7EO8Fe7VVZVRc_Q%2F-MBmS9tX9OP1kMC9I4z6%2Fimage.png?alt=media&token=5aff66d7-0528-45ba-95d3-003b2b824ca0)

### Project anatomy

```
src
 └ context                          → Application sources
   └ categories                     → Categories product
    └ application                   → Application services layer
      └ use_cases                   → Application business rules
    └ domain                        → Enterprise core business layer such as domain model objects (Aggregates, Entities, Value Objects) and repository interfaces
    └ infrastructure                → Frameworks, drivers and tools such as Database, the Web Framework, mailing/logging/glue code etc.
```

### The Dependency Rule

> The overriding rule that makes this architecture work is The Dependency Rule. This rule says that source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. That includes, functions, classes. variables, or any other named software entity.

src. https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html#the-dependency-rule

### Server, Routes and Plugins

Server, routes and plugins can be considered as "plumbery-code" that exposes the API to the external world, via an instance of Express.js server.

The role of the server is to intercept the HTTP request and match the corresponding route.

Routes are configuration objects whose responsibilities are to check the request format and params, and then to call the good controller (with the received request). They are registered as Plugins.

Plugins are configuration object that package an assembly of features (ex: authentication & security concerns, routes, pre-handlers, etc.) and are registered at the server startup.

### Controllers

Controllers are the entry points to the application context.

They have 3 main responsibilities :

1. Extract the parameters (query or body) from the request
2. Call the good Use Case (application layer)
3. Return an HTTP response (with status code and serialized data)

### Use Cases

A use case is a business logic unit.

It is a class that must have an `execute` method which will be called by controllers.

It may have a constructor to define its dependencies (concrete implementations - a.k.a. _adapters_ - of the _port_ objects) or its execution context.

**NOTE: A use case must have only one precise business responsibility!!!**

A use case can call objects in the same layer (such as data repositories) or in the domain layer, but not out...

## ATDD

### What is ATDD?

> Acceptance Test Driven Development (ATDD) involves team members with different perspectives (customer, development, testing) collaborating to write acceptance tests in advance of implementing the corresponding functionality. The collaborative discussions that occur to generate the acceptance test is often referred to as the three amigos, representing the three perspectives of customer (what problem are we trying to solve?), development (how might we solve this problem?), and testing (what about…).

> These acceptance tests represent the user’s point of view and act as a form of requirements to describe how the system will function, as well as serve as a way of verifying that the system functions as intended. In some cases the team automates the acceptance tests.

### The Main Benefits

Since ATDD might be considered a form of TDD, some of the benefits are the same. However, ATDD brings some benefits of its own:

- Quality: With the help of ATDD, teams can ensure that they're delivering the features in a way that matches the users' expectations.
- Collaboration: ATDD fosters communication and collaboration between technical and nontechnical people inside the organization.
- Regression suite: The ATDD process results in a comprehensive suite of acceptance tests that can detect whether changes to the codebase result in regressions—that is to say, defects coming back or older features no longer working.

### Gherkin

Gherkin uses a set of special keywords to give structure and meaning to executable specifications. Each keyword is translated to many spoken languages; in this reference we’ll use English [cucumber doc](https://cucumber.io/docs/gherkin/reference/). Gherkin example code:

```
Feature: Guess the word

  # The first example has two steps
  Scenario: Maker starts a game
    When the Maker starts a game
    Then the Maker waits for a Breaker to join

  # The second example has three steps
  Scenario: Breaker joins a game
    Given the Maker has started a game with the word "silky"
    When the Breaker joins the Maker's game
    Then the Breaker must guess a word with 5 characters
```

## TDD

### What is TDD?

> Test-driven development (TDD) is an evolutionary approach to development which combines test-first development, where you write a test before you write just enough production code to fulfil that test, and refactoring. In other words, it’s one way to think through your requirements or design before your write your functional code.

### How?

The first thing you need to understand is that writing code following TDD (discipline) is a (slightly) different approach from simply diving into solving the problem (without a test).
When reading about TDD you will usually see the expression: "Red, Green, Refactor":

![TDD](https://www.xeridia.com/wp-content/uploads/drupal-files/contenidos/blog/test-driven-development.png)

What this means is that TDD follows a 3-step process:

1. Write a Failing Test - Understand the (user) requirements/story well enough to write a test for what you expect. (the test should fail initially - hence it being "Red")

2. Make the (failing) Test Pass - Write (only) the code you need to make the (failing) test pass, while ensuring your existing/previous tests all still pass (no regressions).

3. Refactor the code you wrote take the time to tidy up the code you wrote to make it simpler (for your future self or colleagues to understand) before you need to ship the current feature, do it.

## Pattern

> In software engineering, a design pattern is a general repeatable solution to a commonly occurring problem in software design. A design pattern isn't a finished design that can be transformed directly into code. It is a description or template for how to solve a problem that can be used in many different situations.

### Bounded Context

> Bounded Context is a central pattern in Domain-Driven Design. It is the focus of DDD's strategic design section which is all about dealing with large models and teams. DDD deals with large models by dividing them into different Bounded Contexts and being explicit about their interrelationships.

![Example](https://martinfowler.com/bliki/images/boundedContext/sketch.png)

### Mother Object

> An object mother is a kind of class used in testing to help create example objects that you use for testing.
> When you write tests in a reasonably sized system, you find you have to create a lot of example data. If I want to test a sick pay calculation on an employee, I need an employee. But this isn't just a simple object - I'll need the employee's marital status, number of dependents, some employment and payroll history. Potentially this can be a lot of objects to create. This set data is generally referred to as the test fixture.

It works as a kind of factory from where the objects for the tests are created. In this case we use faker.
You can see examples on test folder

```
import { faker } from '@faker-js/faker';

export class MotherCreator {
  static random() {
    return faker;
  }
}
```

### Value Object

> Value Objects are a fundamental building block of Domain-Driven Design, and they’re used to model concepts of your Ubiquitous Language in code.

> The Value Object pattern reinforces a concept that is often forgotten in object-oriented principles, especially by those of us used to weakly typed languages: encapsulation.

```
export abstract class StringValueObject {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  equalsTo(anotherValue: string): boolean {
    return this.value === anotherValue;
  }

  differentTo(anotherValue: string): boolean {
    return this.value !== anotherValue;
  }

  toString(): string {
    return this.value;
  }
}
```

```
import { StringValueObject } from '../../shared/domain/value-object/StringValueObject';
import { CategoryBadRequestError } from './errors/CategoryBadRequestError';

export class CategoriesPathParams extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensurePathParamsIsThree();
  }

  private ensurePathParamsIsThree(): void {
    if (this.differentTo('3')) throw new CategoryBadRequestError('Invalid request');
  }
}
```
