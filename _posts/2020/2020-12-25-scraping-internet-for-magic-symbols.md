## Training Data
It may be blasphemy, but I prize my data engineering over machine learning skills.  As I learned, putting together a good training data set is tough.  For this project, the I collected images by scraping the internet through Google's image search.  This method is technically against Google's terms of service, but it seemed to work.  Below is a random sample of search terms I used:
```
occult religious symbols from old books
conjuring symbols
magic wards
esoteric magic symbols
demon summing symbols
ancient cult symbols
gypsy occult symbols
Feri Tradition symbols
Quimbanda symbols
Nagualism symbols
Pow-wowing symbols
Book of the Dead magic symbols
kali magic symbols
```
Scraping images resulted in a lot of garbage images (noise) along with my ideal training images.  

For example, out of all the images shown, I only wanted the image highlighted.
![magic-symbol-training-data-collection-noise-sample](../../images/deep-arcane/training-data-garbage.png)

I'll try to cover these issues in later articles.

After running through all of the key terms above, I ended with 32,000 images, most of them garbage.  Good engineers are lazy when it comes to tedium, and there's no way I was hand sorting 32,000 images.  

I thought, "I need a way write a script to sort these images--but, they need to be images _I_ believe carry signal."  Then it hit me, that's what an image classifiers were good at.  I decided I would try creating a small training data set of images.  There would be two categories, "magic symbols" and "garbage."  I would train a CNN to classify images into these two categories.   Then, I would use this CNN to sort the 32,000 images.  It worked like a charm. (Eh? eh?)

After using the classifier to sort the images, I ended with 6,000 training images.  Of course, I still had to comb through these images for a few occasional bits of noise.  But I tried to be smart about it, I moved the noise into my "garbage" category and retrained my CNN.  Then repeated the classification.  After a few iterations and only minimal amount of hand sorting, I had 5,200 pretty solid training images.  Huzzah!

Here's a sample of the images I used
![deep-convolutional-generative-adversarial-network-magic-symbol-training-data](../../images/deep-arcane/training-data-sampler2.png)

## Training Method


## Create your own Deep Magic Symbol Generator

Whether you are interested in making your own magic symbol generator, or you would like to 


![degan-searching-symbols-in-vampire-archive](/images/deep-arcane/thomas_ancient_archives.gif)
