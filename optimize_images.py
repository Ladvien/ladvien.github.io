#!/usr/bin/python3
import os, sys
from datetime import date
import glob

root_path = os.environ['HOME']

############
# Parameters
############
input_directory = f'{root_path}/Desktop/images'
output_directory = f'{root_path}/Desktop/processed_images'

max_size = 2500

############
# Transforms
############
print('')
print('*******************************************************')
print('* Moving raw_images into images                       *')
print('*******************************************************')
# RSYNC OPTIONS:
# -h = output numbers in a human-readable format
# -v = increase verbosity
# -r = recurse into directories
# -P = progress
# -t = preserve modification times
# --ignore-existing = skip updating files that exist on receiver
# os.system(f'scp -r {root_path}/ladvien.github.io/raw_images/* {input_directory}')


image_paths = glob.glob(f'{root_path}/Desktop/images/*.jpg', recursive = True) +\
              glob.glob(f'{root_path}/Desktop/images/*.JPG', recursive = True) +\
              glob.glob(f'{root_path}/Desktop/images/*.png', recursive = True) +\
              glob.glob(f'{root_path}/Desktop/images/*.png', recursive = True)

from PIL import Image

# def crop_center(pil_img, crop_width, crop_height):

#     img_width, img_height = pil_img.size
#     return pil_img.crop(((img_width - crop_width) // 2,
#                          (img_height - crop_height) // 2,
#                          (img_width + crop_width) // 2,
#                          (img_height + crop_height) // 2))

def resize(image, max_size):
    print('Resizing image...')

    width, height = image.size
    ratio = max_size / width

    new_width = int(width * ratio)
    new_height = int(height * ratio)

    return image.resize((new_width, new_height))

for image_path in image_paths:

    image_file_name = image_path.split('/')[-1]
    # print(image_file_name)

    image = Image.open(image_path)
    img_width, img_height = image.size
    
    # Resize images too large.
    if img_width > max_size:
        image = resize(image, max_size)
        image.save(f'{output_directory}/{image_file_name}')


    
