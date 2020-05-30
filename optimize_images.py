#!/usr/bin/python3
import os, sys
from datetime import date
import glob
from PIL import Image

root_path = os.environ['HOME']

############
# Parameters
############
input_directory = f'{root_path}/ladvien.github.io/raw_images'
output_directory = f'{root_path}/ladvien.github.io/images'

max_size                = 1920
max_file_size_kb        = 300 
compression_quality     = 85

ignore_existing         = True 

############
# Transforms
############
print('')
print('*******************************************************')
print('* Moving raw_images into images                       *')
print('*******************************************************')
image_paths = glob.glob(f'{input_directory}/**/*.jpg', recursive = True) +\
              glob.glob(f'{input_directory}/**/*.JPG', recursive = True) +\
              glob.glob(f'{input_directory}/**/*.png', recursive = True) +\
              glob.glob(f'{input_directory}/**/*.PNG', recursive = True)


def resize(image, max_size):
    print('Resizing image...')

    width, height = image.size
    ratio = max_size / width

    new_width = int(width * ratio)
    new_height = int(height * ratio)

    return image.resize((new_width, new_height))

image_index = 0
image_count = len(image_paths)

for image_path in image_paths:

    # Get the file name.
    image_file_name = image_path.split('/')[-1]

    # Get output directory for file.
    input_image_dir = input_directory.split('/')[-1]
    output_image_dir = output_directory.split('/')[-1]

    image_output_file = image_path.split('/')[-1]
    image_output_dir = image_path.replace(input_image_dir, output_image_dir).replace(image_output_file, '')
    image_output_file_path = image_output_dir + image_output_file

    # Ensure the output directory exists.
    if not os.path.exists(image_output_dir):
        os.mkdir(image_output_dir)

    # Get the output file path.
    output_file_path = f'{image_output_dir}{image_file_name}'

    if os.path.exists(output_file_path) and ignore_existing:
        image_index += 1
        continue

    # Determine the starting file size.
    file_size_kb = os.stat(image_path).st_size / 1000

    image = Image.open(image_path)
    img_width, img_height = image.size
    
    # Resize images too large.
    if img_width > max_size:
        image = resize(image, max_size)

    if file_size_kb > max_file_size_kb:
        image.save(image_output_file_path, optimize = True, quality = compression_quality)
    else:
        image.save(image_output_file_path)
    
    file_size_kb_new = os.stat(output_file_path).st_size / 1000

    print(f'{image_index} / {image_count} = {round((image_index / image_count) * 100, 2)}% -- File size before {file_size_kb}kb and after {file_size_kb_new}kb')
    image_index += 1


    
