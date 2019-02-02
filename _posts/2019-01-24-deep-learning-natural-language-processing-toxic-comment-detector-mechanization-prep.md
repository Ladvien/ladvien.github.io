---
layout: post
title: Deep Learning -- Preparing a Small Server to Serve a CNN
description: Preparing a small server to provide access to a convolutional neural network through a Flask webservice.
categories: neural-nets
excerpt:
series: Deep Learning Journal
tags: [NLP, MongoDB, CentOS, Natural Language Processing, Deep Learning, Word Vectors, Convolutional Neural Networks]
image: 
    feature: anns_everywhere.png
comments: true
custom_css: 
custom_js: 
---

## Mechanizing Toxic Text Detector
Previously, I wrote about training a CNN to detect toxic comments from text alone.  But, I realized, even if one has a nice little NN to solve all the world's problems it doesn't help unless it is in production.

This article is going to cover how to prepare a server and needed word embeddings to mechanize the NN in a Flask webservice.

### Server Setup: Preamble
For this project I'm using a small server from Linode--called a "Nanode."  At the time of writing these servers are only $5 a month.  The catch? They only have 1GB of RAM.  It's definitely going to be tricky to deploy our CNN there, but let's see it through.

* https://www.linode.com/pricing

As for setting up the server, I've written about it elsewhere:

* [Setting Up Nginx on Linode (step 3-5)](https://ladvien.com/creating-jekyll-website/)

For this particular project, I decided to go with a CentOS 7 distribution.  

For those of you who know me; I'm not betraying Arch Linxu, however, this project will be using MongoDB and there's a bit of [drama going on](https://lists.archlinux.org/pipermail/arch-dev-public/2019-January/029430.html).  I will leave some Arch Linux instructions in the Appendix, in case it is ever resolved.

I chose CentOS because it is the distro we use at work and I hoped to get some experience using it.

### Setup User on Centos
Login as root and update the system
```
yum update -y
```
Let's add another user; setting up the system as root is not a best practice.
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
root    ALL=(ALL)    ALL
```
And add the exact same entry for `my_user`.  It should look like this when done
```
root    ALL=(ALL)    ALL
my_user    ALL=(ALL)    ALL
```
Save the file and exit.

Let's login as our new user.  Exit your shell and login back in as the `my_user`.  It should look something like this, typed on your local computer command line.
```
ssh my_user@erver_ip_address
```
Once logged in, let's test the `my_user`'s sudo powers
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
Anaconda is a great package system for Python data analyst tools.  It takes care of a lot of silly stuff.  Miniconda is the commandline version fo Anaconda, which we will be using.

Install it by entering the following and agreeing to the terms.
```bash
sudo yum install -y wget bzip2
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
chmod +x Miniconda3-latest-Linux-x86_64.sh
./Miniconda3-latest-Linux-x86_64.sh
source .bashrc
```
Side note here, if you install Miniconda and have trouble executing `conda`, most likely it didn't add the executable path to your `PATH` variables.

This should add the path for both your user and root:
```
echo "export PATH='/usr/local/miniconda/bin:$PATH'" &>> /home/my_user/.bashrc
echo "export PATH='/usr/local/miniconda/bin:$PATH'" &>> /root/.bashrc
```
You will need to make sure to reload your shell (log out and back in or run `source .bashrc`) after adding the `conda` path.

As of this writing Tensorflow only supports Python as late as 3.6, while Miniconda sets up your environment to use 3.7.  To rectify this we can set Python to 3.6.8 by using the Miniconda installer `conda`.
```
conda install -y -vv python=3.6.8
```
Also, we need to install a few Python packages.
```
conda install -y -vv tensorflow scikit-learn keras pandas
```
Ok, one last important step: **Reboot and log back in.**
```
sudo reboot now
```


### Create MongoDB Tokenizer Collection
Here's where we get clever.  We are trying to fit our model into less than 1GB of RAM, to do this, we are going to need to find a way to access the word-embeddings' `index2word` and `word2index` lookup objects without loading them in RAM, like we did in training.  We are going to shove them into a database to be loaded into RAM only when a specific word is needed.

Disk access is slower, but hey! I don't want to pay $40 a month for a hobby server, do you?

To move the `word-embeddings` will take a few steps.  First, we'll run a Python script to save the embeddings matching the context of our original training.  Then, we will export those embeddings from our local MongoDB.  Next, we'll move them to the remote server and import them into the MongoDB there.  Simple!

#### Install MongoDB Locally
To create the local word-embedding databases we will need to install MongoDB locally.  This could vary based upon your OS.  I've used homebrew to install on the Mac.

* https://brew.sh/

Here are instructions on installing MongoDB on the Mac:
* [Install MongoDB](https://treehouse.github.io/installation-guides/mac/mongo-mac.html)

Don't forget you'll need to start the MonogDB service before starting the next step.

On the Mac, using Homebrew, it can be started with:
```
brew services start mongodb
```

#### Create a Word Embedding Database
Once you've installed it locally, here's the script I used to convert the `word_embeddings` into a MongoDB database.  It loads the word-embeddings  using `gensim`, tokenizes the
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jan 22 05:19:35 2019
@author: cthomasbrittain
"""
import pymongo
import gensim.downloader as api
import pandas as pd
from keras.preprocessing.text import Tokenizer

# Convenience Macros
word_embedding_name = "glove-wiki-gigaword-50"

BASE_DIR = '/path/to/embeddings'
TRAIN_TEXT_DATA_DIR = BASE_DIR + 'train.csv'
MAX_NUM_WORDS = 20000

# Load embeddings
info = api.info() # show info about available models/datasets
embedding_model = api.load(word_embedding_name) # download the model and return as object ready for use

vocab_size = len(embedding_model.vocab)

index2word = embedding_model.index2word
word2idx = {}
for index in range(vocab_size):
    word2idx[embedding_model.index2word[index]] = index
    
# Get labels
print('Loading Toxic Comments data.')
with open(TRAIN_TEXT_DATA_DIR) as f:
    toxic_comments = pd.read_csv(TRAIN_TEXT_DATA_DIR)

# Convert Toxic Comments to Sequences
print('Processing text dataset')

tokenizer = Tokenizer(num_words=MAX_NUM_WORDS)
tokenizer.fit_on_texts(toxic_comments['comment_text'].fillna("DUMMY_VALUE").values)
sequences = tokenizer.texts_to_sequences(toxic_comments['comment_text'].fillna("DUMMY_VALUE").values)
word_index = tokenizer.word_index

# Save Embeddings to MongoDB
mong = pymongo.MongoClient('127.0.0.1', 27017)

# Create collection database
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
                'index': word_index[word],
                'vector': list(embedding_vector)
         }
        posts = coll.posts
        post_id = posts.insert_one(post).inserted_id
    except:
        continue
```
One note here, you _could_ set the database directly to your remote.  However, I found saving the >2 GB enteries one at a time across a 38.8bps SSH connection took most of the day.  So, I've opted to create them locally and then copy them in bulk.


### Install MongoDB Remote Server
MongoDB has license with some strict redistribution clauses.  Most distros no longer include it in the package repos.  However, MongoDB has several distro repos of their own--luckily, REHL and Centos are included. But not Arch Linux? Really? :|

Ok, to install MongoDB from the private repo we need to add it to the local repo addresses.

We can create the file by typing:
```
sudo nano /etc/yum.repos.d/mongodb-org-4.0.repo
```

One word of caution, the following text was copied from the MongoDB website.

* [MongoDB Install Instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/)

It's probably best to copy the repo information directly from the link above, in case there is a newer version.

Or, here's what I put in the file:
```bash
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
```
Save the file.

Run 
```
sudo yum install -y mongodb-org
```
Yum should now find the private repo and install MongoDB.

#### Setup MongoDB
We need to enable the mongod.service.

```
sudo systemctl enable mongod.service
```
And reboot
```
sudo reboot now
```
I'll be setting up MongoDB to _only_ run locally on the server.  This enables it to be accessed by the Flask program, but not remotely.  This is a best practice, given the security benefits.  However, if you'd like to enable remote accesss to the MongoDB I've included instructions in the Appendix.


### Move the Model to Server
Since we traind the model locally, let's move it to the server.  Open your terminal in the directory where the model was stored.

```
scp toxic_comment_detector.h5 my_user@my_server_ip:/home/my_user
```
Replace `my_user` with the user name we created earlier and `my_server_ip` with the address of your server.  It should then prompt you to enter the server password, as if you were ssh'ing into the server.  Once entered, the model should be copied to the server.


#### Move word_embeddings Database to Server
Once ou've created the local `word_embeddings` DB, at local the terminal type the following to make a copy:
```
mongodump --out /directory_to_save
```
Now, copy this DB backup to your remote server
```
scp -r /directory_to_save/name_of_output_folder user_name@remote_ip_address:/home/user_name/
```
Now, log in to your remote server and create a DB from the data dumps.
```
mkdir /home/user_name/word_embeddings
mongorestore --db word_embeddings /home/user_name/word_embeddings
```
We also need to restart the MongoDB service
```
sudo systemctl restart mongod.service
```

If you would like to enable access to the database remotely (see instructions in Appendix) you could use [Robo3T](https://robomongo.org/) to make sure everything is in place.  But if you didn't get any errors, we're probably good to go.

### Test the Model
Log into your server.  We are going to test the model real quick, since it needs to fit in the RAM available.

Notice, the `my_user` in the script should be replaced with the user name you created while setting up your server and proejct.

Type:
```
python
```
Now, enter the following into the Python interpreter.

```python
from keras.models import load_model
model = load_model('/home/my_user/toxic_comment_detector.h5')
```
If all goes well it will mention it's using the Tensorflow backend and return you to the interpreter prompt.  

If you trained your network like me, then the following will allow you to fully test the model deployed remotely.
```
import numpy as np
test_prediction = np.array([[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 1873,147,6, 3476,324, 15, 29,141]])
model.predict(test_prediction)
```
If you get back something similar to:
```python
array([[0.97645617, 0.21598859, 0.92201746, 0.01897666, 0.7753273,
0.11565485]], dtype=float32)
```
We're in good shape.  These are the predictions for the the following respectively:
```python
["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
```
The `test_prediction` was the following text sequence pre-encoded.
```python
"C*#%`SUCKER BEFORE YOU PISS AROUND ON MY WORK"
```
So, the `toxic` and `obscene` label should definitely be close to `1` and they are.

In the next article I'll show how to create a Flask webservice to access the model.  Well, at least I hope...not sure how to do it yet.

### Appendix

#### Arch Linux Miniconda Setup
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

#### Setup MongoDB on Arch Linux
Apparently MongoDB's license change means the Arch Linux official repos cannot distribute it.  So, we have to compile from source. _Waaawaaah_.

**Note, it took more than 1GB of RAM to compile from source.**

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

#### Enabling Remote Access to MongoDB
To enable remote connections edit the `mongod.conf` file:
```
sudo nano /etc/mongod.conf
```
Find the following lines in the file and comment out `bindIp`.

Your file should look like this:
```
# network interfaces
net:
  port: 27017
  #bindIp: 127.0.0.1  # Enter 0.0.0.0,:: to bind to all IPv4 and IPv6 addresses or, alternatively, us$
```
This allows us to connect to the MongoDB from any IP address.  If we'd left this line, then we could only connect to the database from within the server itself (127.0.0.1 = local).

### Monitoring System Resources
I like using `htop` for this, but you've gotta build it from source on Centos
```
wget dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-7-11.noarch.rpm
sudo rpm -ihv epel-release-7-11.noarch.rpm
sudo yum install -y htop
```

```bash
curl -X POST \
  http://maddatum.com:5000/sequence-indexes \
  -H 'Content-Type: application/json' \
  -d '{"sequence":"im pretty sure you are a super nice guy.","padding": 100}'
```
