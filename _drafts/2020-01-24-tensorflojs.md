---
layout: post
title: Tensorflow JS
description: 
categories: neural-nets
excerpt:
series: Deep Learning Journal
tags: []
image: 
    feature: anns_everywhere.png
comments: true
custom_css: 
custom_js: 
---

Note, gcc-c++ is needed to install Tensorflow using `npm`.
```
sudo yum install -y nodejs gcc-c++
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
mkdir tox_com_det_service
cd tox_com_det_service
npm init
npm install @tensorflow/tfjs-node
npm install express body-parser axios mongoose
nano config.json
```


### Convert Model from Keras to TensorflowJS
https://js.tensorflow.org/tutorials/import-keras.html
```
mkdir tfjs_models
tensorflowjs_converter --input_format keras \
                       /home/ladvien/tox_com_det.h5 \
                       /home/ladvien/tox_com_det_service/tfjs_model/
```