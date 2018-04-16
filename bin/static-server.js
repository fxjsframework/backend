/**
 * Import Required Libraries
 */
const compress  = require('compression')
const minhtml   = require('express-minify-html')
const express   = require('express')
const path      = require('path')
const cluster   = require('cluster')

/**
 * Bootstrap Application and Configuration
 */
const http_app   = express()
const config     = require(path.join(__dirname, '../', 'config/', 'application.config.json'))

/**
 * Bootstrap Functions
 */
function isProduction() {
    return config.environment === "PRODUCTION"
}

/**
 * Bootstrap Request Object
 */
if(isProduction()) {
    http_app.use(compress())
    http_app.use(minhtml({
        override: true,
        exception_url: false,
        htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true
        }
    }))
    http_app.set('view cache', true)
}

http_app.use(
    express.static(
        path.join(__dirname, '../', 'static')
    )
)

/**
 * Bootstrap our backend application
 */
if(cluster.isMaster && isProduction()) {
    var numCPUs = require('os').cpus().length
    for(var i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('online', function (worker) {
        require('../logger')('Static-server worker ' + worker.process.pid + ' is online')
    })
    cluster.on('exit', function (worker, code, signal) {
        require('../logger')(
            'Static-server worker ' + worker.process.pid + ' died with exit code ' + code + ', and signal ' + signal
        )
        require('../logger')(
            'Starting a new static-server worker'
        )
        cluster.fork()
    })
}
else {
    /**
     * Start Express
     */
    http_app.listen(8222, () => {
        require('../logger')(
            'Static Server: Process ' + process.pid + ' is listening for incoming requests'
        )
    })
}