const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles){
            return res.sendStatus(401)
        }
        const rolesArrray = [...allowedRoles]

        const result = req.roles.map(role => rolesArrray.includes(role)).find(val => val === true)

        if(!result){
            return res.sendStatus(401)
        }
        next()
    }
}

module.exports = verifyRoles