const spawn = require('child_process').spawn;
module.exports = (script, priority) => {
    if(typeof priority !== 'undefined') {
        priority = 4;
    }
    /**
     * anything 5 or adove must be attached, otherwise it's detached
     */
    var spawner = null;
    var should_exit = false;
    if(priority >= 5) {
        spawner = spawn('node', [path.join(__dirname, '../', 'bin/', 'worker.js'), script], {
            detached: false
        })
    }
    else {
        spawn('node', [path.join(__dirname, '../', 'bin/', 'worker.js'), script], {
            detached: true,
            stdio: 'ignore'
        }).unref()
    }
    if(spawner !== null) {
        var response = null;
        spawner.on('exit', (code, signal) => {
            should_exit = true;
            require('../logger')(
                'worker for ' + script + ' detached and exited with code ' + code + ' and signal ' + signal
            )
        })
        spawner.stdout.on('data', (data) => {
            response = data.toString()
        })
    }
    if(should_exit) {
        return response
    }
}