const controller = require('../core/controller')

module.exports = class example extends controller {
    httpTest(req, res) {
        console.log(this.db)
        var self = this
        this.db.query(
            'SELECT * FROM test',
            {
                type: self.db.QueryTypes.SELECT
            }
        ).then(results => {
            var str = "";
            results.forEach((result) => {
                str += 'id: ' + result.id + ', name: ' + result.name + '\n'
            })
            res.send(str)
        })
    }
    defineRoutes() {
        this.http.get('/api/v1/test', this.httpTest.bind(this))
    }
}