#!/bin/bash
export NODE_ENV=production
export NODE_EXEC_MODE="CLUSTER,PM2"
APP_NAME=$1
if [ "$APP_NAME" == "" ]; then
	APP_NAME="fxjsprodapp"
fi
./node_modules/.bin/pm2 start bin/server.js --name="${APP_NAME}"
