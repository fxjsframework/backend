const winston = require('winston')
const winston_rotator = require('winston-daily-rotate-file')

const create_logger = new winston.Logger({
    'transports': [
        new winston.transports.Console({
            'colorize': true
        })
    ]
})
const success_logger = create_logger;
success_logger.add(winston_rotator, {
    'name': 'access-file',
    'level': 'info',
    'filename': './logs/access-%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD-',
    'prepend': true
})
const error_logger = create_logger;
error_logger.add(winston_rotator, {
    'name': 'error-file',
    'level': 'error',
    'filename': './logs/error-%DATE%.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD-',
    'prepend': true
})
module.exports = (message, type = 'notice') => {
    let _log = console.log
    let _error = console.error
    console_error = function(...args) {
        _error.apply(
            [
                console,
                '\x1b[31m',
                'Fx.js @ ' + new Date().toISOString() + ': '
            ].concat(arguments).concat('\x1b[0m')
        )
    }
    console_log = function(...args) {
        _log.apply(
            [
                console,
                '\x1b[31m',
                'Fx.js @ ' + new Date().toISOString() + ': '
            ].concat(arguments).concat('\x1b[0m')
        )
    }
    if(type === 'error') {
        error_logger.error(message)
    }
    else {
        success_logger.info(message)
    }
}