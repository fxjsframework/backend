module.exports = class response {
    constructor() {
        this.html = ''
        this.json = ''
        this.type = 'JSON'
        this.kvps = []
    }
    /**
     * Set data in the kvps OR html objects on this local class
     * @param {string|array|object} key The key or data set to apply
     * @param {string|array|object} value The value of the key to apply
     */
    setData( key, value ) {
        if(this.type === 'JSON') {
            if( typeof value !== 'undefined' ) {
                this.kvps[key] = value
            } else {
                this.kvps = key
            }
        }
        else {
            this.html = key
        }
    }
    /**
     * Returns either KVPs or HTML
     */
    getData() {
        if(this.type === 'JSON') {
            return JSON.stringify(this.kvps)
        } else {
            return this.html
        }
    }
    /**
     * Sets a return type
     * @param {string} type JSON|html
     */
    setType(type = 'JSON') {
        this.type = type
    }
    /**
     * Render the data to th ebrowser
     * @param {Express.Response} res Express Response Object
     */
    render( res ) {
        if(this.type === 'JSON') {
            res.setHeader('Content-Type', 'json')
        }
        res.send( this.getData() )
    }
}