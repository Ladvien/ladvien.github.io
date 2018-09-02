---
layout: post
title: Recording Brain Waves -- Mongo Database
desription: Setting up MongoDB and NodeJS to record EEG readings.
categories: data
excerpt:
tags: [Electroencephalography, EEG, NeuroSky, iOS, NodeJS, MongoDB]
image: 
    feature: darius-bashar-529461-unsplash.jpg
    credit: Darius Bashar
comments: true
custom_css: 
custom_js: 
---

In this section I'm going to focus getting a remote Linux server setup with MongoDB and NodeJS.  This will allow us to make POST requests to our Linux server, saving the EEG data.

I'm going to assume you are able to SSH into your Ubuntu 16 LTS server for this guide.  You don't have a server? No sweat.  I wrote a guide on setting up a blog post which explains how to get a cheap Linux server setup.

* [Setting up Nginx on Linode](https://ladvien.com/creating-jekyll-website/)

## 1. Install MongoDB

SSH into your server.  I'm assume this is a fresh new Linux install.  Let's start with upgrading the packages.

```
sudo apt-get update -y
```

I'll be following the Mongo website for instructions on installing MonogoDB Community version on Ubuntu.

* [Installing MongoDB on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

Let's get started.  Add the Debian package key.

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
```

We need to create a list file.

```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
```

Now reload the database
```
sudo apt-get update
```

If you try to update and run into this error
```
E: The method driver /usr/lib/apt/methods/https could not be found.
N: Is the package apt-transport-https installed?
E: Failed to fetch https://repo.mongodb.org/apt/ubuntu/dists/xenial/mongodb-org/4.0/InRelease  
E: Some index files failed to download. They have been ignored, or old ones used instead.
```

Then install `apt-transport-https`
```
sudo apt-get install apt-transport-https
```

Now, let's install MongoDB.
```
sudo apt-get install -y mongodb-org
```

_Voila!_

## 2. Setup MongoDB

We still need to do a bit of setup.  First, let's check and make sure Mongo is fully installed.

```
sudo service mongod start
```

This starts the MongoDB daemon, the program which runs in the background and waits for someone to make connection with the database.

Speaking of which, let's try to connect to the database
```
mongo
```

You should get the following:
{% highlight bash %}
root@localhost:~# mongo
MongoDB shell version v4.0.2
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 4.0.2
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
	http://docs.mongodb.org/
Questions? Try the support group
	http://groups.google.com/group/mongodb-user
Server has startup warnings: 
2018-09-02T03:52:18.996+0000 I STORAGE  [initandlisten] 
2018-09-02T03:52:18.996+0000 I STORAGE  [initandlisten] ** WARNING: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine
2018-09-02T03:52:18.996+0000 I STORAGE  [initandlisten] **          See http://dochub.mongodb.org/core/prodnotes-filesystem
2018-09-02T03:52:19.820+0000 I CONTROL  [initandlisten] 
2018-09-02T03:52:19.820+0000 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2018-09-02T03:52:19.820+0000 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2018-09-02T03:52:19.820+0000 I CONTROL  [initandlisten] 
---
Enable MongoDB's free cloud-based monitoring service, which will then receive and display
metrics about your deployment (disk utilization, CPU, operation statistics, etc).

The monitoring data will be available on a MongoDB website with a unique URL accessible to you
and anyone you share the URL with. MongoDB may use this information to make product
improvements and to suggest MongoDB products and deployment options to you.

To enable free monitoring, run the following command: db.enableFreeMonitoring()
To permanently disable this reminder, run the following command: db.disableFreeMonitoring()
---
>
{% endhighlight %}