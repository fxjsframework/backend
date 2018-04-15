/**
 * Import Required Libraries
 */
const compress  = require('compression')
const express   = require('express')
const path      = require('path')
const cluster   = require('cluster')

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
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000
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