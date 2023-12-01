const allowedOrigin = require('../config/allowedOrigin')

const credentails = (req, res, next) => {
    const origin = req.headers.origin
    if(allowedOrigin.includes(origin)){
        res.headers('Access-Control-Allow-Credentials',true)
    }
    next()
}

module.exports = credentails