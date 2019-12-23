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
print('*******************************************************')
print('* Optimizing /images                                  *')
print('*******************************************************')
# optimize-images /$HOME/ladvien.github.io/images/.

print('')
print('*******************************************************')
print('* Syncing files to Ladvien.com Jekyll build directory *')
print('*******************************************************')
os.system(f'bundle exec jekyll build --source {root_path}/ladvien.github.io --destination {root_path}/ladvien.github.io/_site')

print('')
print('******************************')
print('* Updating Website           *')
print('******************************')
os.system(f'rsync -h -v -r -P -t {root_path}/ladvien.github.io/_site/* root@ladvien.com:/usr/share/nginx/html')

os.system('cd {root_path}/ladvien.github.io')
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
