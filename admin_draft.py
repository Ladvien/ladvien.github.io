# #!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']

print('')
print('*******************************************************')
print('* Adding raw_images to Ladvien.com/raw_images *')
print('*******************************************************')
os.system('python3 admin_optimize_images.py')
os.system(f'rsync -h -r -t -u {root_path}/ladvien.github.io/_site/assets/ root@ladvien.com:/usr/share/nginx/html/assets/')
os.system(f'rsync -h -r -t -u {root_path}/ladvien.github.io/_site/images/ root@ladvien.com:/usr/share/nginx/html/images/')

print('')
print('*******************************************************')
print('* Syncing files to Ladvien.com Jekyll build directory *')
print('*******************************************************')
os.system(f'bundle exec jekyll build --source {root_path}/ladvien.github.io --destination {root_path}/ladvien.github.io/_site')

os.system(f'/usr/bin/open -a "/Applications/Google Chrome.app" "{root_path}/ladvien.github.io/_site/index.html" --args --incognito')