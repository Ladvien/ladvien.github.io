---
layout: post
title: Deep Learning -- Mechanizing a CNN
description: Creating a webservice to access a convolutional neural network.
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
We're almost done.  In the previous articles we've used a local machine to train a CNN to detect toxic sentiment in a text sequence.  Also, we prepared a small (1GB RAM) server to use this pre-trained network to make predictions.  Now, let's finish it out and create a webservice where anyone can access our awesome magical algorithm.

### Prediction Service
If you're not still there, navigate to your `flask_app` folder and create a file called `nn_service.py`. The following code creates an HTTP request endpoint `/detect-toxic` and it exposes to other programs running on the server.  A bit more explanation after the code.

```
cd /home/my_user/flask_app
nano nn_service.py
```
Enter the following:
```python
from flask import Flask, request
application = Flask(__name__)

from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import numpy as np
import pymongo
import json

# Parameters
mongo_port = 27017
embedding_collection = 'word_embeddings'
word_embedding_name = 'glove-wiki-gigaword-50'
pad_length = 100

# Globals
global model, graph

# Connection to Mongo DB
try:
    mong = pymongo.MongoClient('127.0.0.1', mongo_port)
    print('Connected successfully.')
except pymongo.errors.ConnectionFailure:
    print('Could not connect to MongoDB: ' + e)

db = mong[embedding_collection]
coll = db[word_embedding_name]

# Load Keras Model
model = load_model('/home/ladvien/flask_app/models/tox_com_det.h5')
model._make_predict_function()

# Start flask
if __name__ == '__main__':
    application.run(host='127.0.0.1')

@application.route('/detect-toxic', methods=['POST'])
def sequence_to_indexes():
    with open('nn_service.log', 'w+') as file:
        file.write('here')
    if request.method == 'POST':
        try:
            sequence = request.json['sequence']
        except:
            return get_error('missing parameters')
        response = {
            'prediction': prediction_from_sequence(sequence, pad_length)
        }
        return str(response)

def get_word_index(word):
    index = ''
    try:
        index = str(coll.posts.find_one({'word': word})['index'])
    except:
        pass
    return index

def get_error(message):
    return json.dumps({'error': message})

def prediction_from_sequence(sequence, pad_length):
    sequence = sequence.lower()
    sequence_indexes = []
    for word in sequence.split():
        try:
            index = int(get_word_index(word.strip()))
        except:
            index = 0
        if index is not None:
            sequence_indexes.append(index)
    sequence_indexes = pad_sequences([sequence_indexes], maxlen=pad_length)
    sample = np.array(sequence_indexes)
    prediction = model.predict(sample, verbose = 1)
    prediction_labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
    prediction_results = str({prediction_labels[0]: prediction[0][0],
                              prediction_labels[1]: prediction[0][1],
                              prediction_labels[2]: prediction[0][2],
                              prediction_labels[3]: prediction[0][3],
                              prediction_labels[4]: prediction[0][4],
                              prediction_labels[5]: prediction[0][5]
                            })
    return prediction_results
```
What's going on?  Well, it's an extension of code I've detailed in earlier parts of this series.  However, there are a couple of new pieces.

First, we are connecting to our MongoDB containing the contextual word-embeddings.  This database will be used to look up words which are sent to our service endpoint.

Speaking of endpoints, the only route in this server is a `POST` service.  It takes one argument: `sequence`.  The sequence is the text the consumer would like to have analyzed for toxic content.  The endpoint calls the `prediction_from_sequence()`.  Inside the function, the word indexes are pulled from the `word_embeddings` database.  After, newly converted sequence is padding to the needed `100` dimensions. Then, this sequence is passed to our CNN, which makes the prediction. Lastly, the prediction is converted to JSON and returned to the user.  Simples!

Before we go much further, let's test the script to make sure it actually works.  Still in the `flask_app`  directory type:
```
flask run  --host=0.0.0.0
```

### NodeJS and node-http-proxy
It gets a bit weird here.  Usually, one will setup a Flask server with `uwsgi` or `gunicorn` combined with `nginx`.  However, I found the `uwsgi` middle-ware was creating two instances of my project, which would not fit in the microserver's RAM.  

I've opted to run Flask and serve it with a `nodejs` server as a proxy.  
![neural-net-service-stack](https://ladvien.com/images/nn_service_stack.png)

The `nodejs` is atypical, but I found it probably the most simple to setup.  So, eh.

Let's install NodeJS on the server.
```
sudo yum install -y nodejs
```
Now move to the directory containing your flask_app and initialize a node project.
```
cd /home/my_user/flask_app
npm init
```
You will be prompted to enter the project--take your time to fill it our or just skip it by hitting return repeatedly. 

Once the project has been setup, let's install the [node-http-proxy](https://github.com/nodejitsu/node-http-proxy) package.  It will allow use to create a proxy server sitting on top of our Flask service in a couple of lines of code.

Still in your project directory:
```
npm install node-http-proxy
nano server.js
```
Inside the server file place:
```js
var http = require('http'),
    httpProxy = require('http-proxy');
httpProxy.createProxyServer({target:'http://localhost:5000'}).listen(8000);
```

You can test the whole proxy setup by opening two terminals to your server.  In one, navigate to your Flask app and run it:
```
cd /home/my_user/flask_app
flask run
```
In the other navigate to the `node` proxy file and run it:
```
cd /home/my_user/flask_app/proxy
node server.js
```
Now, you should be able to make a call against the server.


### CURL Test
```bash
curl -X POST \
  http://maddatum.com:5000/sequence-indexes \
  -H 'Content-Type: application/json' \
  -d '{"sequence":"im pretty sure you are a super nice guy.","padding": 100}'
```
