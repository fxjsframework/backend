#!/usr/bin/env node
const path = require('path')
let argv = process.argv

if(argv.length < 3) {
    require('../logger')(
        `Invalid number of arguments supplied to worker file; expects 3, got ${argv.length}`
    )
    process.exit(-1)
}

let file = argv[2]
let desired_path = path.join(__dirname, '../', 'workers/', file + '.js')
let desired_data_file = path.join(__dirname, '../', 'worker-data/', file + '.js')

let cls_file = require(desired_path)
let cls = new cls_file(
    require(
        desired_data_file
    )
)
require('../logger')(
    `${file}: ` + cls.run() // log worker results
)