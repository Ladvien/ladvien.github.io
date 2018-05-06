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
