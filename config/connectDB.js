const mongoose = require('mongoose')

const connentDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI)
    }catch(err){
        console.log(err.message)
    }
}

module.exports = connentDB