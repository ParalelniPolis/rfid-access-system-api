#!/bin/bash

target="$1";

if [ -z "$target" ]; then
	echo "Usage: $0 <target>"
	exit 1;
fi;

project="prase";
baseDir="..";
baseDir="$( cd "$( dirname "$0" )" && pwd )/$baseDir";
scriptsDir="$baseDir/scripts";
appDir="$baseDir/app";
publicDir="$appDir/public";
webDir="/var/www/$project-$target";

# Set the file owner:
chown -R nodejs:nodejs $baseDir;

# Sync web directory:
rsync -avuz --delete $publicDir/ $webDir;

# Set the file owner for the web directory:
chown -R deploy:www-data $webDir;

# SSL files:
# mkdir -p /etc/nginx/ssl/;
# cp -r $baseDir/nginx/ssl/$project-$target /etc/nginx/ssl/;

# Virtual host(s):
# Make sure sites-available directory exists:
mkdir -p /etc/nginx/sites-available/;
# Copy target environment's virtual host(s):
cp $baseDir/nginx/sites-available/$project-$target /etc/nginx/sites-available/;
# Make symbolic link(s):
ln -sf /etc/nginx/sites-available/$project-$target /etc/nginx/sites-enabled/;

# Test nginx configurations.
nginx -t;
if [ $? -eq 0 ]; then
	# Safe to restart nginx:
	service nginx restart;
fi;

# Restart the node app:
$scriptsDir/app.sh restart;
