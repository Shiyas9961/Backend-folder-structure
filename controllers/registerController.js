const bcrypt = require('bcrypt')
const User = require('../model/User')

const handleNewUser = async (req, res) => {
    const { username, password } = req.body

    //Checking the user enter username and password
    if(!username || !password){
        return res.status(400).json({message : 'Username and Password Required'})
    }

    //Checking the duplicate exist
    const duplicate = await User.findOne({username}).exec()

    if(duplicate){
        return res.status(409).json({message : 'Duplicate Username'})
    }
    try{
        //Hashing Password
        const hashPwd = await bcrypt.hash(password,10)

        //Create and Store new User
        await User.create({
            username,
            password : hashPwd
        })
        res.status(201).json({message : `User ${username} successfully created`})
    }catch(err){
        res.status(400).json({message : 'Inavlid register'})
    }
}

module.exports = {
    handleNewUser
}