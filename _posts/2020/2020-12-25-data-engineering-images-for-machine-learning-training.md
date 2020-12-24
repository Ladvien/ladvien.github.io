---
layout: post
title: Engineering a Training Data Set from Garbage
categories: ml
series: Nothing but Neural Nets
excerpt: Annotation on the process used to refine a raw image set into an image set meant to train a generative adversarial network
tags: [data engineering, python, machine learning, gan, opencv]
image: 
    feature: scraping-internet-for-magic-symbols/scraping-internet-for-magic-symbols.png
    thumbnail: scraping-internet-for-magic-symbols/scraping-internet-for-magic-symbols.png
    credit: Photo by Robert Anasch
comments: true
custom_css:
custom_js: 
---

After scraping the internet of all the images associated with the targeted key terms, I ended with around 10k images, most of them garbage--but a lot of these images were collections of smaller images.  After dividing these up into smaller images, I ended up with 32k images.  And spoiler, after cleaning and sorting, only 2k of those were usable.

Below I'll outline how I sorted and processed the garbage heap into a clean training image set.

### Collections
The first problem I had to work out was how to extract many of the training images from an image set.

For example, we wanted to divide the following into individual images.  One per symbol:


To do this, I looped over all the images and used OpenCV to 

```py
def get_image_files_recursively(self, root_dir, exclude_files = []):
    file_types = ("*.jpg", "*.jpeg", "*.png")
    files = []

    for file_type in file_types:
        for dir, _, _ in os.walk(root_dir):
            print(dir)
            files.extend(glob(os.path.join(dir, file_type))) 

    files = [file for file in files if file not in exclude_files]

    return files
```

```py
def find_subimages(self, image, minimum_size, verbose = 0):
    images = []

    # Find contours
    cnts = self.find_subimage_contours(image)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    # Iterate through contours and filter for region-of- interested 
    for i, c in enumerate(cnts):
        x, y, w, h = cv2.boundingRect(c)
        
        # # Skip if too small.
        if w < minimum_size or h < minimum_size:
            continue
        
        if verbose > 0:
            print(f"Found image -- W: {w} H: {h}")

        images.append(image[y : y + h, x : x + w])

    return images
```

```py
def save_subimages(self, filename, image_path, output_path, minimum_size, verbose = 0):        
        image = cv2.imread(image_path, minimum_size)
        images = self.find_subimages(image, minimum_size, verbose)

        for i, image in enumerate(images):
            write_path = f"{output_path}/{filename}_{i}.png"
            if verbose > 0:
                print(f"Saving: {write_path}")
            cv2.imwrite(write_path, image)
```

```py
def find_subimage_contours(self, image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    canny = cv2.Canny(blurred, 120, 255, 1)
    kernel = np.ones((5, 5), np.uint8)
    dilate = cv2.dilate(canny, kernel, iterations=1)

    return cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
```



### 

For example:



Good engineers are lazy when it comes to tedium, and there's no way I was hand sorting 32,000 images.  

I thought, "I need a way write a script to sort these images--but, they need to be images _I_ believe carry signal."  Then it hit me, that's what an image classifiers were good at.  I decided I would try creating a small training data set of images.  There would be two categories, "magic symbols" and "garbage."  I would train a CNN to classify images into these two categories.   Then, I would use this CNN to sort the 32,000 images.  It worked like a charm. (Eh? eh?)

After using the classifier to sort the images, I ended with 6,000 training images.  Of course, I still had to comb through these images for a few occasional bits of noise.  But I tried to be smart about it, I moved the noise into my "garbage" category and retrained my CNN.  Then repeated the classification.  After a few iterations and only minimal amount of hand sorting, I had 5,200 pretty solid training images.  Huzzah!

Here's a sample of the images I used
![deep-convolutional-generative-adversarial-network-magic-symbol-training-data](/images/deep-arcane/training-data-sampler2.png)

## Training Method


## Create your own Deep Magic Symbol Generator

Whether you are interested in making your own magic symbol generator, or you would like to 


![degan-searching-symbols-in-vampire-archive](/images/deep-arcane/thomas_ancient_archives.gif)
