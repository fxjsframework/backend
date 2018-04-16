#!/bin/bash
export NODE_ENV=production
export NODE_EXEC_MODE="CLUSTER,PM2"
APP_NAME=$1
STATIC_APP_NAME=$2
if [ "$APP_NAME" == "" ]; then
	APP_NAME="fxjsprodapp"
fi
if [ "$STATIC_APP_NAME" == "" ]; then
	STATIC_APP_NAME="fxjsprodapp-static"	
fi
./node_modules/.bin/pm2 start bin/server.js --name="${APP_NAME}"
./node_modules/.bin/pm2 start bin/static-server.js --name="${STATIC_APP_NAME}
