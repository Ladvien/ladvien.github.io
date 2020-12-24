---
layout: post
title: Scraping Google Image Search for Deep Learning Training Images using Python
categories: ml
series: Nothing but Neural Nets
excerpt: A guide on  how to use the Google image search to collect images for training a deep convolutional generative adversarial network.  Or other neural networks.
tags: [Python, Machine Learning, GAN, chromedriver, Deep Learning]
image: 
    feature: scraping-internet-for-magic-symbols/scraping-internet-for-magic-symbols.png
    thumbnail: scraping-internet-for-magic-symbols/training-data-garbage.png
    credit: Photo by Robert Anasch
comments: true
custom_css:
custom_js: 
---
This articles relies on the code written by Fabian Bosler:

* [Image Scraping with Python](https://towardsdatascience.com/image-scraping-with-python-a96feda8af2d)

I've only modified Bosler's code to make it a bit easier to pull images for multiple search terms.

## Magic Symbols
As I've mentioned in my previous article, I needed a lot of images of magic symbols for training a deep convolutional generative adversarial network (DCGAN).  Luckily, I landed on Bosler's article early on.

To get my images, I used Chrome browser, Chromedriver, Selenium, and a Python script to slowly scrape images from Google's image search.  The scraping was done throttled to near human speed, but allowed automating the collection of a lot of images.

Regarding this process, I'll echo Bosler, **I'm in no way a legal expert.  I'm not a lawyer and nothing I state should be taking as legal advice.  I'm just some hack on the internet.**  However, from what I understand, scraping the SERPs (search engine results pages) is not illegal, at least, not for personal use.  But using Google's Image search for automated scraping of images **is** against their terms of service ([ToS](https://www.google.com/intl/en_ZZ/policies/terms/archive/20070416/)).  Replicate this project at your own risk.  I know when I adjusted my script to search faster Google banned my IP.  I'm glad it was temporary.

## Bosler's Modified Script
The script automatically searches for images and collects their underlying URL.  After searching, it uses the Python `requests` library to download all the images into a folder named respective to the search term.

Here are the modifications I made to Bosler's original script:
* First, I've created a search term loop.  This allows the script to continue running past one search term.  
* The script was getting stuck when it ran into the "Show More Results," I've fixed the issue.
* The results are saved in directories associated with the search term.  If the script is interrupted and rerun it will look at what directories are created first, and remove those from the search terms.
* I added a timeout feature; thanks to a user on [Stack Overflow](https://stackoverflow.com/a/22348885).
* Lastly, I parameterized the number of images to look for per search term, sleep times, and timeout.

## Code: Libraries
You will need to install Chromedriver and Selenium--this is explained well in the original article.

* [Image Scraping with Python](https://towardsdatascience.com/image-scraping-with-python-a96feda8af2d)

You will also need to install [Pillow](https://pillow.readthedocs.io/en/stable/)--a Python library for managing images.  

You can install it with:
```bash
pip install pillow
```

After installing all the needed libraries the following block of code should execute without error:
```python
import os
import time

import io
import hashlib
import signal
from glob import glob
import requests

from PIL import Image
from selenium import webdriver
```
If you have any troubles, revisit the original articles setup explanation or feel free to ask questions in the comments below.


## Code: Parameters
I've added a few parameters to the script to make use easier. 
```python
number_of_images = 400
GET_IMAGE_TIMEOUT = 2
SLEEP_BETWEEN_INTERACTIONS = 0.1
SLEEP_BEFORE_MORE = 5
IMAGE_QUALITY = 85

output_path = "/path/to/your/image/directory"
```
The `number_of_images` tells the script how many images to search for per search term.  If the script runs out of images before reaching `number_of_images`, it will skip to the next term.

`GET_IMAGE_TIMEOUT` determines how long the script should wait for a response from the server hosting the image to respond before skipping to the next image URL.

`SLEEP_BETWEEN_INTERACTIONS` is how long the script should delay before checking the URL of the next image.  In theory, this can be set low, as I don't think it makes any requests of Google.  But I'm unsure, adjust at your own risk.

`SLEEP_BEFORE_MORE` is how long the script should wait before clicking on the "Show More Results" button.  This should **not** be set lower than you can physically search.  Your IP will be banned.  Mine was.


## Code: Search Terms
Here is where the magic happens.  The `search_terms` array should include any terms which you think will get the sorts of images you are targeting.  Below is the exact set of terms I used to collect magic symbol images:
```python
search_terms = [
    "black and white magic symbol icon",
    "black and white arcane symbol icon",
    "black and white mystical symbol",
    "black and white useful magic symbols icon",
    "black and white ancient magic sybol icon",
    "black and white key of solomn symbol icon",
    "black and white historic magic symbol icon",
    "black and white symbols of demons icon",
    "black and white magic symbols from book of enoch",
    "black and white historical magic symbols icons",
    "black and white witchcraft magic symbols icons",
    "black and white occult symbols icons",
    "black and white rare magic occult symbols icons",
    "black and white rare medieval occult symbols icons",
    "black and white alchemical symbols icons",
    "black and white demonology symbols icons",
    "black and white magic language symbols icon",
    "black and white magic words symbols glyphs",
    "black and white sorcerer symbols",
    "black and white magic symbols of power",
    "occult religious symbols from old books",
    "conjuring symbols",
    "magic wards",
    "esoteric magic symbols",
    "demon summing symbols",
    "demon banishing symbols",
    "esoteric magic sigils",
    "esoteric occult sigils",
    "ancient cult symbols",
    "gypsy occult symbols",
    "Feri Tradition symbols",
    "Quimbanda symbols",
    "Nagualism symbols",
    "Pow-wowing symbols",
    "Onmyodo symbols",
    "Ku magical symbols",
    "Seidhr And Galdr magical symbols",
    "Greco-Roman magic symbols",
    "Levant magic symbols",
    "Book of the Dead magic symbols",
    "kali magic symbols",
]
```
Before searching, the script checks the image output directory to determine if images have already been gathered for a particular term.  If it has, the script will exclude the term from the search.  This is part of my "be cool" code.  We don't need to be downloading a bunch of images twice.

The code below grabs all the directories in our output path, then reconstructs the search term from the directory name (i.e., it replaces the "_"s with " "s.)
```python
dirs = glob(output_path + "*")
dirs = [dir.split("/")[-1].replace("_", " ") for dir in dirs]
search_terms = [term for term in search_terms if term not in dirs]
```

## Code: Chromedriver
Before starting the script, we have to kick off a Chromedriver session.  Note, you must the `chromedriver` executable to a folder listed in your `PATH` variable for Selenium to find it.

For MacOS users, setting up Chromedriver for Selenium use is a bit tough to do manually.  But, using homebrew makes it easy.
```
brew install chromedriver
``` 

```python
wd = webdriver.Chrome()
wd.get("https://google.com")
```

## Code: Chrome Timeout
The timeout class below I borrowed from [Thomas Ahle at Stack Overflow](https://stackoverflow.com/a/22348885).  It is a dirty way of creating a timeout for the `GET` request to download the image.  Without it, the script can get stuck on unresponsive image downloads.
```python
class timeout:
    def __init__(self, seconds=1, error_message="Timeout"):
        self.seconds = seconds
        self.error_message = error_message

    def handle_timeout(self, signum, frame):
        raise TimeoutError(self.error_message)

    def __enter__(self):
        signal.signal(signal.SIGALRM, self.handle_timeout)
        signal.alarm(self.seconds)

    def __exit__(self, type, value, traceback):
        signal.alarm(0)
```

## Code: Fetch Images
As I've hope I made clear, the code below I did not write; I just polished it a bit.  I'll provide a brief explanation, but refer back to Bosler's article for more information.

Essentially, the script:
1. Creates a directory corresponding to a search term in the array.
2. It passes the search term to the `fetch_image_urls()`, this function drives the Chrome session.  The script navigates the Google to find images relating to the search term.  It stores the image link in an list.  After it has searched through all the images or reached the `num_of_images` it returns a list (`res`) containing all the image URLs.
3. The list of image URLs is passed to the `persist_image()`, which then downloads each one of the images into the corresponding folder.
4. It repeats steps 1-3 per search term.

I've added extra comments as a guide:
```python
def fetch_image_urls(
    query: str,
    max_links_to_fetch: int,
    wd: webdriver,
    sleep_between_interactions: int = 1,
):
    def scroll_to_end(wd):
        wd.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(sleep_between_interactions)

    # Build the Google Query.
    search_url = "https://www.google.com/search?safe=off&site=&tbm=isch&source=hp&q={q}&oq={q}&gs_l=img"

    # load the page
    wd.get(search_url.format(q=query))

    # Declared as a set, to prevent duplicates.
    image_urls = set()
    image_count = 0
    results_start = 0
    while image_count < max_links_to_fetch:
        scroll_to_end(wd)

        # Get all image thumbnail results
        thumbnail_results = wd.find_elements_by_css_selector("img.Q4LuWd")
        number_results = len(thumbnail_results)

        print(
            f"Found: {number_results} search results. Extracting links from {results_start}:{number_results}"
        )

        # Loop through image thumbnail identified
        for img in thumbnail_results[results_start:number_results]:
            # Try to click every thumbnail such that we can get the real image behind it.
            try:
                img.click()
                time.sleep(sleep_between_interactions)
            except Exception:
                continue

            # Extract image urls
            actual_images = wd.find_elements_by_css_selector("img.n3VNCb")
            for actual_image in actual_images:
                if actual_image.get_attribute(
                    "src"
                ) and "http" in actual_image.get_attribute("src"):
                    image_urls.add(actual_image.get_attribute("src"))

            image_count = len(image_urls)

            # If the number images found exceeds our `num_of_images`, end the seaerch.
            if len(image_urls) >= max_links_to_fetch:
                print(f"Found: {len(image_urls)} image links, done!")
                break
        else:
            # If we haven't found all the images we want, let's look for more.
            print("Found:", len(image_urls), "image links, looking for more ...")
            time.sleep(SLEEP_BEFORE_MORE)

            # Check for button signifying no more images.
            not_what_you_want_button = ""
            try:
                not_what_you_want_button = wd.find_element_by_css_selector(".r0zKGf")
            except:
                pass

            # If there are no more images return.
            if not_what_you_want_button:
                print("No more images available.")
                return image_urls

            # If there is a "Load More" button, click it.
            load_more_button = wd.find_element_by_css_selector(".mye4qd")
            if load_more_button and not not_what_you_want_button:
                wd.execute_script("document.querySelector('.mye4qd').click();")

        # Move the result startpoint further down.
        results_start = len(thumbnail_results)

    return image_urls


def persist_image(folder_path: str, url: str):
    try:
        print("Getting image")
        # Download the image.  If timeout is exceeded, throw an error.
        with timeout(GET_IMAGE_TIMEOUT):
            image_content = requests.get(url).content

    except Exception as e:
        print(f"ERROR - Could not download {url} - {e}")

    try:
        # Convert the image into a bit stream, then save it.
        image_file = io.BytesIO(image_content)
        image = Image.open(image_file).convert("RGB")
        # Create a unique filepath from the contents of the image.
        file_path = os.path.join(
            folder_path, hashlib.sha1(image_content).hexdigest()[:10] + ".jpg"
        )
        with open(file_path, "wb") as f:
            image.save(f, "JPEG", quality=IMAGE_QUALITY)
        print(f"SUCCESS - saved {url} - as {file_path}")
    except Exception as e:
        print(f"ERROR - Could not save {url} - {e}")

def search_and_download(search_term: str, target_path="./images", number_images=5):
    # Create a folder name.
    target_folder = os.path.join(target_path, "_".join(search_term.lower().split(" ")))

    # Create image folder if needed.
    if not os.path.exists(target_folder):
        os.makedirs(target_folder)

    # Open Chrome
    with webdriver.Chrome() as wd:
        # Search for images URLs.
        res = fetch_image_urls(
            search_term,
            number_images,
            wd=wd,
            sleep_between_interactions=SLEEP_BETWEEN_INTERACTIONS,
        )

        # Download the images.
        if res is not None:
            for elem in res:
                persist_image(target_folder, elem)
        else:
            print(f"Failed to return links for term: {search_term}")

# Loop through all the search terms.
for term in search_terms:
    search_and_download(term, output_path, number_of_images)
```

## Results
Scraping tehe images resulted in a lot of garbage images (noise) along with my ideal training images.

For example, out of all the images shown, I only wanted the image highlighted:
![magic-symbol-training-data-collection-noise-sample](/images/scraping-internet-for-magic-symbols/training-data-garbage.png)

There was also the problem of lots of magic symbols stored in a single image.  These "collection" images would need further processing to extract all of the symbols.  
![collection-of-magic-symbols-in-google-search-results](/images/scraping-internet-for-magic-symbols/collection_of_images.png)

However, even with a few rough edges, the script sure as hell beat manually downloading the 10k images I had in the end.



