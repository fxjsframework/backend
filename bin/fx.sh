#!/bin/bash
##############################
# A simple command-line tool #
##############################

function help {
    echo "\"${0}\": "
    echo " new PROJECT_NAME -> Creates a new fx project with the name selected in the current directory (makes sub-folder)"
    echo " new-worker -> Creates a new worker file from template"
    echo " new-gateway -> Creates a gateway configuration file "
    echo ""
    echo "Example: "
    echo "${0} new fx-example-app"
    echo ""
    exit 1
}

if [ $# -lt 2 ]; then
    help
    exit 1
fi

ACTION=$1

if [ "$ACTION" == "new" ]; then
    FOLDER=$2
    if [ "$FOLDER" == "" ]; then
        help
        exit 1
    fi
    git clone https://github.com/fxjsframework/backend.git $FOLDER
    cd $FOLDER
    npm install
fi

if [ "$ACTION" == "new-gateway" ]; then
    echo "#!/bin/bash" > bin/gateway-$2.sh
    echo "" >> bin/gateway-$2.sh
    echo "export NODE_ENV=\"PRODUCTION\" node bin/static-server.js" >> bin/gateway-$2.sh
fi

if [ "$ACTION" == "new-worker" ]; then
    echo "module.exports = data => {" > workers/${2}.js
    echo "// TODO: Replace me with some logic" >> workers/${2}.js
    echo "}" >> workers/${2}.js
fi