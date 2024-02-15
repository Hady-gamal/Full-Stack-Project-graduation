// const verifyToken=require('../middleware/verifytoken')
// const refreshtoken=require('../middleware/refreshtoken')
const express=require('express');
const router =express.Router()
const timeController=require('../controllers/timeController');
// const refreshToken = require('../middleware/refreshtoken');
router.route('/available-hours/:stadiumId')
    .get(timeController.getAllHours)
router.route('/make-reservation')
    .post(timeController.reserve);
// 
// router.route('/refresh')
    // .post(refreshToken)
module.exports=router;