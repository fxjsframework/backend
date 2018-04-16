/**
 * Cronie: Cron-like worker server
 */
const fs        = require('fs');
const path      = require('path');
var has_run     = [];
var tasks       = [];
var tasks_path  = path.join(__dirname, '/tasks/');

require('../logger')('Cronie bootstrap has started')
fs.readdirSync(tasks_path).forEach((file) => {
    let qualified_path = path.join(
        tasks_path,
        '/',
        file
    )
    let tmp = require(qualified_path)
    let logger = require('../logger')
    let temp_controller_obj = new tmp(logger);
    let simplified_name = file.replace('.js', '')
    tasks.push({
        controller_obj: temp_controller_obj,
        file: qualified_path,
        simplified_name: simplified_name
    })
})
require('../logger')('Cronie bootstrap has completed')
setInterval(() => {
    tasks.forEach((task) => {
        var time = task.controller_obj.time;
        if(time === 'daily' && has_run.indexOf(task.simplified_name) == -1) {
            require('../logger')('Cronie is running ' + task.simplified_name)
            task.controller_obj.task()
            has_run.push(task.simplified_name)
        }
    })
}, 5000)