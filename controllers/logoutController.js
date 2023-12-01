const User = require('../model/User')

const handleLogout = async (req, res) => {
    const cookie = req.cookies


    if(!cookie?.jwt) {
        return res.sendStatus(204)
    }

    const refreshToken = cookie.jwt
    const foundUser = await User.findOne({refreshToken})

    if(!foundUser){
        res.clearCookie('jwt',{httpOnly : true,sameSite : 'None', secure : true, maxAge : 24 * 24 * 60 * 1000 })
        return res.sendStatus(204)
    }

    await foundUser.updateOne({refreshToken : ""})

    res.clearCookie('jwt',{httpOnly : true, sameSite : 'None', secure : true, maxAge : 24 * 24 * 60 * 1000})
    res.sendStatus(204)
}

module.exports = {
    handleLogout
}