const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')

router.route('/').get(userController.getAllUsers)
    .put(verifyRoles(ROLES_LIST.Admin), userController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser)

router.route('/:id').get(verifyRoles(ROLES_LIST.Admin), userController.getUser)    

module.exports = router