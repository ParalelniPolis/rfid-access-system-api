#!/bin/bash

appDir="../app";
appDir="$( cd "$( dirname "$0" )" && pwd )/$appDir";
configFile="$appDir/processes.json";

start()
{
	if [ "$(whoami)" = "root" ]; then
		su -l -c "source ~/.nvm/nvm.sh; cd $appDir && npm install --production && npm prune --production && pm2 start $configFile" nodejs;
	else
		cd $appDir && npm install --production && npm prune --production && pm2 start $configFile;
	fi;
}

stop()
{
	if [ "$(whoami)" = "root" ]; then
		su -l -c "source ~/.nvm/nvm.sh; cd $appDir && pm2 stop --watch 0 $configFile" nodejs;
	else
		cd $appDir && pm2 stop --watch 0 $configFile;
	fi;
}

case "$1" in

	start)
		start
		;;

	stop)
		stop
		;;

	restart)
		stop
		start
		;;

	*)
		echo $"Usage: $0 {start|stop|restart}"
		exit 1

esac

exit 0;
