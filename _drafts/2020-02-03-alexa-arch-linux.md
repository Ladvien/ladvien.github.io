---
layout: post
title: Setup Arch Linux Server for Alexa
desription: Use Lindode, Arch Linux, and NodeJS to create a simple Alexa skills server.
categories: robots
excerpt:
tags: [Alexa, Arch Linux, NodeJS]
image: 
    feature: 
comments: true
custom_css: 
custom_js: 
---

```
pacman -S nodejs npm
```

```
git clone https://github.com/Ladvien/alexa-personal-server.git
cd alexa-persona-server
npm install express@">=3.0.0 <4.0.0" --save
npm install body-parser
```

```
sudo pacman -S certbot
sudo certbot certonly --manual
```


https://www.npmjs.com/package/forever

https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca