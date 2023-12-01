const { logEnvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEnvents(`${err.name}\t${err.message}`,'errLog.log')
    console.log(`${err.name}`)
    res.status(500).send(err.message)
}

module.exports = errorHandler