#!/bin/bash
echo '$1 = ' $USER
echo '$2 = ' $USER_PASSWORD
echo '$3 = ' $FLASK_APP_NAME
echo '$4 = ' $FLASK_PORT

# Setup user
adduser "$USER"
echo "$USER_PASSWORD" | passwd --stdin "$USER"
echo "$USER ALL=(ALL:ALL) ALL" | sudo EDITOR='tee -a' visudo


# Add Miniconda to PATH
echo "export PATH='/usr/local/miniconda/bin:$PATH'" &>> /home/"$USER"/.bashrc
echo "export PATH='/usr/local/miniconda/bin:$PATH'" &>> /root/.bashrc

# Add Flask variables to PATH
echo "# Flask variables" &>> /home/"$USER"/.bashrc
echo "export FLASK_APP='$FLASK_APP_NAME'.py" &>> /home/"$USER"/.bashrc

source /home/"$USER"/.bashrc


# Update system
yum update -y


# Start installing needed packages
yum -y install epel-release
yum install -y wget bzip2 nginx flask supervisor python-pip python-virtualenv


# Install HTOP
wget dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-7-11.noarch.rpm
rpm -ihv epel-release-7-11.noarch.rpm 
yum install -y htop


# Setup Flask App
mkdir /usr/share/nginx/flask_app
mkdir /usr/share/nginx/flask_app/data
mkdir /usr/share/nginx/flask_app/models
echo 'from flask import Flask
application = Flask(__name__)

@application.route("/")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"

if __name__ == "__main__":
    application.run(host="0.0.0.0")' >> /usr/share/nginx/flask_app/"$FLASK_APP_NAME".py


# Allow HTTP and HTTPS traffic through firewall
sudo firewall-cmd --permanent --zone=public --add-service=http 
sudo firewall-cmd --permanent --zone=public --add-service=https


# Open ports
sudo firewall-cmd --zone=public --add-port="$FLASK_PORT"/tcp --permanent
sudo firewall-cmd --reload

sudo chown -R "$USER"  /usr/share/nginx/*

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx


# Setup uWSGI
yum install -y gcc pcre-devel
echo 'from '$FLASK_APP_NAME' import application

if __name__ == "__main__":
    application.run()' >> /usr/share/nginx/flask_app/wsgi.py

echo '[uwsgi]
module = wsgi

master = true
http-socket = :'$FLASK_PORT'
vacuum = true

die-on-term = true' >> /usr/share/nginx/flask_app/"$FLASK_APP_NAME".ini

# Create uWSGI service
echo '[Unit]
Description=uWSGI instance to serve '$FLASK_APP_NAME'
After=network.target

[Service]
User='$USER'
Group=nginx
WorkingDirectory=/usr/share/nginx/flask_app
ExecStart=/usr/local/miniconda/bin/uwsgi --ini /usr/share/nginx/flask_app/'$FLASK_APP_NAME'.ini

[Install]
WantedBy=multi-user.target
' >> /etc/systemd/system/"$FLASK_APP_NAME".service


# Add uWSGI location to Nginx
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf_backup
echo '
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
	listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
                include uwsgi_params;
                uwsgi_pass 127.0.0.1:8000;
        }

    	error_page 404 /404.html;
            location = /40x.html {
        }

	    error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}' >> /etc/nginx/nginx.conf


# Create convenience link 
ln -s /usr/share/nginx/flask_app/ /home/"$USER"/flask_app


# Install Miniconda
cd ~
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
chmod +x Miniconda3-latest-Linux-x86_64.sh
./Miniconda3-latest-Linux-x86_64.sh -b -p /usr/local/miniconda


# Setup Deep Learning environment
conda install -y -vv python=3.6.8
conda install -y -vv tensorflow scikit-learn keras pandas 
conda install -y -c anaconda flask
conda install -y -c conda-forge uwsgi

# Start uWSGI Service
sudo systemctl start "$FLASK_APP_NAME"
sudo systemctl enable "$FLASK_APP_NAME"


# Install MongoDB
echo "[mongodb-org-4.0]" >> /etc/yum.repos.d/mongodb-org-4.0.repo
echo "name=MongoDB Repository" >> /etc/yum.repos.d/mongodb-org-4.0.repo
echo "baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/4.0/x86_64/" >> /etc/yum.repos.d/mongodb-org-4.0.repo
echo "gpgcheck=1" >> /etc/yum.repos.d/mongodb-org-4.0.repo
echo "enabled=1" >> /etc/yum.repos.d/mongodb-org-4.0.repo
echo "gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc" >> /etc/yum.repos.d/mongodb-org-4.0.repo
yum install -y mongodb-org
systemctl enable mongod.service
systemctl start mongod.service

# Install Pymongo
conda install -y -c anaconda pymongo 

# Enable Remote Editing from VSCode
yum install -y ruby
gem install rmate