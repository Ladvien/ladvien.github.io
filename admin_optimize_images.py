import os, sys, shutil
from datetime import date
import glob
from PIL import Image

root_path = os.environ['HOME']

############
# Parameters
############
input_directory = f'{root_path}/ladvien.github.io/raw_images'
output_directory = f'{root_path}/ladvien.github.io/images'

max_size                = 1080
max_file_size_kb        = 300 
compression_quality     = 85

ignore_existing         = True 

#########################
# Move non-compressables
#########################
os.system(f'rsync -h -v -r -P -t --ignore-existing --exclude="*.jpg" --exclude="*.JPG" --exclude="*.png" --exclude="*.PNG" {root_path}/ladvien.github.io/_site/raw_images/ {root_path}/ladvien.github.io/_site/images/')

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

    # Replace spaces with underscores.
    image_file_name = image_file_name.replace(' ', '_')

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
        if file_size_kb < 400:
            print('Optimizing level 1')
            image.save(image_output_file_path, optimize = True, quality = 95)
        elif file_size_kb < 500:
            print('Optimizing level 2')
            image.save(image_output_file_path, optimize = True, quality = 85)
        elif file_size_kb < 600:
            print('Optimizing level 3')
            image.save(image_output_file_path, optimize = True, quality = 80)
        elif file_size_kb >= 600 :
            print('Optimizing level 4')
            image.save(image_output_file_path, optimize = True, quality = 75)
        
        file_size_kb_new = os.stat(image_output_file_path).st_size / 1000
        print(f'{image_index} / {image_count} = {round((image_index / image_count) * 100, 2)}% -- File size before {file_size_kb}kb and after {file_size_kb_new}kb')

    else:
        print('Already optimized.')
        image.save(image_output_file_path)
        
    image_index += 1


    
