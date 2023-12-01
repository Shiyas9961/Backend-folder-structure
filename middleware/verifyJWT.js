const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {

    //Take Auth Header
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(403)
    }
    //console.log(authHeader) Bearer token

    //Seperate token from header
    const token = authHeader.split(" ")[1]

    //Verifying access Token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decode) => {
            if(err){
                return res.sendStatus(403) //invalid Token
            }
            req.username = decode.userInfo.username
            req.roles = decode.userInfo.roles
            next()
        }
    )
}

module.exports = verifyJWT