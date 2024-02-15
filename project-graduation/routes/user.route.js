const verifyToken=require('../middleware/verifytoken')
// const refreshtoken=require('../middleware/refreshtoken')
const express=require('express');
const router =express.Router()
const userController=require('../controllers/userController');
// const refreshToken = require('../middleware/refreshtoken');
router.route('/')
    .get(verifyToken,userController.getAllUsers)
router.route('/logout')
    .post(userController.logOut);
router.route('/register')
    .post(userController.register)
router.route('/login')
    .post(userController.login)
 router.route('/:userId')
 .delete(verifyToken,userController.deleteUser)
 .patch(verifyToken,userController.updateUser)
 .get(userController.getUser)
 router.route('/getUserByEmail/:email')
 .get(userController.get_user_by_email)
// router.route('/refresh')
    // .post(refreshToken)
module.exports=router;