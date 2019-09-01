---
layout: post
title: A LEGO Classifier -- CNN and Elbow Grease
categories: robot
series: 
excerpt:
tags: [tensorflow, deep learning, legos, robots, cnn]
image: 
    feature: lego_mess.jpg
    credit: Photo by Markus Spiske
comments: true
custom_css:
custom_js: 
---

[![](../images/lego_classifier/lego_classifier_comic.png){: .float-right}](https://ladvien.com/lego_classifier/lego_classifier_comic.png) I've a robot friend.  To be clear, the friend is not a robot, rather, we build robots together.  One of the projects we tossed about is building a LEGO sorting machine.  Rockets is the friends name--again, not a robot--teaches robotics to kids.  For their designs, LEGOs are the primary component.  Unfortunately, this results in much time spent to preparing for an event.

He mentioned to me, "What I really need is a sorting machine."  And proceeded to explain his plain for building one.  

I was skeptical for some time, but finally, I got drawn in he talked about incorporating a deep neural-network.  More specifically, a convolutional neural-network (CNN).  I'd been looking for an excuse to build a CNN.  This was a good one. 

Anyway, these blog posts are our journal in build the LEGO sorter. 

Before we get started, a note about this series: I won't spend much time on explaining parts of the work where it is better documented elsewhere.  Instead, I'm going to focus on stuff I've found everyone else omitting.  Like, putting the neural-network to work. This one bugged me. Everyone loves to say, "Dude, my classifier has a validation accuracy of 99.999%!"  That's great, but as we found out, validation accuracy doesn't always translate into _production accuracy._

## TL;DR
If you don't want to listen to my rambling or want to do things the easy way, you can jump straight into the code using Google's Colab:

* [lego_classifier](https://colab.research.google.com/drive/1b2_w2o60dMVJlV4Od25zTx2OUP07tdue)

This notebook is setup to download Rocket's data and train the classifier.  Thanks to Google for providing a GPU to train on and Github for hosting the data.

Or if you want to run the code locally, Rocket made the training data public.  Just know, you'll need a GPU.

* [lego_id_training_data](https://github.com/Ladvien/lego_id_training_data)

Then jump to the code by clicking [here](https://ladvien.com/lego-deep-learning-classifier/#preprocessing-code-needed-libraries).


## The Idea
It was pretty straightfoward to begin with.  We'd find some images of LEGOs on the internet and then train a CNN to classify them by their part code.  It was a bit naive, but that's where must projects being, right? Hopeful naiveté.

Anyway, we searched the webs for projects like this, as we hoped they had prepared images.  Google told us several folks doing similar work.  I'm not going to list them all, only what I considered worth a read:

* [Lego Sorter using TensorFlow on Raspberry Pi](https://medium.com/@pacogarcia3/tensorflow-on-raspbery-pi-lego-sorter-ab60019dcf32)

This is an _extremely_ well documented project by [Paco Garcia](https://medium.com/@pacogarcia3).

So, after reading a few articles, we figured we could do this.  We just needed data.  After a bit more searching we found the following datasets:

* [Kaggle: Database of Lego "Images" (they are rendered from models)](https://www.kaggle.com/joosthazelzet/lego-brick-images)
* [Kaggle: Lego vs Generic Brick](https://www.kaggle.com/pacogarciam3/lego-vs-generic-brick-image-recognition#example_Lego_1x4_crop0.jpg)

I wasn't happy about these datasets.  Their structures weren't great and they were not designed to help train a classifier.  But then, Rockets found Paco had actually opened his dataset to the public:

* [Kaggle: Lego Brick Sorting (best)](https://www.kaggle.com/pacogarciam3/lego-brick-sorting-image-recognition?fbclid=IwAR303nIR4revbYVmW7YfC_4Frnqu3yn5gOi_HP7elJ4h1_a7uXDE1MVtacw)

One bit more, Paco also made his code public:

* [11 Class Tensorflow Model](https://github.com/pacogarcia3/lego-11class-tensorflow)

Paco, you are a robot friend, too! 

Alright, we were encouraged by Paco.  We knew the project would be possible.  However, we didn't want to step on [brownfield](https://en.wikipedia.org/wiki/Brownfield_(software_development)).  We needed the green. Or if you don't speak dev, we didn't want to do this the easy way and replicate Paco's work.  We wanted to really beat ourselves up by doing everything from scratch.

## Creating a Dataset
As I stated before, I didn't like any datasets but Paco's.  It was real images and meant to train a classifier.  But, they weren't the LEGOs we wanted to classify.  Rockets's LEGO projects involve a lot of technic bricks, which didn't seem to be in Paco's mix.  So, we set out to create our own.

The first attempt creating training images was by rendering images from `.stl` files found on the internet using the Python version of [Visualization Toolkit](https://vtk.org/).  I won't cover it here since it was a fail and as I'll create an article later about the stuff we tried and didn't work.

![](../images/lego_classifier/rockets_contraption.jpg){: .float-left} Anyway, while I was working on it Rockets had a brilliant plan.  He created an instrument to take pictures of a LEGO on a spin plate.  It used a Raspberry Pi, Pi Cam, and stepper motor, and unicorn farts.

Then Rockets began taking pictures of 10 classes of LEGOs. Not sure how long this took , but shortly he pinged me saying he had 19,000 images. (Ok, ok, he might be _part_ robot.) 

I'm not going to attempt explaining the build, as I believe Rockets will do this later.  Besides, about the only part I understand is the unicorn flatulence.


Alright! Now I needed to get my butt in gear and fix up the software.
<div style="clear: both;"></div>

## Preprocessing Code
Before we could start training a CNN on Rockets's images we needed to do some preprocessing.  First, the images came in at full resolution, but we needed to crop them, as the CNN train better on square image.  Of course, the image would need to be cropped as not to lose the target data (the LEGO).

For example
![preprocess-image-for-cnn](../images/lego_classifier/crop_and_resize.png)

Also, the trainer would be expecting a file structure something like this:

```bash
data
├── test
│   ├── 2456
│   │     └── 2456_0001.jpg
│   │     └── 2456_0002.jpg
│   │     └── 2456_0003.jpg
│   │     └── ....
│   ├── 3001
│   ├── 3002
│   ├── 3003
│   ├── 3004
│   ├── 3010
│   ├── 3039
│   ├── 32064
│   ├── 3660
│   └── 3701
└── train
    ├── 2456
    ├── 3001
    ├── 3002
    ├── 3003
    ├── 3004
    ├── 3010
    ├── 3039
    ├── 32064
    ├── 3660
    └── 3701
```
Therefore, I've written a Python script to do the following

1. Take a path where images are stored by name of the class
2. Load the image
3. Resize the image to specified size
4. Crop from the center of the image out
5. Create a train and test folder
6. Create sub-folders in train and test with the class name
7. Shuffle the images in the process
8. Save the cropped file in the appropriate folder, depending what percentage of images you want to withhold for testing.
9.  Repeat steps 2-8 for every image

Let's jump into the code.

The full code can found here:

* [square_crop.py](https://github.com/Ladvien/lego_sorter/blob/master/square_crop.py)

But I'll walk through the code below.

## Preprocessing Code: Needed Libraries
```python
import os
import glob
import cv2
import random
```
The only non-standard Python library we are using is:

* [OpenCV](https://pypi.org/project/opencv-python/)

This may be a bit tricky depending on which OS you are using and whether you are using Anaconda or straight Python.  However, the following is what we used:

```bash
pip install https://pypi.org/project/opencv-python/
```

If you have any troubles load the `cv2` library, it probably means there was an issue installing OpenCV.  Just let me know in the comments and I can help debug.

## Preprocessing Code: Processing Parameters
The following control the the flow of preprocessing

* `dry_run`: if set to true, it does not save the images, but does everything else
* `gray_scale`: converts the images to gray-scale.
* `root_path`: the root folder of the project
* `show_image`: shows the before and after of the image.
* `output_img_size`: adjust this to the size of your desired output image
* `grab_area`: the total area of the original image to take before resizing
* `train_test_split`: the rate of test images to withhold
* `shuffle_split`: should the images be shuffled in the process
* `part_numbers`: a list of all the class folders contained in the input


```python
#####################
# Parameters
#####################     

dry_run                 = False # If true, will print output directory.
gray_scale              = True

root_path               = './data/'
input_path              = f'{root_path}raw/size_1080/'
output_path             = f'{root_path}cropped/'

show_image              = False

output_img_size         = (300, 300)
grab_area               = 500
train_test_split        = 0.3
shuffle_split           = True

part_numbers            = [
                           '2456',
                           '3001',
                           '3002',
                           '3003',
                           '3004',
                           '3010',
                           '3039',
                           '3660',
                           '3701',
                           '32064'
                        ]
```
Below is the main loop.  It is going to repeat for every **folder** it finds in the the root folder.

```python
for part_number in part_numbers:

    part_input_path  = f'{input_path}{part_number}/'
    
    # Get input file paths.
    image_files = glob.glob(f'{part_input_path}*.jpg')
    num_files = len(image_files)

    # Image index.
    index = 0

    # If true, the images will be loaded and then split at random.
    if shuffle_split:
        file_index = random.sample(range(1, num_files), num_files - 1)
    else:
        file_index = range(1, num_files)
```

This is the inner loop, it loads each of the image files in the class class folder, modifies it, and saves it to the output folders.

```python
    for file_num in file_index:
        
        # Increment the file index.
        index += 1
        
        # Load the image
        input_file_path = f'{input_path}{part_number}/{str(file_num).zfill(4)}.jpg'
        print(f'LOADED: {input_file_path}')
        
        # Crop raw image from center.
        img = cv2.imread(input_file_path)

        # Get the center of the image.
        c_x, c_y = int(img.shape[0] / 2), int(img.shape[1] / 2)
        img = img[c_y - grab_area: c_y + grab_area, c_x - grab_area: c_x + grab_area]
         
        # Resize image
        img = cv2.resize(img, output_img_size, interpolation = cv2.INTER_AREA)
        
        # Should we convert it to grayscale?
        if gray_scale:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Show to user.
        if show_image:
            cv2.imshow('image', img)
            cv2.waitKey(0)
            cv2.destroyAllWindows() 

        # Determine if it should be output to train or test.
        test_or_train = 'train'        
        if index < int(num_files * train_test_split): 
            test_or_train = 'test'
        
        # Prepare the output folder.
        color = ''
        if gray_scale:
            part_output_folder = f'{output_path}gray_scale/{test_or_train}/{part_number}/'
        else:
            part_output_folder = f'{output_path}color/{test_or_train}/{part_number}/'
            
        # Make the output directory, if it doesn't exist.
        if not os.path.exists(part_output_folder):
            os.makedirs(part_output_folder)

        # Create part path.
        part_image_path = f'{part_output_folder}{part_number}_{index}.jpg'
        
        # Output
        if dry_run:
            print(f'Would have saved to: {part_image_path}')
        else:
            print(f'SAVED: {part_image_path}')
            cv2.imwrite(part_image_path, img)
```
Fairly straightfoward.  Just make sure to run to run the script from the main directory.  For example

```bash
project_folder
└── square_crop.py <--- run from here
└── data
    ├── test
    │   ├── 2456
    │   │     └── 2456_0001.jpg
...
```
Or, if you don't want to do it the hardway.  Rockets has made his images available

* [lego_id_training_data](https://github.com/Ladvien/lego_id_training_data)

## Next
Next, I'm going to dive into the Tensorflow CNN code.  Stay tuned, my robot friends!