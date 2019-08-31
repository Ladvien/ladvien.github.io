#!/bin/python
import os
import webbrowser

root_path = os.environ['HOME']

print("*******************************************************")
print("* Syncing files to Ladvien.com Jekyll build directory *")
print("*******************************************************")
os.system(f'bundle exec jekyll build --source {root_path}/ladvien.github.io --destination {root_path}/ladvien.github.io/_site')

print("")
print("*******************************************************")
print("* Moving raw_images into images                       *")
print("*******************************************************")
os.system(f'rsync -h -v -r -P -t --size-only {root_path}/ladvien.github.io/raw_images/* {root_path}/ladvien.github.io/images')


print('')
print("******************************")
print("* Updating Website Images    *")
print("******************************")
os.system(f'rsync -avzu --ignore-existing {root_path}/ladvien.github.io/raw_images/* root@ladvien.com:/usr/share/nginx/html/raw_images')
os.system(f'rsync -avzu --ignore-existing {root_path}/ladvien.github.io/images/* root@ladvien.com:/usr/share/nginx/html/images')

webbrowser.open(f'file://{root_path}/ladvien.github.io/_site/index.html')