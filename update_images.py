#!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']

print('')
print('******************************')
print('* Updating Website           *')
print('******************************')
os.system(f'rsync -h -v -r -P -t {root_path}/ladvien.github.io/_site/assets/ root@ladvien.com:/usr/share/nginx/html/assets/')

