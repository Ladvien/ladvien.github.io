# #!/usr/bin/python3
import os, sys
from datetime import date

root_path = os.environ['HOME']

print('')
print('*******************************************************')
print('* Adding raw_images to Ladvien.com/raw_images *')
print('*******************************************************')
os.system('python3 admin_optimize_images.py')

print('')
print('*******************************************************')
print('* Syncing files to Ladvien.com Jekyll build directory *')
print('*******************************************************')
if not os.path.exists(f"{root_path}/ladvien.github.io/_site"):
    os.mkdir(f"{root_path}/ladvien.github.io/_site")

if not os.path.exists(f"{root_path}/ladvien.github.io/_site/assets/"):
    os.mkdir(f"{root_path}/ladvien.github.io/_site/assets/")

if not os.path.exists(f"{root_path}/ladvien.github.io/_site/images/"):
    os.mkdir(f"{root_path}/ladvien.github.io/_site/images/")


os.system(f'bundle exec jekyll build --future --source {root_path}/ladvien.github.io --destination {root_path}/ladvien.github.io/_site')

# Move the prepared images to the server.
os.system(f'rsync -h -r -t -u {root_path}/ladvien.github.io/_site/assets/ root@ladvien.com:/usr/share/nginx/html/assets/')
os.system(f'rsync -h -r -t -u {root_path}/ladvien.github.io/_site/images/ root@ladvien.com:/usr/share/nginx/html/images/')

if sys.platform == 'darwin':
    os.system(f'/usr/bin/open -a "/Applications/Google Chrome.app" "{root_path}/ladvien.github.io/_site/index.html" --args --incognito')
else:
    os.system(f'/usr/bin/google-chrome  "{root_path}/ladvien.github.io/_site/index.html" --args --incognito')