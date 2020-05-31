#!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']

print('')
print('******************************')
print('* Updating Website           *')
print('******************************')
os.system(f'rsync -h -v -r -P -t --ignore-existing {root_path}/ladvien.github.io/_site/images/ root@ladvien.com:/usr/share/nginx/html/images/')
os.system(f'rsync -h -v -r -P -t --ignore-existing {root_path}/ladvien.github.io/_site/raw_images/ root@ladvien.com:/usr/share/nginx/html/raw_images/')
os.system(f'rsync -h -v -r -P -t --ignore-existing {root_path}/ladvien.github.io/_site/assets/ root@ladvien.com:/usr/share/nginx/html/assets/')

