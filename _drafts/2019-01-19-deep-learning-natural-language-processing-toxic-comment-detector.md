---
layout: post
title: Deep Learning -- Toxic Comment Detector
description: Explaining the pre-processing stages of creating a text classification neural network.
categories: neural-nets
excerpt:
series: Deep Learning Journal
tags: [NLP, Natural Language Processing, Deep Learning, Word Vectors, Convolutional Neural Networks]
image: 
    feature: anns_everywhere.png
comments: true
custom_css: 
custom_js: 
---

## Mechanizing Toxic Text Detector


### Server Setup

```
sudo pacman -Syu
sudo pacman -S git wget tk valgrind gcc make
adduser -m user_name
passwd user_name
EDITOR=nano visudo
(add user_name to sudo)
su user_name

wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
source .bashrc
conda install keras h5py pillow flask numpy gensim pandas scikit-learn matplotlib
conda install tensorflow=1.8
```

### Load the Model
```python
from keras.model import load_model
model = load_model('/home/ladvien/toxic_comment_detector.h5')
```
### Make Prediction


### Create MongoDB Tokenizer Collection

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jan 22 05:19:35 2019

@author: cthomasbrittain
"""

##############################
# Load Embeddings
##############################

word_embedding_name = "glove-wiki-gigaword-300"

import pymongo
import gensim.downloader as api
print('Loading word vectors.')

# Load embeddings
info = api.info() # show info about available models/datasets
embedding_model = api.load(word_embedding_name) # download the model and return as object ready for use

vocab_size = len(embedding_model.vocab)

index2word = embedding_model.index2word
word2idx = {}
for index in range(vocab_size):
    word2idx[embedding_model.index2word[index]] = index


##############################
# Save Embeddings to MongoDB
##############################
    
# Create the word_embeddings DB.
mong = pymongo.MongoClient("mongodb://localhost:27017/")
mongdb = mong["word_embeddings"]

# Create this word_embeddings 
coll = mongdb[word_embedding_name]


for i, word in enumerate(index2word):
    if i % 1000 == 0:
        print('Saved: ' + str(i) + ' out of ' + str(len(index2word)))
    try:
        embedding_vector = list(map(str, embedding_model.get_vector(word)))
        post = {
                'word': word,
                'index': i,
                'vector': list(embedding_vector)
         }

        posts = coll.posts
        post_id = posts.insert_one(post).inserted_id
    except:
        continue

```

#### Setup MongoDB on Arch Linux
Apparently MongoDB's license change means the Arch Linux official repos cannot distribute it.  So, we have to compile from source. _Waaawaaah_.
* https://lists.archlinux.org/pipermail/arch-dev-public/2019-January/029430.html
* https://techcrunch.com/2018/10/16/mongodb-switches-up-its-open-source-license/


```bash
sudo pacman -S fakeroots automake autoconf gcc make snappy \ 
            yaml-cpp lsb-release  gperftools \
            libstemmer scons python2-setuptools python2-regex \
            python2-cheetah python2-typing python2-requests \
            python2-yaml python2-pymongo 
git clone https://aur.archlinux.org/wiredtiger.git
cd wiredtiger
makepkg -i
git clone https://aur.archlinux.org/mongodb.git
cd mongodb
makepkg -i
```


