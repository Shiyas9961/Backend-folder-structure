const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')

const handleLogin = async (req, res) => {
    const { username, password } = req.body

    //Checking the user send username & password 
    if(!username || !password){
        return res.status(400).json({message : 'Username and Password Required'})
    }

    //Get user from DB based on username
    const foundUser = await User.findOne({username}).exec()

    if(!foundUser){
        return res.status(409).json({message : 'User did not exist'})
    }

    //Checking entered passord is currect through compare
    const checkPassword = await bcrypt.compare(password, foundUser.password)

    if(checkPassword){
        const roles = Object.values(foundUser.roles)
        //JWT token
        const accessToken = jwt.sign(
            {"userInfo" : {
                "username" : foundUser.username,
                "roles" : roles
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '5m' }
            )
        const refreshToken = jwt.sign(
            {"username" : foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn : '1d' }
        )


        //Store the found user into the DB
        await foundUser.updateOne({refreshToken : refreshToken})
    
        res.cookie('jwt', refreshToken, {httpOnly : true, sameSite : 'None', maxAge : 24 * 24 * 60 * 1000})

        res.status(201).json({"accessToken" : accessToken })
    }else{
        
        res.status(400).json({message : 'Incurrect Password'})
    }
}


module.exports = {
    handleLogin
}