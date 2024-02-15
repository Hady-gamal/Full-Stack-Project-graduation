const controllers=require('../controllers/controllers');
const express=require('express');
const verifyToken = require('../middleware/verifytoken');

const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file);
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext =file.mimetype.split('/')[1]
      const uniqueSuffix = `user-${Date.now()}.${ext}` ;
      cb(null,uniqueSuffix)
    }
  })
  function fileFilter (req, file, cb) {
    const imageType=file.mimetype.split('/')[0];
    if (imageType==='image') {
       return cb(null, true)
    }else{
        cb(new Error('I don\'t have a clue!'))
    }
    // To reject this file pass `false`, like so:
}
        

  
const upload=multer({storage:storage,fileFilter:fileFilter})

const router =express.Router()

router.route('/')
    .get(verifyToken,controllers.getStadiums)
    .post(upload.single('avatar'), controllers.postStadium)
router.route('/:stadiumId')
    .delete(controllers.deleteStadium)
    .get(controllers.getStadium)
    .patch(controllers.updateStadium)
    

module.exports=router;