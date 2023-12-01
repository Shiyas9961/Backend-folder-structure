const jwt = require('jsonwebtoken')
const User = require('../model/User')

const handleRefreshToken = async (req, res) => {

    //Taking cookie
    const cookie = req.cookies

    if(!cookie?.jwt){
        return res.sendStatus(401)
    }

    //Taking the refresh token from cookies
    const refreshToken = cookie.jwt

    //Find user by refresh token
    const foundUser = await User.findOne({refreshToken})

    if(!foundUser){
        return res.sendStatus(403)
    }

    //Verifying DB refresh
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decode) => {
        
        if(err || foundUser.username !== decode.username){
            return res.status(403).json(err)
        }

        const roles = Object.values(foundUser.roles)

        //Creating new Access token with refresh token
        const accessToken = jwt.sign(
            {
                "userInfo" : {
                    "username" : decode.username,
                    "roles" : roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '5m' }
        )
        res.json({"accessToken" : accessToken})
        }
    )
}

module.exports = {
    handleRefreshToken
}