/**
 * Include fs library for looping controllers
 */
const fs = require("fs")
/**
 * Include path library for building fully qualified paths
 */
const path = require("path")
/**
 * App Class
 */
module.exports = class app {
    constructor(http_app, config, db, logger) {
        this.http_app = http_app;
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.controllers = [];
        this.controller_path = path.join(
            __dirname,
            '/controllers/',
        )
        this.bootstrap()
        this.defineControllersAndRoutes()
    }
    bootstrap() {
        fs.readdirSync(this.controller_path).forEach((file) => {
            let qualified_path = path.join(
                this.controller_path,
                '/',
                file
            )
            let tmp = require(qualified_path)
            let logger = require('./logger')
            let temp_controller_obj = new tmp(this.http_app, this.config, this.db, logger);
            let simplified_name = file.replace('.js', '')
            this.controllers.push({
                controller_obj: temp_controller_obj,
                file: qualified_path,
                simplified_name: simplified_name
            })
            // controllers are responsible for loading their OWN models, as necessary
        })
        require('./logger')('Bootstrap has started')
    }
    defineControllersAndRoutes() {
        let controllers = this.controllers;
        controllers.forEach((controller) => {
            require('./logger')(`Loaded controller and defined routes for: ${controller.simplified_name}`)
            controller.controller_obj.defineRoutes()
        })
    }
}