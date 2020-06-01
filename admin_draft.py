#!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']

print('')
print('*******************************************************')
print('* Adding raw_images to Ladvien.com/raw_images *')
print('*******************************************************')
os.system(f'rsync -h -v -r -P -t -u {root_path}/ladvien.github.io/raw_images/ {root_path}/ladvien.github.io/images/')

print('')
print('*******************************************************')
print('* Syncing files to Ladvien.com Jekyll build directory *')
print('*******************************************************')
os.system(f'bundle exec jekyll build -I --source {root_path}/ladvien.github.io --destination {root_path}/ladvien.github.io/_site')

os.system(f'/usr/bin/open -a "/Applications/Google Chrome.app" "{root_path}/ladvien.github.io/_site/index.html"')