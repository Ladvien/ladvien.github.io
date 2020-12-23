---
layout: post
title: Install Tensorflow and OpenCV on Raspberry Pi
categories: robot
series: LEGO Classifier
excerpt:
tags: [raspberry pi, tensorflow, cnn]
image: 
    feature: lego_mess.png
    credit: Photo by Markus Spiske
comments: true
custom_css:
custom_js: 
---
This post shows how to setup a Raspberry Pi 3B+ for operating a [Tensorflow](https://www.tensorflow.org/) CNN model using a [Pi Camera Module v2.0](https://www.raspberrypi.org/products/camera-module-v2/).

## Raspberry Pi Setup
I will be focusing on the Raspberry Pi 3B+, but don't worry if you are using a different Pi.  Just let me know in the comments below and I'll try to get instructions for your particular Pi added.  

Step #1: Download [Raspbian Buster with desktop and recommended software](https://www.raspberrypi.org/downloads/raspbian/)

![download-raspbian](/images/lego_classifier/download_raspbian.png)

Step #2: Write the image to a 8gb (or greater) SD card.  I use [Etcher](https://www.balena.io/etcher/).

![write-raspbian-sd-card](/images/lego_classifier/etcher.png)

Step #3:  Once the image is finished, and before you plug the card into the Pi, open the SD card and create a file called `ssh`.  No extension and nothing inside.  This will enable `ssh` on boot.

![enable-ssh-with-boot-file](/images/lego_classifier/ssh_file.png)

Step #4: Plug the card in to the Pi.
Step #5: Plug a LAN cable into the Pi
Step #6: Attach your PiCam.

Note, there are two plugs the PiCamera will mate with.  To save frustration:

![pi-cam-connector](/images/lego_classifier/pi_cam_plug.jpg)

Step #7: Turn the Pi on.
Step #8: Find the ip of your Pi and `ssh` into it with the following.  

```bash
ssh pi@your_pi_ip
```
The password will be `raspberry`


The easiest way to find your Pi's ip is to login into your router.  _Usually_, you can login into your router by opening a webbrowser on your PC and typing `192.168.1.1`.  This is the "home" address.  You should then be prompted to login to the router.  On your router's web interface there should be a section for "attached devices."  You can find your Pi's ip there.  If many are listed, you can turn off your Pi and see which ip goes away.  That was probably the Pi's ip.

Step #9: Once on the Pi, run the following
```bash
sudo raspi-config
```
This should open a old school GUI.  

Enable the following under `Interfacing Options`
```
Camera
VNC
```
The camera will allow us to use the PiCamera and VNC will allow us to open a a remote desktop environment, which should make it easier to adjust the PiCamera.

(Optional) When working with a remote desktop environment, too high of a resolution can cause responsiveness issues with the VNC client (RealVNC).  To prevent this, the Raspbian setup automatically adjusts the Pi resolution to the lowest.  Unfortunately, I find this troublesome when trying to do computer vision stuff from the Pi.  The following will allow you to adjust the resolution--just keep in mind, if it's too high there could be trouble.  Oh, one note here, this is the main reason I'm using a LAN connection to my Pi, as it allows greater throughput than WiFi.

**Update!**  Apparently, if you raise your Pi's resolution too high, then you will not be able to start your PiCam from Python.  This is due to the PicCam buffering frames in the GPU memory of the Pi.  Of course, you could increase the GPU's memory through `raspi-config` (it defaults to 128, max is 256).  Of course, then you've less RAM to put in your Tensorflow model.

My opinion, raise the Pi's screen resolution _just_ high enough to make it easy for debugging the Pi cam.  And when you get ready to "productionize" your Pi, drop the resolution to the lowest.

Ok, if you still want to, here's how to raise the Pi's resolution.

Still in `raspi-config` open `Advanced Options`.  Navigate to `Resolution` and change it to what you'd like.  (I'm going with the highest).
![vnc-resolution-on-pi](/images/lego_classifier/rpi_vnc_resolution.png)

Once you've finished setting these options, exit.  At the end it will ask if you want to reboot, say "Yes."

Step #10: Download and install [RealVNC Viewer](https://www.realvnc.com/en/connect/download/viewer/).

Step #11: Open RealVNC and set the ip to your Pi. Don't include your user name, like we did when `ssh`'ing, because RealVNC is about to ask us for it.  Once you've typed in the ip hit "Enter" or "Return."


Step #12: RealVNC will warn you about singing into your Pi, as it's not a credentialed source.  No worries.  Hit continue.

Note, if you're on a Mac, it's going to ask you to give RealVNC access to keys or something.  (Shesh, Mac, thank you for the security, but, well, shesh.)

![enable-keys-vnc-mac](/images/lego_classifier/enable_keys_on_mac.png)

Step #13: Enter your credentials.  
```
username: pi
password: raspberry
```
![vnc-to-raspberry-pi](/images/lego_classifier/real_vnc.png)

Step #14: This should open your Pi's desktop environment.  It will ask you a few setup questions, go ahead and take care of it.  Note, if you change your password, you will need to update RealVNC (if you had it "Remember My Password").

## Tensorflow Setup
Here's where it gets real.

Open terminal, either in the VNC Pi desktop, or through `ssh`.  Then enter the following commands.
```bash
pip3 install pip3 install https://github.com/lhelontra/tensorflow-on-arm/releases/download/v1.14.0-buster/tensorflow-1.14.0-cp37-none-linux_armv7l.whl
```
The above installs a Tensorflow 1.14 for Python 3.7.x on the Raspberry Pi 3b+ from `ihelontra`'s private Tensorflow ARM builds.  I've found this better, as Google seems to break the installs often.

If you want another combination of Tensorflow, Python, and Pi, you can see `ihelontra`'s other `whl` files:

* [tensorflow-on-arm](https://github.com/lhelontra/tensorflow-on-arm)


## OpenCV Setup
Tensorflow will allow us to open a model, however, we will need to feed the model image data captured from the PiCamerae.  The easiest way to do this, at least I've found so far, is using [OpenCV](https://opencv.org/).  

Of course, it can be tricky to setup.  The trickiest part? If you Google how to set it up on Raspberry Pi you will get tons of _misinformation_.  In all due fairness, it once was good information--as you had to build OpenCV for the Pi, which took a lot of work.  But, now days, you can install it using the build in Linux tools.

Ok, back at the Pi's command prompt:
```
# Install OpenCV
sudo apt-get install python3-opencv
```
At of time writing, the above command will install OpenCV 3.2.  Of course, the newest version is 4.0, but we don't need that.  Trust me, unless you've a reason to be using OpenCV 4.0 or greater, I'd stick with the Linux repos.  Building OpenCV can be a time consuming pain.

There's one other handy package which will make our work easier: `imutils`.

Let's install it.
```
pip3 intall imutils
```

## Using Tensorflow to Classify Images on an RPi.
Now the payoff.

I've prepared a Python script which loads a test model, initializes the Pi camera, captures a stream of images, each image is classified by the Tensorflow model, and the prediction is printed at the top left of the screen.  Of course, you can switch out the entire thing be loading a different model and corresponding `json` file containg the class labels (I've described this in an [earlier article](https://ladvien.com/lego-deep-learning-classifier-cnn/).)

Let's download the script and test our build:
```
cd ~
git clone https://github.com/Ladvien/rpi_tf_and_opencv
cd rpi_tf_and_opencv
```

Ok! Moment of truth.  Let's execute the script.

```
python3 eval_rpi.py
```
If all goes well, it will take a minute or two to initialize and you should see something similar to the following:

![tensorflow-predictions-rpi](/images/lego_classifier/tensorflow_on_rpi_success.png)

### Troubleshooting

If you are using a different PiCamera module than the `v2.0` you will most likely need to adjust the resolution settings at the top of the script:

```python
view_width               = 3280
view_height              = 2464
```

If you clone the repo in a different directory besides the `/pi/home` directory, then you will need to change the model path at the top of the file:
```python
model_save_dir           = '/home/pi/rpi_tf_and_opencv/'
```

Any other issues, feel free to ask questions in the comments.  I'd rather troubleshoot a specific issue rather than try to cover every use case.
