---
layout: post
title: Google Vision API using Raspberry Pi and Node
categories: Arch Linux
excerpt: How to setup NodeJS on Raspberry Pi Zero W
tags: [Google Vision, Computer Vision, NodeJS, Arch Linux, Raspberry Pi Zero W, linux]
series: RAN
image: 
    feature: RAN_Robot.png
comments: true
custom_css:
custom_js: 
---

This is a jumpstart guide to connecting a Raspberry Pi Zero W to the Google Vision API.

## 1. Get an Account
Sadly, Google Vision API is not a completely free service.  At the time of writing an API account provides 1000 free Google Vision API calls a month.  Then, it's a $1.00 for each 1000 calls.

I know, I know, not too bad.  But this isn't a commercial project.  I'm wanting to use it for a puttering little house bot.  If my wife gets a bill for $40 because I decided to stream images to the API, well, it'll be a dead bot. Anyway, I thought I'd still explore the service for poo-and-giggles.

To get an account visit

* [Google Console](https://console.cloud.google.com/)

And sign-in with an existing Google account or create one.

## 2. Enter Billing Information
Now, here's the scary part, you've must enter your billing information before getting going.  **Remember, you will be charged if you go over 1000 calls.**

![](https://ladvien.com/images/google-vision-billing.png)

Again, if you exceed your 1,000 free calls you will be charged. (What? I said that already? Oh.)

## 2. Enable Cloud Vision API
After setting up billing information we still need to enable the Cloud Vision API.  This is a security feature, essentially, all Google APIs are disabled by default so if someone accidentally gets access they don't unleash hell everywhere.

![](https://ladvien.com/images/enable-cloud-vision.png)


Now search for `Vision` and click the button.  Here there should be a glaring `Enable` button.  Press it.


![](https://ladvien.com/images/cloud-vision-enable-button.png)

The last thing we need to do is get the API key.  This needs to be included in the API call headers for authentication. 

**Do not let anyone get your API key. And do not hardcode it in your code.  Trust me, this will bite you.**  If this accidentally gets pushed onto the web, a web crawler will find it quickly and you will be paying bajillions of dollars.

Let this article scare you a bit.

* [Dev Puts AWS Keys on Github](https://www.theregister.co.uk/2015/01/06/dev_blunder_shows_github_crawling_with_keyslurping_bots/)

Let's go get your API Key.  Find the `Credentials` section

![](https:/ladvien.com/images/google-cloud-vision-credentials.png)

You probably wont see any credentials created, as you've probably have not created any yet.

Let's create a new API Key.
![](https://ladvien.com/images/google-vision-create-credentials.png)

I'd name the key something meaningful and limit it to only the Google Cloud API.

![](https://ladvien.com/images/cloud-vision-create-api-key.png)

Go ahead and copy your API key, as we will need it in the next step.

## 3. Raspberry Pi Side Setup
The articles listed at the top of this one will help you setup the Raspberry Pi for this step.  But if you are doing things different, most of this should still work for you.  However, when we get to the part of about environment variables, that'll be different for other Linux flavors.

Start by SSH'ing into your Pi.

And update all packages
```
sudo pacman -Syu
```

We're going to create an environment variable for the Google Cloud Vision API.  This is to avoid hardcoding your API key into the code further down.  _That will work_, but I highly recommend you stick with me and setup an environment variable manager to handle the API.

Switch to the root user by typing
```
su
```
Enter your password.

The next thing we do is add your Google Vision API Key as an environment variable to the `/etc/profile` file, this should cause it to be intialized at boot.

Type, replacing `YOUR_API_KEY` with your actual API Key.
```
echo 'export GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY' >> /etc/profile
```

Now reboot the Pi so that takes effect.

```
sudo reboot
```

Log back in.  Let's check to make sure it's loading the API key.
```
echo $GOOGLE_CLOUD_VISION_API_KEY
```
If your API key is echoed back, you should be good to go.

## 4. Project Setup

Let's create a project directory.

```
mkdir google-vis
cd google-vis
```

Now let's initialize a new Node project.
```
npm init
```
Feel free to customize the package details if you like.  If you're lazy like me, hit enter until you are back to the command prompt.

Let's add the needed Node libraries.  It's one.  The [axios](https://www.npmjs.com/package/axios) library, which enables async web requests.

```
npm axios
```

![](https://ladvien.com/images/hepburn.png){: .float-left}
Also, let's create a resource directory and download our lovely test image.  Ah, miss Hepburn!
<div style="clear: both;"></div>
Make sure you are in the `google-vis/resources` project directory when downloading the image.
```
mkdir resources
cd resources
wget https://ladvien.com/images/hepburn.png
```


## 5. NodeJS Code

Create a file in the `go-vis` directory called `app.js`

```
nano app.js
```

Then paste in the code below and save the file by typing CTRL+O and exiting using CTRL+X.

{% highlight js %}
// https://console.cloud.google.com/
const axios = require('axios');
const fs = require('fs');

const API_KEY = process.env.GOOGLE_CLOUD_VISION_API_KEY

if (!API_KEY) {
  console.log('No API key provided')
} 

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
var base64str = base64_encode('./resources/audrey.jpg');

const apiCall = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

const reqObj = {
    requests:[
        {
          "image":{
            "content": base64str
          },
          "features":[
                {
                    "type":"LABEL_DETECTION",
                    "maxResults":5
                },
                {
                    "type":"FACE_DETECTION",
                    "maxResults":5            
                },
                {
                    "type": "IMAGE_PROPERTIES",
                    "maxResults":5
                }
            ]
        }
      ]
}

axios.post(apiCall, reqObj).then((response) => {
    console.log(response);
    console.log(JSON.stringify(response.data.responses, undefined, 4));
}).catch((e) => {
    console.log(e.response);
});
{% endhighlight %}

This code grabs the API key environment variable and creates a program constant from it.

```
const API_KEY = process.env.GOOGLE_CLOUD_VISION_API_KEY
```

This is how we avoid hardcoding the API key.

## 6. Run
Let's run the program.

```
node app.js
```

If all went well you should get similar output to below

{% highlight json %}
data: { responses: [ [Object] ] } }
[
    {
        "labelAnnotations": [
            {
                "mid": "/m/03q69",
                "description": "hair",
                "score": 0.9775374,
                "topicality": 0.9775374
            },
            {
                "mid": "/m/027n3_",
                "description": "eyebrow",
                "score": 0.90340185,
                "topicality": 0.90340185
            },
            {
                "mid": "/m/01ntw3",
                "description": "human hair color",
                "score": 0.8986981,
                "topicality": 0.8986981
            },
            {
                "mid": "/m/0ds4x",
                "description": "hairstyle",
                "score": 0.8985265,
                "topicality": 0.8985265
            },
            {
                "mid": "/m/01f43",
                "description": "beauty",
                "score": 0.87356544,
                "topicality": 0.87356544
            }
        ],
  ....
]
{% endhighlight %}

## 6. And so much more...
This article is short--a jump start.  However, there is lots of potential here.  For example, sending your own images using the Raspberry Pi Camera

* [raspicam](https://www.npmjs.com/package/raspicam)
* [pi-camera](https://www.npmjs.com/package/pi-camera)

Please feel free to ask any questions regarding how to use the output.

There are other feature detection requests.

* [Google Vision API -- Other Features](https://cloud.google.com/vision/docs/other-features)

However, I'm going to end the article and move on to rolling my on vision detection systems.  As soon as I figure out stochastic gradient descent.