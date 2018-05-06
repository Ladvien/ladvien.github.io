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

![](https://ladvien.com/images/boot_up_server.png)

Wait until the status below shows your linode has fully booted.

Now, I'm assuming you are using Linux or Mac as your local operating system.  On either, open a terminal and type

```
ssh root@your.ip.number.here
```
And press enter.

You should see something along the lines
```
[ladvien@ladvien ladvien.github.io]$ ssh root@your.ip.number.here
The authenticity of host 'your.ip.number.here (your.ip.number.here)' can't be established.
ECDSA key fingerprint is SHA256:ee2BPBSeaZAFbVdpWFj1oHLxdPdGoxCaSRl3lu6u2Fc.
Are you sure you want to continue connecting (yes/no)?
```
Type `yes` and hit enter.

You will then be prompted to enter the password entered as the `root password` during the setup phase in the Linode Manager.

### 6. Nginx Setup
You are now on your server.  Do you feel a bit like Mr. Robot?  Live the feeling.  And don't let anyone give you a hard time for being a shell noob.  Embrace the shell.

I'm not going to go Linux stuff in detail.  Please refer to more in depth tutorial.  They are all over the Internet.  But, I will point out, the `Tab` key works as an auto-complete.  This is the single most important tidbit of working in shell.  Instead of having to type out a long file name, type the first two letters and hit tab.  It'll try to fill it in for you.

Let's start our server setup.

Your server is simply a computer.  But, we are going to install a program your computer which will cause anyone visiting your IP address in the browser to see parts of your file system.  The visitor's browser loads information from your file system and, if the files are in a language the browser understands, renders it for the visitor.  These files will be in HTML and CSS produced by Jekyll. 

Ok.  The server program we will be using is called `nginx`.  It is not the oldest or the most common. But I find its use straightforward and it seems pretty darn fast too.

But first, let's update Linux system. At your server's command line type.
```
sudo apt-get update
```
And hit enter.  This causes all the repository links to be updated.  The repository links are libraries of Internet addresses telling your computer when it can find free stuff! Everything is swag on Linux.

Let's take a second to check something before we start install `nginx`.  Open any browser and type your linode's ip address in the browser address bar and hit enter.  Most likely, nothing will happen.  The browser is trying to make contact with your server, but there is no program installed on your server to _serve_ the website to a browser.  That's what `nginx` will do.

Let's download `nginx` now
```
sudo apt-get install nginx
```

It will ask if you want to install `nginx` say yes.

Once it's installed, let's test and make sure it works.

Type
```
nginx
```

It should respond with
```
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)
nginx: [emerg] still could not bind()
```

Great! This means it is installed and working.  We just need to setup `nginx` to serve our files on our server address instead of `0.0.0.0:80`.

Also, open a browser and type your sever's IP address again.  Hit enter.  This time you should see:

![](https://ladvien.com/images/welcome_nginx.png)

Wow, your are now serving an html to the world, for anyone who visits your website.  Pretty cool, eh?  I think so.

Want to see something pretty cool?  

Type (note, *do not* include `sudo` here)
```
nano /var/www/html/index.nginx-debian.html
```

You should see the content of the html file being served by `nginx`.

{% highlight html %}
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>
<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
{% endhighlight %}

Change
```
<h1>Welcome to nginx!</h1>
```
To
```
<h1>Welcome to the Jungle, baby!</h1>
```
Then hit `CTRL + O`, which should save the file.  Then hit `CTRL + X` to exit the `nano` editor.

Now, switch back to your browser, go back to your website's IP address, and hit refresh.   You should see.

![](https://ladvien.com/images/welcome_t0_nginx_jungle.png)

Not seeing it?  You didn't change the `<title>` instead of the `<h1>`, right?  Ask me how I know that...

Friggin awesome!  Let's move on to setting up Nginx, so you can serve your own website.  

Linode actually has a _great_ walkthrough on setting up Nginx.  

* [Nginx Setup](https://www.linode.com/docs/web-servers/nginx/how-to-configure-nginx/)

But, for now, are going to stick with the basic `nginx` setup.  There will other articles in this series where I show how to edit `nginx` to make the website better.

### 7. Jekyll
Let's setup Jekyll locally. To follow utilize Jekyll we are going to need to download and install the following programs.

#### Ruby
[Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language)) is programing environment which contains a package manager which we will use a lot called `[gem](https://en.wikipedia.org/wiki/RubyGems)`.  For example, when we type `gem install cool-program` it is the `ruby` environment pulling the `cool-program` from the Internet and installing it on your machine.

#### Bundler
[Bundler](https://github.com/bundler/bundler) is a program which helps pull all the dependencies needed to run a program together. As they say in the README, "Bundler makes sure Ruby applications run the same code on every machine."

#### Git
[Git](https://en.wikipedia.org/wiki/Git) is version control program.  It also has the ability to pull source code off line.  We are going to use it at first to pull a theme off line, but eventually, we will manage your website Jekyll source code with it.

#### Homebrew (Mac Only)
[Homebrew](https://brew.sh/), often referred to sa Brew, is a program which is like `apt` for Linux.  It is a command line tool which lets you pull programs from the Internet and installs them locally.

Ok, let's get going

At your local computer's terminal type:

#### Linux
```
sudo apt-get install ruby
gem install jekyll
```

#### Mac
To setup Ruby correctly on Mac we are going to install a command line package manager for Mac called [brewed](https://brew.sh/).  This is the equivalent of `apt` in Linux.  

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install ruby
gem install jekyll
gem install bundler
```

### 8. Get a Jekyll Starter

Jekyll is great for creating websites, but there is a lot of boilerplate.  I found it _much_ easier to clone someone else's Jekyll starter site than make my own from scratch.

* [Jekyll Themes](http://jekyllthemes.org/)

For this series we are going to use the [Neo-HPSTR](http://aronbordin.com/neo-hpstr-jekyll-theme/) theme.

Open the terminal and pick a directory where you would like to put a copy of your website.  For me, I'm Linux and will use the home directory.

Now, let's download our theme.
```
git clone https://github.com/aron-bordin/neo-hpstr-jekyll-theme
```
Git clones the `neo-HPSTR` theme from the Internet and puts it in a directory called `/neo-hpstr-jekyll-theme` Feel free to rename the directory the name of your website.  For example, my directory is called `ladvien.com` We are getting to putting this website on-line, just a few more steps.

### 9. Build the Jekyll Theme

Open your website's directory
```
cd neo-hpstr-jekyll-theme
```
And enter
```
bundler install
```
This will pull all the need programs to make this theme build on your computer.  Note, you may be required to enter your password for file access.

Ok, moment of truth. Type
```
bundle exec jekyll build
```
You should see a response similar to
```
Configuration file: /home/ladvien/neo-hpstr-jekyll-theme/_config.yml
       Deprecation: The 'gems' configuration option has been renamed to 'plugins'. Please update your config file accordingly.
            Source: /home/ladvien/neo-hpstr-jekyll-theme
       Destination: /home/ladvien/neo-hpstr-jekyll-theme/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 1.103 seconds.
 Auto-regeneration: disabled. Use --watch to enable.
 ```
But, if you didn't get any errors, you should be good.

Breaking this down, we used the `bundler` program to execute the `jekyll` program.  We passed the `build` command to the `jekyll` program, which tells `jekyll` to take all your jekyll files and compile them into your website.  The `bundler` program made sure `jekyll` had everything it needed to compile correctly.

In your file explorer, navigate to your website directory and enter the `_site` directory.  This directory contains your entire website after compilation.

![jekyll_site_folder](https://ladvien.com/images/the_site_folder.png)

Open this folder and then double click on the file `index.html`.  This should open your website locally in the browser.

![jekyll_site_locally](https://ladvien.com/images/local_jekyll.png)  













A lot of what I'm going to write is directly from this article, but boiled down for our Jekyll setup.  But, please, after you are done with my article--go back and read the Linode `Nginx Setup` article.

We are going to start with editing the primary Nginx file `nginx.conf`.  When we installed `nginx` an initial `nginx.conf` was  created in the `/etc/nginx` folder.  Let's go there.

Type
```
cd /etc/nginx
```

`Nginx` comes with a default configuration file.  We are going to rename this so we can refer to it if needed.  Then we will create our own configuration file.

Type
```
mv nginx.conf nginx.conf_backup
```

Now the default `nginx.conf` if backed up, let's create our own `nginx.conf` file. Note, `nano` is a command line text editor built into Linux.

```
nano nginx.conf
```

At the top of the file paste (`CTRL+SHIFT+V` pastes in Linux)

```
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##
        gzip on;
        gzip_disable "msie6";

        gzip_vary on;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_buffers 16 8k;
        gzip_http_version 1.1;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript application/vnd.ms-fontobjec$
        gzip_min_length 256;

        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
}

```

This sets up nginx to use hypter-text transfer protocol (HTTP).  These settings are pretty vanilla.  They go in all `nginx` server configurations.  However, notice the line `include /etc/nginx/sites-enabled/*.conf;`.  This tells `nginx` we want to include additional files which contain setup information.  Basicaly, every file in the `/etc/nginx/conf.d` directory.

We are now going to add other configuration files in the `/etc/nginx/conf.d` directory.

But you may ask why we set the includes directory to `/etc/nginx/sites-enabled/`.  Great question.  It has to do with being able to disable our website manually without deleting files. We do this by creating a [symbolic link](https://kb.iu.edu/d/abbe) to our configuration file in the /etc/nginx/sites-enabled/` to `etc/nginx/conf.d`.  When the symbolic link exist, our website is on, when it is deleted, our website is off.  It's like a lightswitch for our website.  

Type
```
cd /etc/nginx/conf.d
ls
```

The `ls` command list all the files in the directory. Right now it is empty.  But not for long! Let's setup our first website configuration file.  We are going to call the file by the name of your website.  Don't get confused, this is not the same as having a [domain name](https://en.wikipedia.org/wiki/Domain_name).

```
nano my.website.name.com
```

Inside the file paste

```
server {
    listen         80 default_server;
    listen         [::]:80 default_server;
    server_name    45.233.1.68;
    root           /var/www/html/my.website.name.com;
    index          index.html;
    try_files $uri /index.html;
}
```

Ok, this is where the magic is really happening.  Breaking it down.

You need to replace `45.233.1.68` with the IP of _your_ server.  This will need to change if you register a domain name later.

Next, `/var/www/my.website.name.com` is going to be the directory we create and put all the Jekyll files in.  They will be served to the world--saying how awesome you are.

To get all our changes to start we need to restart the `nginx daemon`.  In Linux a [daemon ](https://en.wikipedia.org/wiki/Daemon_(computing))is a program running in the background.

Type
```
systemctl restart nginx.service
```

Let's go create that main website directory.

```
mkdir /var/www/my.website.name.com
cd /var/www/my.website.name.com
ls
```
Empty.  Good deal.  This is where we are going to dump our Jekyll files soon.  Let's create a small html file so we will know when we are serving files out of this directory.

Type
```
nano index.html
```

Inside this file put
```
<h1>Ladvien's Lab is Awesome!</h1>
```
Do it...

Alright, remember earlier how I said there was a light switch we had to enable for our server to be `on`.  Now's the time.

Let's create a symbolic link from our `nginx.conf` file in the directory which will pick up any webserver configurations and run them.

Type
```
cd /etc/nginx/sites-enabled
ln -s /
```

sites-enabled
```
##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# http://wiki.nginx.org/Pitfalls
# http://wiki.nginx.org/QuickStart
# http://wiki.nginx.org/Configuration
#
# Generally, you will want to move this file somewhere, and start with a clean
# file but keep this around for reference. Or just disable in sites-enabled.
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
##

# Default server configuration
#

# Expires map
map $sent_http_content_type $expires {
    default                    off;
    text/html                  epoc;
    text/css                   max;
    application/javascript     max;
    ~image/                    max;
}


server {
        listen 80 default_server;
        listen [::]:80 default_server;

        expires $expires;

        # SSL configuration
        #
        # listen 443 ssl default_server;
        # listen [::]:443 ssl default_server;
        #
        # Note: You should disable gzip for SSL traffic.
        # See: https://bugs.debian.org/773332
        #
        # Read up on ssl_ciphers to ensure a secure configuration.
        # See: https://bugs.debian.org/765782
        #
        # Self signed certs generated by the ssl-cert package
        # Don't use them in a production server!
        #

        # include snippets/snakeoil.conf;

        root /var/www/html;

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name ladvien.com www.ladvien.com;
        return 301 https://$server_name$request_uri;


        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }

        location ~ /.well-known {
                allow all;
        }

        location ~*  /.(jpg|jpeg|png|gif|ico|css|js)$ {
                expires 365d;
        }

        location ~*  /.(pdf)$ {
                expires 30d;
        }

}
```