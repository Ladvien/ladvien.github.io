#!/usr/bin/python3
import os, sys
from datetime import date

print('')
print('*******************************************************')
print('* Moving raw_images into images                       *')
print('*******************************************************')
os.system('rsync -h -v -r -P -t --ignore-existing /home/ladvien/ladvien.github.io/raw_images/* /home/ladvien/ladvien.github.io/images')

print('')
print('*******************************************************')
print('* Optimizing /images                                  *')
print('*******************************************************')
# optimize-images /$HOME/ladvien.github.io/images/.

print('')
print('*******************************************************')
print('* Syncing files to Ladvien.com Jekyll build directory *')
print('*******************************************************')
os.system('bundle exec jekyll build --source /home/ladvien/ladvien.github.io --destination /home/ladvien/ladvien.github.io/_site')

print('')
print('******************************')
print('* Updating Website           *')
print('******************************')
os.system('rsync -h -v -r -P -t /home/ladvien/ladvien.github.io/_site/* root@ladvien.com:/usr/share/nginx/html')

os.system('cd /home/ladvien/ladvien.github.io')
os.system('git add .')
print('')
print('****************************')
print('* Enter the commit message *')
print('****************************')

today = date.today()
print(today)
os.system(f"""git commit -m "Blogging on {today}" """)
os.system('git push')
print('')
print('**************************')
print('* Sending to Ladvien.com *')
print('**************************')
