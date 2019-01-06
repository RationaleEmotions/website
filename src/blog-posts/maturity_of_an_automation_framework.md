---
title: 'My perspective on evaluating maturity of an automation framework'
date: '2019-01-06'
tags: ['Automation Frameworks']
---

Just the other day when I was amidst a catch up conversation with my ex-boss, he casually asked me.."So Krishnan.. you are this automation guy who takes pride in building automation frameworks, enhancing automation frameworks etc., Tell me something.. how do you measure the maturity of a framework".

During that conversation I got more inputs from him in terms of what arenas is he looking at, as part of defining this maturity.

With that information, the below table summarizes my perspective of:

* What is maturity when it comes automation frameworks
* What are the levels of maturity.
* What are the attributes that can be used to measure maturity
 

|      Theme      |                             Capability                              | Nascent | Evolving | Matured |
|-----------------|---------------------------------------------------------------------|---------|----------|---------|
| Bare Essentials | Support for Web/Mobile/API                                          | x       | x        | x       |
| Bare Essentials | Test Reporting                                                      | x       | x        | x       |
| Bare Essentials | Data driven                                                         | x       | x        | x       |
| Bare Essentials | Regular releases                                                    | x       | x        | x       |
| Adoptability    | On-boarding                                                         |         | x        | x       |
| Adoptability    | Documentation                                                       | x       | x        | x       |
| Adoptability    | User-support                                                        |         | x        | x       |
| Tools           | Supporting Tools                                                    |         |          | x       |
| Tools           | Code generators                                                     |         |          | x       |
| Value add       | Fosters customization                                               |         | x        | x       |
| Value add       | Traceability friendly                                               |         |          | x       |
| Value add       | Integration into test management tools                              |         | x        | x       |
| Value add       | Coupling into Environment readiness before execution                |         | x        | x       |
| Value add       | BDD adoption (on need basis)                                        |         | x        | x       |
| Value add       | Contextual reporting (reports targetted for management/testers etc) |         | x        | x       |
| Value add       | Fosters failure analysis and ease of root cause identification      |         | x        | x       |
| Execution       | Parallel execution                                                  | x       | x        | x       |
| Execution       | Plugable to third party execution environments                      |         |          | x       |
| Metrics         | Execution data gatherer                                             |         |          | x       |
| Metrics         | Execution trend analyzer                                            |         |          | x       |
| Community       | Fosters giving back attitude                                        |         |          | x       |
| Community       | Fosters open source contribution                                    |         |          | x       |
| Community       | Fosters enrich over silo mode                                       |         |          | x       |
| Intelligence    | Fosters changeset based execution                                   |         |          | x       |
| Maintainability | Accountability for correctness.                                     | x       | x        | x       |
| Maintainability | Well defined SLAs for new feature/bug fix requests                  |         | x        | x       |
| Maintainability | Design driven                                                       |         | x        | x       |
| Maintainability | Adherance to best practices                                         |         |          | x       |
| Maintainability | Modular capabilities                                                |         | x        | x       |
| Non Functional  | Penetration testing                                                 |         |          | x       |
| Non Functional  | Performance testing integration                                     |         |          | x       |
| Non Functional  | Enables security testing                                            |         |          | x       |
| Non Functional  | Enables accessibility testing                                       |         |          | x       |

## What is maturity when it comes automation frameworks

With respect to automation frameworks, by maturity I am referring to how evolved is an automation framework on various different attributes. 

## What are the levels of maturity.

I would like to keep things simple and just define 3 levels of maturity.

* **Nascent** - This is the stage wherein a framework is born and takes baby steps towards solving the specific ask of fulfilling automation needs in a team. Most often its started off by a single person effort perhaps as a pet project. Lot of things are adhoc and the frameworks at this level are pretty limited in terms of the capabilities that it offers and the ways in which it offers those functionalities.
* **Evolving** - A framework is said to be evolving, when it has a few people dedicating their time towards making the framework useful. Some sort of a process is followed in terms of helping users on-board themselves into this framework and usually an evolving framework has a bigger array of features to offer.
* **Matured** - This is the epitome level for a framework. At this level a framework is treated with the same seriousness as a product that a company tries to market. From providing insights into how users use the framework, to providing insights into how their executions look like, this level of matured frameworks usually have all of this to offer.

## What are the attributes that can be used to measure maturity

Attributes associated with measuring maturity of a framework can be grouped into few themes. They are:

* Bare essentials
* Adoptability
* Tools
* Value adds
* Execution
* Metrics
* Community
* Maintainability
* Non-functional

#### Bare Essentials

This represents the bare set of things that are required to be present in any automation framework apart from the functionality.
Since most of the automation needs by most organizations are around `Web automation` or `Mobile automation` or `RESTful APIs` support for all of them is an absolute need. 

* For `Web Automation` the framework is also expected to support multi-browser toggling via configurations (browser flavors to be supported can be determined by the user base of an organization's product).
* For `Mobile Automation` the framework is expected to support multiple platforms (`ANDROID/IOS/WINDOWS`) and also various forms of the application (For e.g., `Native/Mobile Web/Hybrid`) with the least amount of effort by a test case automation engineer.

Most of them all, the framework should have a regular release cycle. The frequency and the mode (Need basis release or a well defined release cycle) can vary across different maturity levels.

#### Adoptability

Various different things such as `Get started guide` or having a proper support model all determines how easy is it to get started with an automation framework. Of-course it goes without saying that the Automation framework APIs or guidelines should be kept as simple as possible. But depending upon the choice of language, what is deemed as simple would change and is usually a subjective term.

* `On-boarding`: This usually represents the ask _How easy is it for an automation engineer to get started with using the automation framework_. 
It could be via :
    * Well defined documentation 
    * Templated projects (Either a sample project in a version controls ystem or as a bundled project)
* `Documentation`: From technical documentation (for e.g., `javadocs` in the Java world or `godocs` in the GoLang world) to user facing documentation that explains how to achieve a functionality using a framework, documentation plays a very huge role. Most of the times even the most sophisticated frameworks lack in this area. They either have poor documentation or have outdated/defunct documentation which is as good as not having documentation. Simplicity is the theme when it comes to documentation and has to be kept in mind. The other aspect of documentation is also an FAQ (Frequently Asked Questions) section that explains the most commonly asked aspects about an automation framework. The more easier it is to find information, the more successful a framework becomes.
* `User-support`: We all can agree that times there's always a situation wherein a user of an automation framework is stuck with a problem for which they are looking for help. Having a well defined user support channel is always a must have. It could be via emails (or) working hours sessions (or) via chat mechanisms such as a Slack channel or a Teams channel.

#### Tools

Most often beyond a point an automation framework would need to span into peripheral avenues wherein an automation engineer needs help. For e.g., it could be on a trivial basis, tools to augment an automation effort and at other times it could even span to the level of building sophisticated code generators. 

Some examples for support tools could be:

* Record and play back tools which generate test code adhering to the automation framework's syntax and semantics.
* DSL plugins for IDEs
* Passwordless setup for UNIX machines.
* Browser based tools that make it easy to capture HTML element attributes of a web page or something similar for a mobile app.

#### Value adds

The amount of value adds that an automation framework provides speaks in leaps and bounds in terms of how much a framework has evolved/matured.

Some of the value adds could be around the following:

* `Fosters customization` - An automation framework should follow the same design principle that is usually emphasised when building code viz., the automation framework should be closed for modification but at the same time, it should be flexible enough for a user to plug-in customizations that are needed for specific usecases. 
* `Traceability friendly` - One of the asks from an automation engineer is to be able to figure out/map the list of automation tests back to a logical functionality within an application. The automation framework in this aspect should be able to support/provide this meta data information and also a proper reporting mechanism which can basically help answer the question _Which are the set of automation tests that are aligned to a particular functionality_.
* `Test Management tool integration` - Most often an automation engineer would want to post back test results into a Test case management system so that it gives them a holistic view of what tests were selected for execution, how many were executed and what are the results for the same. Some other times there may be a need to automatically file bugs when an automation test fails. A framework should provide mechanisms for these integrations depending upon the relevant TCMS tool being used and depending upon feasibility.
* `Environment readiness assertion` - The most commonly heard failures in automation tests is when a test runs against a partially setup application in a test environment. The automation framework if provides a simplistic way of determining environment readiness, it goes a long way into avoiding `fake failures` of automation tests.
Some of the aspects that this readiness assertion could do can be : 
    * Is the test environment box(es) up and running.
    * Are the required components for a particular application deployed.
    * Are the required components for a particular application up and running.
* `BDD support` - Most often teams realise that an alternative approach for automation is probably the need of the hour (There can be various reasons behind this realisation and is beyond the scope of this post). In those cases, it would be good if an automation framework provided support for this migration on a very easy basis with as little change as needed.
* `Contextual reporting` - An automation framework should keep in mind the various reporting asks from its users and provide reporting mechanisms for the respective asks. For e.g., an automation engineer might need to share test results with management as a pdf or as a one pager email with embedded contents/screenshots etc., At other times an automation engineer might need to generate reports that add more debugging information around failed tests which he/she can circulate amongst the automation engineers team to quickly fix what failed.
* `Failure analysis and Root cause analysis behind failures` - Automation tests will fail all the time. But to fix the failure an engineer must not have to spend hours together trying to figure out what caused the failure and where did the failure occur. A matured automation framework would always provide means to help find the root cause via different mechanisms such as per test execution logs, payloads sent as requests and responses etc., 


#### Execution

An automation framework must always be geared towards supporting faster test execution. To that aspect, its a mandatory ask that an automation framework is **concurrency friendly**. It must support parallel test execution in a thread safe manner. An automation framework if is aimed at UI and Mobile platforms, must also provide for ways such that test execution can be easily routed to third party execution environments such as [BrowserStack](https://www.browserstack.com/) or [SauceLabs](http://saucelabs.com/) for e.g.,


#### Metrics

As a framework scales and grows, it needs to start providing ways wherein an automation engineer can get some insights around trends.

* `Execution data gatherer` - An automation framework can for starters try capturing essential execution data for every test, details about the environment it is running against, the infrastructure details, the browser details etc., as part of gathering a holistic view of a given run. This information would become very useful for an automation engineer to start looking for patterns, identify bottlenecks, look for tests that fail consistently etc.,.
* `Execution trend analyzer` - Its not sufficient that an automation framework gathers data, it also needs to provide ways of consuming the data as information and help users get insights into this data to help them make deicisions. Either the framework could build the entire eco system of store and display data for users and even provide analytical capabilities or use out of the box solutions which are either paid or open source.

#### Community

An automation framework should never confine itself to just catering to some functional asks that it satisfies from an automation standpoint. An automation framework matures and grows only as good as its users grow in these aspects. To that affect an automation framework should always find ways to encourage the following amongst its users.

* `Foster giving back attitude` - The automation framework should encourage its users to come forward to contribute in terms of bug fixes or new features. Only by getting the community involved is when an automation framework gains support and love from its users. This also enourages its users to start gaining confidence into giving back to the respective open source libraries that a framework uses and thus help the entire community thrive.
* `Fosters open source contribution` - The ultimate goal of an automation framework should be to inculcate the culture of grooming open source contributors. This fosters the culture of expanding the network of connected engineers and can also start becoming an avenue of attracting talent to the organisation.
* `Fosters enrich over silo mode` - The automation framework should basically strive against its users having to build tools/side frameworks etc., in silo modes but instead provide a platform for its users to be able to contribute to the framework and grow it holistically.

#### Intelligence

An automation framework as part of becoming advanced and sophisticated can consider providing some AI powered capabilities to its engineers.

Some of them could include:

* Ability to parse changesets and decide on the set of tests to be executed as regression.
* Given the set of changes going in as functionality, execute a subset of tests that are aligned against those functionalities.
* Based on past history of areas wherein bugs tend to get introduced a lot, decide on tests that mandatorily need to be run all the time.

With AI the possibilities are endless.

#### Maintenability 

An automation framework should always keep in mind the maintability aspects associated with itself, because at the end of the day code is code and needs a lot of love and care from its engineers so that it lives long enough and is still relevant.

* `Accountability for correctness` - No one likes to use an automation framework that has zero accountability in terms of its correctness. To that aspect an automation framework should be robustly guarded by indepth unit and also functional tests of its own that always ascertain its correctness for every change made. 
* `Well defined SLAs for new feature/bug fix requests` - It also does not make any sense for an automation framework to just sit on a pile of asks (be it new features or be it a bunch of bugs that need to be fixed) without any finite timelines as to when they would get addressed. Any staleness detected in this is a warning sign of a deteriorating framework.
* `Design driven` - One of the most important attributes of a framework that is change friendly is when its an easy answer to the question _How soon can I impregnate a change into the framework_. This is usually ONLY possible when an automation framework is heavily guided by good design principles and follows a proper design.
* `Adherance to best practices` - The industry prescribes a lot of best practices for good code management. Some of them could include the following:
    * `Code reviews` - All changesets being delivered into an automation framework should go through a rigourous cycle of code reviews.
    * `Unit tests` - An automation framework should have a de-facto standard that all changes need exhaustive unit tests which ascertain the correctness of features/functionalities being delivered.
    * `Code coverage` - Although a 100% code coverage is both a myth and still does not guarantee correctiveness. But that should not be used as an excuse for not striving to have a good amount of code coverage mandated for an automation framework and efforts made to improvize upon previously established numbers.
    * `Static code analysis` - Many of the bugs surface due to the inability of their effects being ascertained either at coding phase or at review phase or due to the inability to build tests that test against them. These bugs could sometimes easily be caught if one were to use static code analysis tools which skim through the codebase for badly written code (which violate good practices or use error prone techniques) and call them out under various different categories. Again the focus should be to strike a balance in terms of how many of the warnings do we heed to, instead of blindly trying to keep the tool happy.
* `Modular capabilities` - The capabilities of a framework should be structured such that its users have the luxury of picking and choosing only those things that they need. To that matter a framework should be modularized as much as possible. For e.g., a typical framework could provide modules that specifically support only web, only mobile and only api testing so that depending upon a user's ask, one can pick and choose only those specific modules.

#### Non-functional

An automation framework should never confine itself to addressing only the functional needs from an automation engineer. It should also facilitate catering to the non-functional automation needs to be driven with ease by fosting reusing of the same functional tests for non-functional test needs.

To that aspect an automation framework could provide ways in which it can support the following non-functional asks:

* Penetration testing
* Performance testing integration
* Security testing
* Accessibility testing
