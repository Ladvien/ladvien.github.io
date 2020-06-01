#!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']

print('')
print('******************************')
print('* Updating Website           *')
print('******************************')
# RSYNC OPTIONS:
# -h = output numbers in a human-readable format
# -v = increase verbosity
# -r = recurse into directories
# -P = progress
# -t = preserve modification times
# -u = skip files that are newer on the receiver
os.system(f'rsync -h -v -r -P -t -u {root_path}/ladvien.github.io/_site/images/ root@ladvien.com:/usr/share/nginx/html/images/')
os.system(f'rsync -h -v -r -P -t -u {root_path}/ladvien.github.io/_site/raw_images/ root@ladvien.com:/usr/share/nginx/html/raw_images/')
os.system(f'rsync -h -v -r -P -t -u {root_path}/ladvien.github.io/_site/assets/ root@ladvien.com:/usr/share/nginx/html/assets/')

