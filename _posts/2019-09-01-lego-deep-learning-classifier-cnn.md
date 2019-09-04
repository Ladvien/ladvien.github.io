---
layout: post
title: A LEGO Classifier -- CNN and Elbow Grease
categories: robot
series: LEGO Classifier
excerpt:
tags: [tensorflow, deep learning, legos, robots, cnn]
image: 
    feature: lego_mess.jpg
    credit: Photo by Markus Spiske
comments: true
custom_css:
custom_js: 
---
This article is part of a series.  It should explain the code used to train our convolutional neural-network (CNN) LEGO classifier.

If you want to code along with this article, we've made it available in Google's Colab:

* [Lego Classifier](https://colab.research.google.com/drive/1b2_w2o60dMVJlV4Od25zTx2OUP07tdue)

Or if you want to run the code locally:

* [lego_sorter](https://github.com/Ladvien/lego_sorter)

It's a WIP, so comment below if you run into any issues.

## Classifier Code:
Our code started with a notebook found on Kaggle:

* [Lego Brick Images Keras CCN](https://www.kaggle.com/twhitehurst3/lego-brick-images-keras-cnn-96-acc)

However, there was _a lot_ of problems in the code.  I rewrote most of it, so I'm not sure how much of the original is left.  Still, cite your sources!

Some of the issues were:
* It used a model more complex than needed.
* The code format was a mess.
* Mismatch of target output and loss.

It was the last one which is _super_ tricky, but critical.  It's a hard to catch bug which will inaccurately report high accuracy.  I'll discuss it more below, but it's a trap I've fallen into myself. Regardless of the issues, it was good jump-starter code, since we've never worked with a CNN.

### Project Setup (local only)
If you are running this code locally, you will need to do the following.

Enter the command prompt and navigate to your home directory.  We're going to clone the project repository (repo), then, clone the data repo inside the project folder. 
```
git clone https://github.com/Ladvien/lego_sorter.git
cd lego_sorter
git clone https://github.com/Ladvien/lego_id_training_data.git
```
Then, open your Python IDE, set your directory to `./lego_sorter`, and open `lego_classifier_gpu.py`.

Lastly, if you see a cell like this:
```bash
!git clone https://github.com/Ladvien/lego_id_training_data.git
!mkdir ./data
!mkdir ./data/output
!ls
```
Skip or delete them, they are need when running the Colab notebook.

### Classifier Code: Needed Libraries

Below is the code used.  Looking over it again, I see some ways to clean it up, so know it may change in the future.

Here's a breakdown of why the libraries are needed:

* `tensorflow` -- Google's main deep-learning library, it's the heart of the project.
* `keras` -- a library abstracting a lot of the details from creating a machine learning model.
* `json` -- we write the classes to file for use later.
* `tensorboard` -- a library for visualizing your training session.
* `webbrowser` -- this is opens your webrowser to Tensorboard.

```python

# Import needed tools.
import os
import matplotlib.pyplot as plt
import json
import numpy as np
from scipy import stats

# Import Keras
import tensorflow as tf
import tensorflow.keras
from tensorflow.keras.layers import Dense,Flatten, Dropout, Lambda
from tensorflow.keras.layers import SeparableConv2D, BatchNormalization, MaxPooling2D, Conv2D, Activation
from tensorflow.compat.v1.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard, CSVLogger, ReduceLROnPlateau
from tensorflow.keras.preprocessing import image

# Tensorboard
from tensorboard import program
import webbrowser
import time
```
If you are following along with this code locally and need help setting up these libraries, just drop a comment below.  I got you.

### Classifier Code: Parameters
The parameters sections is the heart of the training, I'll highlight what each parameter is doing and point out the parameters you might want to tweak.

```python
continue_training       = False
initial_epoch           = 0
clear_logs              = True

input_shape             = (300, 300, 3) # This is the shape of the image width, length, colors
image_size              = (input_shape[0], input_shape[1]) # DOH! image_size is (height, width)
train_test_ratio        = 0.2
zoom_range              = 0.1
shear_range             = 0.1

# Hyperparameters
batch_size              = 16
epochs                  = 40
steps_per_epoch         = 400
validation_steps        = 100 
optimizer               = 'adadelta' 
learning_rate           = 1.0
val_save_step_num       = 1

path_to_graphs          = './data/output/logs/'
model_save_dir          = './data/output/'
train_dir               = './lego_id_training_data/gray_train/'
val_dir                 = './lego_id_training_data/gray_test/'
```
#### Parameters: Training Session
The first few parameters help pick back up from an interrupted training session.  If your session is interrupted at epoch 183, then you could set `continue_training` = `True` and `initial_epoch` = 184, then execute the script.  This should then load the last best model and pick back up training where you left off.  Lastly, if you set `clear_logs` = `True` then it clears the Tensorboard information.  So, if you continue a session, you will want to set this to `False`.

This section is a WIP and there are several issues.  First, the Tensorboard logs should be saved in separate folders and shouldn't need to be cleared.  Also, when continuing a training session it resets the best validation score (tracked for saving your model before overfitting) resulting in a temporary dip in performance.

#### Parameters: Image Data
The `input_shape` refers to the dimensions of an image: height, width, and color (RGB) values.  `image_size` derives from the `input_shape`.

Note, one issue I had early on with `image_size`.  I tried non-square images (which hurt training and aren't recommended) and found out the hard way most of the image parameters looking for height and width reverse their order in the Python libraries.  

For example, this is what's needed:
```python
...
    val_dir,
    target_size = (height_here, width_here),
...
```
I was expecting:
```python
...
    val_dir,
    target_size = (width_here, height_here),
...
```
It bit me, as most frameworks I've used expect width first and then height.  I mean, even when we talk about screen resolution we list width *then* height (e.g., `1920x1080`). Just stay aware when using rectangle images.  Always RTFM (because I didn't).

The `train_test_ratio` controls how many images are held back for testing the model.  I'd have to run through the code again, but I don't think this is needed.  As the preprocessing script has already created a folder with a set number of validation images.  Hmm, I'll add it to my [tech debt](https://en.wikipedia.org/wiki/Technical_debt) list.

The `zoom_range` parameter controls how far the script should zoom in on the images.  Lastly, `shear_range` controls how much of the images to clip off the edges before feeding them to the CNN.

[![](../images/lego_classifier/batch.png){: .float-right}](https://ladvien.com/lego_classifier/batch.png)
#### Parameters: CNN Hyperparameters
Hyperparameter is the term machine-learning (ML) engineers use to refer to parameters which can impact the training outcome of a neural net.

* [What are Hyperparameters?](https://towardsdatascience.com/what-are-hyperparameters-and-how-to-tune-the-hyperparameters-in-a-deep-neural-network-d0604917584a)

`batch_size` refers to the number of photos a neural-net should attempt to predict its class before updating the entire the weights of each [perceptron](https://towardsdatascience.com/what-the-hell-is-perceptron-626217814f53).  **Note**, the highest batch size is usually limited by your GPU RAM.  Locally, I use a `GTX 1060` with 6GB of RAM--I couldn't get a batch bigger than around 16.  YMMV.

`steps_per_epoch` are the number of batches to go through before considering one epoch complete. `epochs` is an arbitrary number representing how many `batches` * `steps_per_epoch` to go through before considering the training complete.

So, the length of training would go like this: `training schedule = epochs * steps_per_epoch * batch_size`

`validation_steps` is the number of batches from the training data to use for validating the current weights.  This will be used when we `fit` (train) our classifier and when we `evaluate` it.

`optimizer` is the name of the optimizer used.  This is the heart of training, as it is what is responsible for updating the weights on each perceptron after each batch.

I've setup the code to only use one of three optimizers, either `adam`, `adagrad`, `sgd`.

Easy to read:
* [Stochastic Gradient Descent](https://en.wikipedia.org/wiki/Stochastic_gradient_descent)
* [Adam](https://machinelearningmastery.com/adam-optimization-algorithm-for-deep-learning/)
* [Adagrad](https://databricks.com/glossary/adagrad)

Primary source:
* [Adam](https://arxiv.org/abs/1412.6980)
* [Adagrad](http://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf)

The primary reason, as I understand it, to use `adagrad` over `adam`, is `adagrad`'s `learning_rate` will naturally modify itself to be more conducive to optimal convergence.

However, there are many optimizers.  A lot of them available in Keras:

* Stochastic Gradient Descent (SGD)
* RMSprop
* Adagrad
* Adadelta
* Adam
* Nadam
* Adamax

Keras' docs on optimizers:

* [Keras Optimizers](https://keras.io/optimizers/)

The `learning_rate` controls how drastically the optimizer should change the perceptrons' weights when they have made an incorrect prediction.  Too high, it won't converge (learn) too low and it will take a while.

You will find a lot of documentation saying, "The default learning rate of an optimizer is best, it doesn't need to be changed."  I've found this advice to be true, well, mostly.  I did run into an issue when using `adam`'s default setting of `0.001` in this project.  The neural-net just didn't learn--I had to drop it to around `0.0001`, which did better. 

A starter read on learning rate:

* [How to pick the best learning rate](https://medium.com/octavian-ai/which-optimizer-and-learning-rate-should-i-use-for-deep-learning-5acb418f9b2)

But! It's not exhaustive, so if you interested in tweaking the optimizer or learning rate, Google and read as much as possible.

Lastly, `val_save_step_num` controls how many training epochs should pass before the validator tests whether your model is performing well on the test set.  The way we have teh code setup, if the validator says the model is performing better than any of the previous tests within this training session, then it will save the model automatically.




### Classifier Code: Data Preparation


```python
def make_dir(dir_path):
    if not os.path.exists(dir_path):
        os.mkdir(dir_path)

# Create needed dirs
make_dir(model_save_dir)

# Save Class IDs
classes_json = train_gen.class_indices
num_classes = len(train_gen.class_indices)
```

```json
{
    "2456": 0,
    "3001": 1,
    "3002": 2,
    "3003": 3,
    "3004": 4,
    "3010": 5,
    "3039": 6,
    "32064": 7,
    "3660": 8,
    "3701": 9
}
```


### Classifier Code: Callbacks
```python
# These Keras generators will pull files from disk
# and prepare them for training and validation.
augs_gen = ImageDataGenerator (
    shear_range = shear_range,  
    zoom_range = shear_range,        
    horizontal_flip = True,
    validation_split = train_test_ratio
)  

train_gen = augs_gen.flow_from_directory (
    train_dir,
    target_size = image_size, # THIS IS HEIGHT, WIDTH
    batch_size = batch_size,
    class_mode = 'sparse',
    shuffle = True
)

test_gen = augs_gen.flow_from_directory (
    val_dir,
    target_size = image_size,
    batch_size = batch_size,
    class_mode = 'sparse',
    shuffle = False
)

```


### Classifier Code: Building the Model
```python

def test_model(opt, input_shape):
    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Conv2D(32, (3, 3), input_shape = input_shape))
    model.add(tf.keras.layers.Activation('relu'))
    model.add(tf.keras.layers.Dropout(0.2))
    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    
    model.add(tf.keras.layers.Conv2D(64, (3, 3)))
    model.add(tf.keras.layers.Activation('relu'))
    model.add(tf.keras.layers.Dropout(0.2))
    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    
    model.add(tf.keras.layers.Conv2D(128, (3, 3)))
    model.add(tf.keras.layers.Activation('relu'))
    model.add(tf.keras.layers.Dropout(0.2))
    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    
    model.add(tf.keras.layers.Flatten())  # this converts our 3D feature maps to 1D feature vectors
    model.add(tf.keras.layers.Dense(256))
    model.add(tf.keras.layers.Activation('relu'))
    
    model.add(tf.keras.layers.Dropout(0.2))
    
    model.add(tf.keras.layers.Dense(num_classes, activation = 'softmax'))
    return model

#################################
# Create model
#################################

def get_optimizer(optimizer, learning_rate = 0.001):
    if optimizer == 'adam':
        return tensorflow.keras.optimizers.Adam(lr = learning_rate, beta_1 = 0.9, beta_2 = 0.999, epsilon = None, decay = 0., amsgrad = False)
    elif optimizer == 'sgd':
        return tensorflow.keras.optimizers.SGD(lr = learning_rate, momentum = 0.99) 
    elif optimizer == 'adadelta':
        return tensorflow.keras.optimizers.Adadelta(lr=learning_rate, rho=0.95, epsilon=None, decay=0.0)

selected_optimizer = get_optimizer(optimizer, learning_rate)

model = test_model(selected_optimizer, input_shape)
model.summary()

model.compile(
    loss = 'sparse_categorical_crossentropy',
    optimizer = selected_optimizer,
    metrics = ['accuracy']
)
```


### Classifier Code: Creating Callbacks
```python
best_model_weights = model_save_dir + 'base.model'

checkpoint = ModelCheckpoint(
    best_model_weights,
    monitor = 'val_loss',
    verbose = 1,
    save_best_only = True,
    mode = 'min',
    save_weights_only = False,
    period = val_save_step_num
)

tensorboard = TensorBoard(
    log_dir = model_save_dir + '/logs',
    histogram_freq=0,
    batch_size=16,
    write_graph=True,
    write_grads=True,
    write_images=False,
)

callbacks = [checkpoint, tensorboard]
```


### Classifier Code: Training
```python
if continue_training:
    model.load_weights(best_model_weights)
    model_score = model.evaluate_generator(test_gen, steps = validation_steps)

    print('Model Test Loss:', model_score[0])
    print('Model Test Accuracy:', model_score[1])


history = model.fit_generator(
    train_gen, 
    steps_per_epoch  = steps_per_epoch, 
    validation_data  = test_gen,
    validation_steps = validation_steps,
    epochs = epochs, 
    verbose = 1,
    callbacks = callbacks
)
```