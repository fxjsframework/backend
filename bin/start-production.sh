#!/bin/bash
export NODE_ENV=production
export NODE_EXEC_MODE="CLUSTER,PM2"
APP_NAME=$1
STATIC_APP_NAME=$2
CRONIE_APP_NAME="cronie-worker-server"
EMAILIE_APP_NAME="emailie-worker-server"
if [ "$APP_NAME" == "" ]; then
	APP_NAME="api-server"
fi
if [ "$STATIC_APP_NAME" == "" ]; then
	STATIC_APP_NAME="static-server"	
fi
./node_modules/.bin/pm2 start bin/server.js --name="${APP_NAME}"
./node_modules/.bin/pm2 start bin/static-server.js --name="${STATIC_APP_NAME}"
./node_modules/.bin/pm2 start cronie/index.js --name="${CRONIE_APP_NAME}"
./node_modules/.bin/pm2 start emailie/index.js --name="${EMAILIE_APP_NAME}"