const User = require('../model/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find().exec()

        if(!users?.length){
            return res.status(404).json({message : "No Users found"})
        }

        res.status(201).json(users)
    }catch(err){
        res.status(400).json({message : err.message})
    }
}

const updateUser = async (req, res) => {
    const { id, username, password } = req.body
    try{
        if(!id){
            return res.status(400).json({message : "ID is required"})
        }
        const foundUser = await User.findOne({_id : id}).exec()

        if(!foundUser){
            return res.status(404).json({message : "User did'nt exist"})
        }
        if(username){
            foundUser.username = username
        }

        if(password){
            const hashPwd = await bcrypt.hash(password, 10)
            foundUser.password = hashPwd
        }
        const result = await foundUser.save()

        res.status(201).json({ message : `User ${result.username} Updated successfully` })
    }catch(err){
        res.status(400).json({message : err.message})
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.body

    try{
        if(!id){
            return res.status(400).json({ message : "ID is required" })
        }
        const foundUser = await User.findOne({_id : id}).exec()

        if(!foundUser){
            return res.status(404).json({message : "User did'nt exist"})
        }
        await foundUser.deleteOne()

        res.status(400).json({message : `User ${foundUser.username} deleted`})
    }catch(err){
        res.status(400).json({ message : err.message })
    }
}

const getUser = async (req, res) => {
    const { id } = req.params

    try{
        if(!id){
            return res.status(400).json({message : "You should send ID through params"})
        }

        const user = await User.findOne({_id : id})
        if(!user){
            return res.status(400).json({message : "User did'nt exist"})
        }
        res.status(200).json(user)
    }catch(err){
        res.status(400).json({message : err.message})
    }
}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
}