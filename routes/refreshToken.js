const { handleRefreshToken } = require('../controllers/refreshController')
const router = require('express').Router()

router.route('/').get(handleRefreshToken)

module.exports = router