---
layout: post
title: Setting up MITMF on Kali Pi
categories: Kali
excerpt: Setup man-in-the-middle attacks using MITMF on the Raspberry Pi Zero W using Kali Pi
tags: [kali, pi, linux]
image: 
    feature: kali-pi-splash.png
comments: true
custom_css:
custom_js: 
---

It was important to fix 

{% highlight bash %}
        Traceback (most recent call last):
        File "/usr/share/mitmf/core/proxyplugins.py", line 112, in hook
        a = f(**args)
        File "/usr/share/mitmf/plugins/inject.py", line 65, in response
        mime = response.headers['Content-Type']
        AttributeError: ClientRequest instance has no attribute 'headers'
{% endhighlight %}

I was able to solve it by following Tarikxmx's advice.

* [Downgrade Twisted to 15.5](https://github.com/byt3bl33d3r/MITMf/issues/296#issuecomment-204665111)

You can do this with Pip:

{% highlight bash %}
pip install twisted==15.5.0"
{% endhighlight %}

The log is found in:

root@kali-pi:/var/log/mitmf# 