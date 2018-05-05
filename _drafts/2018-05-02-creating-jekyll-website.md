---
layout: post
title: Setting up Nginx on Linode
categories: robots
series: Creating a Jekyll Website
excerpt:
tags: [jekyll]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---

I've used Jekyll to create my website.  A lot of the heavy lifting was done by [Michael Rose](https://mademistakes.com/about/) in the form of a Jekyll theme he created called Hpstr.

* [Hpstr](https://mademistakes.com/work/hpstr-jekyll-theme/)

Much respect.

But, setup was pretty painful for me.  I knew nothing about websites, let alone creating a [static page website](https://en.wikipedia.org/wiki/Static_web_page). I've decided to set my hand to journal a lot of the nuances I ran into.  Try to save someone some time.  Or, save myself some time when something goes wrong.

These articles will not be on CSS, JavaScript, or HTML.  After tinkering with computers for 20 years, I still suck at CSS and HTML--no, there are much better resources on the matter.  

I actually recommend spending $30 on the following Udemy courses.  They are great courses and will get you everything you need to be competitive.

* [Build Responsive Real World Websites with HTML5 and CSS3](https://www.udemy.com/design-and-develop-a-killer-website-with-html5-and-css3)
* [The Complete JavaScript Course 2018: Build Real Projects!](https://www.udemy.com/the-complete-javascript-course/)
* [Linux Mastery](https://www.udemy.com/linux-mastery/)

(Note, make sure to get them on sale.  Second note, they go on sale a lot.)

I'm not getting a kick back from Udemy, I list these courses because they are the ones I've taken and will vouch they are great courses to with this guide series.

### 1. Orientation

A lot of other articles will recommend setting up Jekyll locally, building your site to perfection, then get a rent a server when you have the time.  I _don't_ recommend going this route.

In one way it makes sense to get a feel for Jekyll before deploying.  You aren't paying money while you learn.  But, building a Jekyll site out locally, with all the bells and whistles, may cause a lot of problems deploying it.  Was it the 5th gem or the 12th gem which is causing problems?  No, I found it's better to go for broke and start building the site on the web.

To compare the work steps


| Common Workflow        | My Workflow            |
| ---------------------- | ---------------------- |
| Setup Jekyll Locally   | Get Server             |
| Deploy Site Locally    | Setup Server           |
| Refine                 | Setup Jekyll on Server |
| Deploy Site Locally    | Setup Jekyll Locally   |
| Refine                 | Deploy Site to Server  |
| Deploy Site Locally    | Refine                 |
| Get Server             | Deploy Site to Server  |
| Setup Server           | Refine                 |
| Setup Jekyll on Server | Deploy Site to Server  |
| Deploy Site to Server  | Beer                   |
| Beer                   | Second Beer            |

 A couple of reasons I prefer my workflow.

 First, the psychological payoff doesn't happen until the gross stuff is out of the way.  Setting up the server side is tedious and can be boring.  But, it is necessary for your site to be up and running on your own server.  The payoff being when your site is available to your buddy in Maine who can see the friggin awesome site you've built.

 If you put the kudos and warm fuzzies at the beginning, meaning, you deploy your site locally and tell yourself how great it looks, it robs you have the drive needed to trudge through the server side setup.  Science!

 Second, there are many different variables to account for between your local machine and the server.  For example, if you are building Jekyll from a Windows machine and serving it on Ubuntu there can often be dependency differences which you must troubleshoot.  Best to start doing it right away (see first point).

 Ok, have I persuaded you?  No?  Then why are you still reading? Ha!

Also, the one thing you'll have setting up the server side I did not is this guide.  I plan to setup a new site walking while writing these articles to assure this guide is relevant.  But if I miss anything, I'm available to help in the comments.  It makes my day to save someone some development time.


### 2. Choose a Serer Provided
Ever rented a server before? I hadn't either.  

Here is my tip sheet laden with my opinion.

#### a. Don't Go Flashy
I don't recommend going with a flashy name.  E.g, GoDaddy, HostGator, etc.  The general rule is, if they are pushy with their marketing they probably aren't a solid choice.

The two solid choices right now are
    * [Digital Ocean](https://www.digitalocean.com/)
    * [Linode](https://www.linode.com/)

#### b. Go with Linux
Oh! And go with Linux!

I had a CEO one time who forced me to use Windows on our server.  Man, it was a flop.  

First, Windows back-ends aren't well documented on the web.  They cost more.  There are fewer free tools.  You know what, let me just refer you to others' rants.

* [Five Reasons Linux Beats Windows for Servers](https://www.pcworld.com/article/204423/why_linux_beats_windows_for_servers.html)
* [Linux Foundation finds enterprise Linux growing at Windows' expense](https://www.zdnet.com/article/linux-foundation-finds-enterprise-linux-growing-at-windows-expense/)

There is a reason 80% (circa 2014) of servers are deployed using Linux, jus' sayin'.

#### c. Go Small and Scale
If you go with Digital Ocean or Linode, they both have reasonable start servers, which can in turn be scaled.  Meaning, you can pay more later for additional server resources without having to completely rebuild your server.

Ok!  For this article I'm going to use Linode.  I like them.  They've who I started with and was extremely happy with their quality and reliability.

### 3. Get a Server

Head over to 

[Linode](https://linode.com)

And `Sign Up`

![](https://ladvien.com/images/sign_up_lindode.png)

Login, then go to `Add Linode`.  Here select the smallest sized Linode as possible.  When I started, the small servers were $5 a month--but it looks like they've gone up.  My guess is, you can find them on sale occasionally.
 
![](https://ladvien.com/images/smallest_linode_server.png)

You don't have to select the smallest--but I think it's plenty for a Jekyll blog.

Once you've selected the size of server, scroll to the bottom and select a location central to your audience.  If there isn't one, then simply select the location closet to you.

Then select `Add this Linode!`

![](https://ladvien.com/images/set_location_add_linode.png)

Once you've added your Linode you will be re-directed to your Linodes dashboard

Notice, the `IP Address` is the IP address of your very first server! Waahoo!

![](https://ladvien.com/images/linode_dashboard.png)

It'll take it a second, but the status of your linode should change from `Being created` to `Brand new`, when it does, you will be ready for the fun!

### 6. Setup Linux

Let's get Linux setup on your machine.  Click on the name of your Linode.

![](https://ladvien.com/images/your_linode_name.png)

This should load the server dashboard for _your_ server.  Looking something like this.

![](https://ladvien.com/images/your_server_dashboard.png)

Don't be alarmed.  There is a lot going on here, but we are going to taker it one step at a time.  Don't worry, I got you.

First, let's tell the computer which manages your server to install Linux on it.  You can do this by going to `Deploy an Image`

![](https://ladvien.com/images/deploy_image.png)

#### **Beware ye Stackscripts!**
> A stackscript is a Linux script meant for a machine with newly installed Linux.  The script tells the machine to do a bunch of automated setup work to prepare the machine for a particular task.  In our case prepare our machine to be a server.  I'm not going to show how to use them in this walkthrough.  For a few reasons.  We will learn more setting things up ourselves, and therefore, will be able to maintain it.  Also, I've not found a stack which is specifically for Jekyll.  Most of them have a lot of extra stuff we don't need.

Ok, back to work.  Let's fill out our setup request

![](https://ladvien.com/images/install_linux.png)

Be sure to save your password somewhere! Not a lot of ways to recover it.  Once everything is selected hit `Deploy`

Your server will quickly be formatted and a fresh copy of Ubuntu 16.04 LTS installed.  Oh, and I've not mentioned

### 5. SSH
SSH stands for secure shell access.  Shell being the command prompt environment which Linux is based.  This is going to be our main way of interacting with the server.  It may feel terse and inhumane, but I strongly encourage you to embrace the command line.  If you do, the powers of Linux will be yours for free.

And besides, I'm writing this tutorial around it, so you kinda must to keep following along.

Ok, let's fire up your machine.  Open up the Linode dashboard and click on your linode's name.  At the top right there be a box called `Server Status` and it is probably `Powered Off`.  Let's turn it on by hitting the `Boot` button.

[](https://ladvien.com/images/boot_up_server.png)

I'm assuming you are using Linux or Mac as your local operating system.  On either, open a terminal and type

```
ssh root@your.ip.number.here
```

And press enter.

You should see something along the lines
```

```