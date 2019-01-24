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
### Setup User on Centos
Login as root
```
useradd my_user
passwd my_user 
```
Set the password for the `my_user`

Now, let's give the `my_user` sudo powers
```
EDITOR=nano visudo
```
Find line with:
```
root    ALL=(ALL)	ALL
```
And add the exact same entry for `my_user`.  It should look like this when done
```
root    ALL=(ALL)	ALL
my_user    ALL=(ALL)	ALL
```
Now save the file and exit.

Let's login as our new user.  Exit your shell and login back in as the `my_user`.  If you are ssh'ing to the server it should look something like this, typed on your local computer command line.
```
ssh my_user@erver_ip_address
```
And let's test the `my_user`'s sudo powers
```
sudo ls
```
If you are greeted with:
```
We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for my_user: 
```
Then task complete!  Otherwise, feel free to ask questions in the comments.

### Setup Miniconda on Centos

```bash
sudo yum install wget bzip2
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
chmod +x Miniconda3-latest-Linux-x86_64.sh
./Miniconda3-latest-Linux-x86_64.sh
source .bashrc
conda install python=3.6
conda install tensorflow scikit-learn keras pandas
```
Important Step. **Reboot and log back in.**

### Install MongoDB
MongoDB has license with some harsh redistribution clauses.  Most distros no longer include it in the package repos.  However, MongoDB has several distro repos of their own--luckily, REHL and Centos are included 

But not Arch Linux? Really? :|

Ok, to install MongoDB from the private repo we need to add it to the repo addresses locally.

>Create a /etc/yum.repos.d/mongodb-org-4.0.repo file so that you can install MongoDB directly using yum:

We can create the file by typing:
```
sudo nano /etc/yum.repos.d/mongodb-org-4.0.repo
```
Add the following to the file.  One word of caution, this description was copied from the MongoDB website.

* [MongoDB Install Instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/)

It's probably best to copy the repo information directly from the link above, in case there is a newer version.

```bash
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
```
Save the file.

Now run 
```
sudo yum install -y mongodb-org
```
Yum should now find the private repo and install MongoDB.

Now, we need to enable the mongod.service.

```
sudo systemctl enable mongod.service
```
And reboot
```
sudo reboot now
```

#### Setup MongoDB



#### Making Prediction
```
COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK
```
Tokenized and padding becomes:
```
[ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 1873,147,6, 3476,324, 15, 29,141]
```