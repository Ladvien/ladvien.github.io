---
layout: post
title: Deep Learning in NLP
description: Expanding on Lazyprogrammer's NLP "tutorials"
categories: robots
excerpt:
series: Deep, Deep Learning
tags: [NLP, Natural Language Processing, Deep Learning, Word Vectors, Convolutional Neural Networks]
image: 
    feature: 
comments: true
custom_css: 
custom_js: 
---

## The Plan
I'm going to write out my learning-notes from implementing a "toxic comment" detector using a convolutional neural network (CNN).  This is a common project, however, the articles I've read seem to leave a few bits out.  So, I'm attempting to augment public knowledge--not write a comprehensive tutorial.

With that, I've put all the original code, relevant project links, tutorial links, and other resources towards the bottom.  From here to there I'll attempt to focus on annotating the code.

## The Code

#### Code: Imports
```python
from __future__ import print_function

import numpy as np
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.layers import Dense, Input, GlobalMaxPooling1D, Conv1D, Embedding, MaxPooling1D
from keras.models import Model
from keras.initializers import Constant
import gensim.downloader as api
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import roc_auc_score

```
The above code includes several packages which would need to be downloaded.  The easiest way is to use `pip`.

```
pip install keras
pip install gensim
pip install pandas
```

#### Code: Constants
```python
############################
# Constants
############################

BASE_DIR = 'your project directory'
TRAIN_TEXT_DATA_DIR = BASE_DIR + 'train.csv'
MAX_SEQUENCE_LENGTH = 100
MAX_NUM_WORDS = 20000
EMBEDDING_DIM = 300
VALIDATION_SPLIT = 0.2
```
The above constants will be used throughout the project to define the neural-network.

* TRAIN_TEXT_DATA_DIR

The directory containing the training data called `train.csv`

* MAX_SEQUENCE_LENGTH

The toxic_comment data set contains comments collected from Wikipedia.  MAX_SEQUENCE_LENGTH is used in the preprocessing stages to truncate comments if they get to be too long.  For example, a comment like

```
You neeed to @#$ you mother!$@#$&...
```

Probably doesn't need much more for the network to discern it's a toxic comment.  And if we create the network based around the longest comment, it will become unnecessarily large and slow.

* MAX_NUM_WORDS = 20000

The max size of the vocabulary.  Much like truncating the sequence length, the maximum vocabulary should not be overly inclusive.  The number `20,000` comes from a "study" stating an average person only uses 20,000 words.  Of course, I've not found a primary source stating this--not saying it's not out there, but I've not found it yet.

Regardless, it seems to help us justify keeping the NN nimble.

* EMBEDDING_DIM = 300

In my code, I've used `genism` to download pre-trained word embeddings.  But now all pre-trained embeddings have the same number of dimensions.  This constants defines the size of the embeddings used.

**Please note, if you use embeddings other than `glove-wiki-gigaword-300` you will need to change this constant to match.**

* VALIDATION_SPLIT = 0.2

Part of the Keras library includes automatically split our prepared dataset into a `test` and `validation`.  This percentage represents how much of the data to hold back for validation.

#### Code: Load Embeddings
```python
##############################
# Load Embeddings
##############################
print('Loading word vectors.')
# Load embeddings
info = api.info()
embedding_model = api.load("glove-wiki-gigaword-300")
```

The `info` object is a list of `genism` embeddings available.  You can any of the listed embeddings in the format `api.load('name-of-desired-embedding')`.  The great thing about `genism`'s `api.load` is it will automatically download the embeddings from the Internet and load them into Python.  Of course, once they've been downloaded, `gensim` will simple load them locally.

If you want to know more about `gensim` and how it can be used with Keras here's an article.

* [Depends on the Definition](https://www.depends-on-the-definition.com/guide-to-word-vectors-with-gensim-and-keras/)

#### Code: Process Embeddings
```python
vocab_size = len(embedding_model.vocab)
index2word = embedding_model.index2entity
word2idx = {}
for index in range(vocab_size):
    word2idx[embedding_model.index2word[index]] = index
```







## Resources

### Documentation

Existing tutorials and references:

* [Convolutional Neural Networks for Toxic Comment Classification (Academic)](https://arxiv.org/pdf/1802.09957.pdf)
* [Kaggle Projects Using a CNN and Toxicty Data](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/kernels?sortBy=relevance&group=everyone&search=cnn&page=1&pageSize=20&competitionId=8076)
* [Tutorial of Using Word Vectors](https://www.depends-on-the-definition.com/guide-to-word-vectors-with-gensim-and-keras/)
* [Keras Tutorial on Using Pretrained Word Embeddings](https://blog.keras.io/using-pre-trained-word-embeddings-in-a-keras-model.html)

### Data
The data we will use to train is hosted by Kaggle.  They are comments collected from Wikipedia and classified with one of the following markers (mutually inclusive).

* [Wikipedia's "Toxic Comment" Data](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data)

Please note, you will have to sign-up for a Kaggle account.
