#!/bin/python
import os
import webbrowser

print("*******************************************************")
print("* Syncing files to Ladvien.com Jekyll build directory *")
print("*******************************************************")
os.system('bundle exec jekyll build --source /home/ladvien/ladvien.github.io --destination /home/ladvien/ladvien.github.io/_site')

print("")
print("*******************************************************")
print("* Moving raw_images into images                       *")
print("*******************************************************")
os.system('rsync -h -v -r -P -t --ignore-existing /home/ladvien/ladvien.github.io/raw_images/* /home/ladvien/ladvien.github.io/images')


print('')
print("******************************")
print("* Updating Website Images    *")
print("******************************")
os.system('rsync -avzu --ignore-existing /home/ladvien/ladvien.github.io/raw_images/* root@ladvien.com:/usr/share/nginx/html/raw_images')
os.system('rsync -avzu --ignore-existing /home/ladvien/ladvien.github.io/images/* root@ladvien.com:/usr/share/nginx/html/images')

webbrowser.open('file:///home/ladvien/ladvien.github.io/_site/index.html')