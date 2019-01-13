---
layout: post
title: Deep Learning in NLP
description: Expanding on Lazyprogrammer's NLP "tutorials"
categories: neural-nets
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

One of the pieces I felt left out most elsewhere, is what the data look like as they travel through the pre-processing stages and up to falling into the black-hole that is the neural-net.  I'll attempt to fill the gap--trying to show what the data look at before and after critical changes.

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
index2word = embedding_model.index2entity
vocab_size = len(embedding_model.vocab)
word2idx = {}
for index in range(vocab_size):
    word2idx[embedding_model.index2word[index]] = index
```

The two dictionaries `index2word` and `word2idx` are key to embeddings.

The `word2idx` is a dictionary where the keys are the words contained in the embedding and the values are the integers they represent.
```json
word2idx = {
    "the": 0,
    ",": 1,
    ".": 2,
    "of": 3,
    "to": 4,
    "and": 5,
    ....
}
```

`index2word` is a list where the the values are the words and the word's position in the string represents it's index in the `word2idx`.
```json
["the", ",", ".", "of", "to", "and", ...]
```
These will be used to turned our comment strings into integer vectors.

#### Code: Get Toxic Comments Labels
```python
############################################
# Get labels
############################################

print('Loading Toxic Comments data.')
with open(TRAIN_TEXT_DATA_DIR) as f:
    toxic_comments = pd.read_csv(TRAIN_TEXT_DATA_DIR)

print('Getting Comment Labels.')
prediction_labels = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
labels = toxic_comments[prediction_labels].values

```
This loads the `toxic_comment.csv` as a Pandas dataframe called `toxic_comments`.  We then grab all of the comment labels using their column names.  This becomes a second a numpy matrix called `labels`.

We will use the text in the `toxic_comments` dataframe to predict the data found in the `labels` matrix.  That is, `toxic_comments` will be our `x_train` and `labels` our `y_train`.

Sample data from `toxic_comments` dataframe


Sample data from the `labels` numpy matrix.

|   0 |   1 |   2 |   3 |   4 |   5 |
|----|----|----|----|----|----|
|   0 |   0 |   0 |   0 |   0 |   0 |
|   1 |   1 |   1 |   0 |   1 |   0 |
|   0 |   0 |   0 |   0 |   0 |   0 |
|   0 |   0 |   0 |   0 |   0 |   0 |

#### Code: Convert Comments to Sequences
```python
############################################
# Convert Toxic Comments to Sequences
############################################

print('Tokenizing and sequencing text.')

tokenizer = Tokenizer(num_words=MAX_NUM_WORDS)
tokenizer.fit_on_texts(toxic_comments['comment_text'].fillna("<DT>").values)
sequences = tokenizer.texts_to_sequences(toxic_comments['comment_text'].fillna("<DT>").values)
word_index = tokenizer.word_index

print('Found %s sequences.' % len(sequences))
```
The `Tokenizer` object comes from the `Keras` API.  It takes chunks of texts cleans them and then converts them to unique integer values.

* [keras.preprocessing.text.Tokenizer](https://faroit.github.io/keras-docs/1.2.2/preprocessing/text/)

The `num_words` argument tells the Tokenizer to only preserve the word frequencies higher than this threshold.  This makes it necessary to run the `fit()` on the targeted texts before using the Tokenizer.  The fit function will determine the number of occurrences each word has throughout all the texts provided, then, it will order these by frequency.  This frequency rank can be found in the `tokenizer.word_index` property.

For example, looking at the dictionary below, if `num_words` = 7 all words after "i" would be excluded.
```json
{
    "the": 1,
    "to": 2,
    "of": 3,
    "and": 4,
    "a": 5,
    "you": 6,
    "i": 7,
    "is": 8,
    ...
    "hanumakonda": 210334,
    "956ce": 210335,
    "automakers": 210336,
    "ciu": 210337
}
```

Also, as we are loading the data, we are filling any missing values with a dummy token (i.e., "<DT>").  This probably isn't the _best_ way to handle missing values, however, given the amount of data, it's probably best to try and train the network using this method.  Then, if you can't get your NN to become as accurate as you want, come back and handle `na` values more strategically.  Diminishing returns and all that.

#### Code: Applying Embeddings
```python
###################################################
# Convert Toxic Comment Vectors to Embedding Layer
###################################################
num_words = min(MAX_NUM_WORDS, len(word_index)) + 1
embedding_matrix = np.zeros((num_words, EMBEDDING_DIM))
for word, i in word_index.items():
    try:
        embedding_vector = embedding_model.get_vector(word)
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
    except:
        continue
```

Here's where stuff gets good.  The code above will take all the words from our `tokenizer`, look up the word-embedding (vector) for each word, then add this to the embedding matrix.  The embedding_matrix will be converted into a `keras.layer.Embeddings` object.

* [Embeddings](https://keras.io/layers/embeddings/)

I think of an `Embedding` layer as a transformation tool sitting at the top of our neural-network.  It takes the integer representing a word and looks up the word-embedding for the word.  It then passes the word-vector into the neural-network.  Simples!

Probably best to visually walk through what's going on.  But first, let's talk about the code before the `for-loop`.

```python
num_words = min(MAX_NUM_WORDS, len(word_index)) + 1
```
This gets the maximum number of words to be addeded in our embedding layer.  If it is less than our "average English speaker's vocabulary"--20,000--we'll use all the number of words found in our tokenizer.  Otherwise, the `for-loop` will stop after `num_words` is met.  And rememebr, the `tokenizer` has kept the words in order of their frequency--so, the words which are lost aren't too critical.

```python
embedding_matrix = np.zeros((num_words, EMBEDDING_DIM))
```
This simply initializes our embedding_matrix, which is a `numpy` object with all values set to zero.  Note, if the `EMBEDDING_DIM` size does not match the size of the word-embeddings loaded, the code will execute, but you will get a bad embedding matrix.  Worse, you might not notice until your network isn't training.  I mean, not that this happened to *me*--I'm just guessing it could happen to _someone_.

```python
for word, i in word_index.items():
    try:
        embedding_vector = embedding_model.get_vector(word)
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
    except:
        continue
```

Here's where the magic happens.  The `for-loop` iterates over the words in the `tokenizer` object `word_index`.  It attempts to find the word in word-embeddings and if it does, it adds the vector to the embedding matrix at a row respective to its index in the `word_index` object.

Confused? Me too.  Let's visualize it.

Let's walk through the code with a word in mind: "of".
```python
for word, i in word_index.items():
```
By now the `for-loop` is two words in.  The words "the" and "to" have already been added.  Therefore, for this iteration `word` = 'of' and `i` = 2.
```python
embedding_vector = embedding_model.get_vector(word)
```
The the word-embedding for the word "of" is
```
-0.076947, -0.021211, 0.21271, -0.72232, -0.13988, -0.12234, ...
```
This list is contained in a `numpy.array` object.
```python
embedding_matrix[i] = embedding_vector
```

Lastly, the word-embedding vector representing the "of" gets added to the third row of the embedding matrix (remember the matrix index starts at 0).

Below is a visualization of the embedding matrix after the word "of" is added.  Note, I've added the first column for readability.

|word | 1        | 2         | 3          | 4        | ... |
|---|----------|-----------|------------|----------|----------| 
| the | 0        | 0         | 0          | 0        | ... | 
| to | 0.04656  | 0.21318   | -0.0074364 | -0.45854 | ... |
| of | -0.25756 | -0.057132 | -0.6719    | -0.38082 | ... |
| ... | ... | ... | ... | ... | ... |


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
