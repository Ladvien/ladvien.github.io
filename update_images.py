#!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']

print('')
print('*******************************************************')
print('* Moving raw_images into images                       *')
print('*******************************************************')
os.system(f'rsync -h -v -r -P -t --ignore-existing {root_path}/ladvien.github.io/raw_images/* {root_path}/ladvien.github.io/images')

print('')
print('******************************')
print('* Updating Website           *')
print('******************************')
os.system(f'rsync -h -v -r -P -t {root_path}/ladvien.github.io/_site/* root@ladvien.com:/usr/share/nginx/html')

