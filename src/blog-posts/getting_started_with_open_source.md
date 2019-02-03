---
title: 'Getting started with Open Source contributions'
date: '2019-02-03'
tags: ['Open Source']
---

*"Hey Krishnan, you been in open source for quite sometime.. Can you tell me how do I get started with contributing to an open source project" ?*

This is a question that folks frequently ask me (Not that I am a great open source contributor). So I am going to list out what was my modus operandi on getting started with contributing to open source projects.

In my opinion, Open source contributions fall into the below four categories:

* **User support:** Remember the first time when you were starting off with Selenium or TestNG and were stuck with something? What did you do? Obviously the google mailing list (or) Stackoverflow maybe? That is how we all start. But what we don't do is pay close attention to these avenues. These are fabulous platforms for learning. My Professor in my college would always tell us *A wise man is a person who learns from others mistakes.* You can look at all those questions as others mistakes. Open source contributions mostly always start by the community trying to help each other out. So stop being just a consumer of solutions, try and solve some of the questions. Even if you solved one problem a day, in a year you would have learnt 365 nuances of a framework or library. The first step towards open source contributions is getting comfortable with a library/framework and understanding its functionalities in and out. This is what I call as a **Power user**. Many open source frameworks/libraries need help with helping its community. Its a contribution too. The last Selenium conference that happened in Bangalore, I was called out as one of the top contributors to Selenium project from India. I haven't raised that many pull requests, but I have been hugely involved in the selenium google forums. Many people recognize me on the TestNG forums instantly only because I am heavily involved in helping others with their questions. And its a faster way to learn.

* **Documentation:** Many a time, you would be going through the documentation of an open source project and would have felt, this is not clear.. there aren't a lot of examples.. this is outdated.. the documentation is incorrect.. But when was the last time you did something about it? Contributing the documentation for open source projects is also a great way of doing open source contributions. Remember Open source projects are all about different aspects of software coming together. Documentation is equally important.

* **Blogs:** Have you ever been in this scenario wherein you remember solving a particular problem in some way but you can't recollect it nor can you find the solution (could be notes or could be a piece of code) and you would wish.. "I wish I had documented it somewhere".. That is exactly what blogs are all about. I started writing blogs as a means to remember what I learnt. Remember.. if its on the internet, its always available. But please don't write blogs which explain a particular feature/functionality in an open source library. That is the job of the documentation. If the documentation is not upto the mark, enhance it and send it as a pull request, but please don't duplicate documentation in the name of writing blogs. Instead, pick up problem statements and then write blogs about how you solved them. Over a period, you would have contributed to an open source library indirectly by helping its users. Blogs are valuable too.

* **Helping with bug triaging:** Almost all open source projects are plagued by this problem. There are a hand full bunch of people who are doing their level best to maintain a project, but they just don't have that time to spend on trying to understand a vaguely logged bug which doesn't have a lot of context. Many a times, I have personally seen that there are bugs which get logged without a sample or a clear way that details on how to reproduce the bug. So the maintainers just skip that bug and move on to something else that is more detailed and pick it up. Does that mean that, those vaguely created bugs aren't issues? They are, but they dont have enough information. This is where you could help as well. You could pick up an issue and spend sometime trying to figure out how to reproduce an issue. Once you have the information, you can add a full fledged sample to the bug that the maintainer can use to reproduce an issue. If you have come this far, this can also be that starting point from wherein you make actual contributions as bug fixes.

* **Pull requests involving code:** This is usually what everyone thinks of, when someone says Hey.. Open source contributor! This is also the most difficult piece of the entire equation. You will eventually start off submitting pull requests because you stumbled into a bug when you were trying to help someone on the forums. That is how I started too. Found a bug? Don't stop by filing an issue for it, try and fix it. Initially it would be a pain-staking process, but you will become better at it over time. Don't believe me? What if I told you ten years back I was a developer who could just write:

```java
public static void main(String[] args) {
    System.out.println("Hello world");
}
```

Yes, that was the max I could write as code. But Open source projects made me better. If I can, then so can you.. that is what I believe in.
   
Remember, if you ever decide to take this very important step on sending a pull request as code, you join the league of **extra ordinary** people who believe in giving back. So pat yourself on your back 🙂

Many of these Open source projects have their code bases hosted on GitHub [ a very popular version control system ]. We may be knowing how to go about building that new feature (or) fixing that nagging bug, but not all of us necessarily have to be knowing the nuances of how to go about delivering. This post is aimed at just walking you through on the bare minimums. As an example I am going to be taking the [TestNG](https://github.com/cbeust/testng) codebase [ I chose TestNG because that was where I started with my baby steps on Open Source contributions. 

So here are those steps

1. Install git by following the instructions in [this](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) link.
2. Setup your mail and name in git. I regard this as a very important step because it’s like your identity 🙂 Refer [here](https://help.github.com/articles/setting-your-email-in-git/) on how to do it.
3. Fork the TestNG repository [ This is done ONLY once ] from github . [Here’s a good article](https://help.github.com/articles/fork-a-repo/) that will teach you what you need to know about forking a repository in Github.
4. Clone your forked repository [ This is ALSO done ONLY once ]. [Here’s](https://help.github.com/articles/fork-a-repo/) how to do it.
5. Now from within your clone, create a new branch to represent your changes. [Here’s](https://www.atlassian.com/git/tutorials/using-branches/git-checkout) how to do it.
6. If its a new feature please make sure you have a discussion on it with the TestNG dev so that you get their buy-in/expectations etc., before you start work. Else you may end up spending time unnecessarily. Once you have a buy in, make sure you create a [new issue](https://github.com/cbeust/testng/issues/new) in the TestNG repository.
7. Now add your code, add javadocs, dont forget unit tests for your delivery and then also update the [Changes.txt](https://github.com/cbeust/testng/blob/master/CHANGES.txt) [ Every repository will have something similar to this that acts as a release notes ]
8. Include a good commit message. [Here’s](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) how to do it.
9. Make sure you refer to the issue that you created on github, in your commit message. This will ensure that the reviewers of your delivery will be able to tie down your delivery to the issue that its fixing. [Here’s](https://guides.github.com/features/issues/) how to do it.
10. Now from your clone run the command : `git push origin krmahadevan-my-new-feature` [ here `krmahadevan-my-new-feature` is the name of the new branch i create for my new testng delivery/bugfix etc., you should be replacing it with your branch name ]
11. You now go about raising a pull request which is the last step of your delivery. [Here’s](https://help.github.com/articles/creating-a-pull-request/) how to do it.
12. Remember : From your second delivery onwards you just need to start following steps (3) to (11).

Hope that helps you with contributing to open source projects.

