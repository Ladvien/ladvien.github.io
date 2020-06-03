#!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']


print('')
print('*******************************************************')
print('* Syncing files to Ladvien.com Jekyll build directory *')
print('*******************************************************')
os.system(f'bundle exec jekyll build --source {root_path}/ladvien.github.io --destination {root_path}/ladvien.github.io/_site')


print('')
print('*******************************************************')
print('* Adding raw_images to Ladvien.com/raw_images *')
print('*******************************************************')
os.system(f'python3 admin_optimize_images.py')
os.system(f'python3 admin_update_images.py')

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
os.system(f'rsync -h -v -r -t --delete {root_path}/ladvien.github.io/_site/* root@ladvien.com:/usr/share/nginx/html')

os.system(f'cd {root_path}/ladvien.github.io')
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
