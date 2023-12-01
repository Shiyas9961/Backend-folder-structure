const { format } = require('date-fns')
const { v4 : uuid } = require('uuid')
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

const logEnvents = async (message, fileName) => {
    const dateItem = format( new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateItem}\t${uuid()}\t${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromise.mkdir(path.join(__dirname,'..','logs'))
        }
        await fsPromise.appendFile(path.join(__dirname,'..','logs',fileName),logItem)
    }catch(err){
        console.log(err)
    }
}

const logger = (req, res, next) => {
    const message = `${req.method}\t${req.headers.origin}\t${req.path}`
    logEnvents(message,'reqLog.log')
    next()
}

module.exports = {
    logEnvents,
    logger
}