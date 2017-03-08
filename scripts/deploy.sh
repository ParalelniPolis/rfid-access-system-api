#!/bin/bash

target="$1";

if [ -z "$target" ]; then
	echo "Usage: $0 <target>"
	exit 1;
fi;

originalDir="$PWD";
appDir="../app";
appDir="$( cd "$( dirname "$0" )" && pwd )/$appDir";

echo 'Building static web files...';

# Current working directory must be app directory for grunt to work properly:
cd $appDir;

# Run the build process for static web files.
grunt build || exit 1;

# Return to the original working directory.
cd $originalDir;

echo "Uploading files to '$target'...";

remoteUser="root";

case "$target" in
	prod) remoteHost="prase.paralelnipolis.cz" ;;
esac

sourceDir="..";
sourceDir="$( cd "$( dirname "$0" )" && pwd )/$sourceDir";
destDir="/home/nodejs/prase-$target";

# Make sure the destination directory exist:
ssh $remoteUser@$remoteHost "mkdir -p $destDir";

# Upload files:
rsync -avuz --delete\
		--chmod=Du=rwx,Dg=rwx,Do=rx,Fu=rwx,Fg=rwx,Fo=r\
		--chown=deploy:nodejs\
		--exclude='.git'\
		--exclude='app/node_modules'\
		$sourceDir/\
		$remoteUser@$remoteHost:$destDir/;

# Run post-deployment script:
ssh $remoteUser@$remoteHost "$destDir/scripts/post-deploy.sh $target";
