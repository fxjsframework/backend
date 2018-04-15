module.exports = class controller {
    constructor(http_app, config, db, logger) {
        this.config = config
        this.http = http_app
        this.db = db
        this.logger = logger
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