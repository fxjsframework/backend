const response_cls = require('./response')
const spawn_worker = require('./spawn_worker_func')
const response = new response_cls()

module.exports = class controller {
    constructor(http_app, config, db, logger) {
        this.config = config
        this.http = http_app
        this.db = db
        this.logger = logger
        this.response = response
        this.spawn_worker = spawn_worker
    }
    defineRoutes() {
        /**
         * Override me!
         * 
         * @example
         * this.http.get('/ENDPOINT_URL', this.methodNameForRoute)
         */
    }
}