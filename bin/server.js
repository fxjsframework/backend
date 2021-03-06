/**
 * Import Required Libraries
 */
const compress  = require('compression')
const express   = require('express')
const path      = require('path')
const cluster   = require('cluster')
const uuid      = require('node-uuid')

/**
 * Bootstrap Application and Configuration
 */
const http_app   = express()
const config     = require(path.join(__dirname, '../', 'config/', 'application.config.json'))
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.hostname,
    dialect: config.database.dialect,
    pool: {
        max: config.database.pool.max,
        min: config.database.pool.min,
        acquire: config.database.pool.acquire,
        idle: config.database.pool.idle
    },
    operatorsAliases: config.database.operatorsAliases
})

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
}
http_app.use(function(request, response, next) {
    request.uuid = uuid.v4()
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || ( request.connection.socket ? request.connection.socket.remoteAddress : null);
    require('../logger')(
        `${request.uuid} Request: ${request.originalUrl}`
    )
    require('../logger')(
        `${request.uuid} Originating Address: ${ip}`
    )
})

/**
 * Bootstrap our backend application
 */
const app        = require(path.join(__dirname, '../', 'app.js'))

if(cluster.isMaster && isProduction()) {
    var numCPUs = require('os').cpus().length
    for(var i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('online', function (worker) {
        require('../logger')('Worker ' + worker.process.pid + ' is online')
    })
    cluster.on('exit', function (worker, code, signal) {
        require('../logger')(
            'Worker ' + worker.process.pid + ' died with exit code ' + code + ', and signal ' + signal
        )
        require('../logger')(
            'Starting a new worker'
        )
        cluster.fork()
    })
}
else {
    /**
     * Create Application
     */
    let application = new app(
        http_app, /** express */
        config, /** configuration file */
        sequelize, /** database engine  */
        require('../logger'),
    )

    /**
     * Start Express
     */
    http_app.listen(8000, () => {
        require('../logger')(
            'Process ' + process.pid + ' is listening for incoming requests'
        )
    })
}