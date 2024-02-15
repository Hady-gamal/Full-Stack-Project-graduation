
const Stadium=require('../models/stadium')
const jwt=require('jsonwebtoken')

const getStadiums=async(req,res)=>{
    const stadiums=await Stadium.find();
    const refreshToken= await jwt.sign({},process.env.JWT_SECRET_KEY,{expiresIn:'1y'})
    console.log(refreshToken);
    res.json({
        // status:"stadiums",
        data:{
            stadiums:stadiums,
            refreshToken
        }
    });
}
const getStadium=async (req,res,next)=>{
    const stadium =await Stadium.findById(req.params.stadiumId)
    if(!stadium)
    {
        const error=new Error();
        error.message='not found stadium';
        error.statusCode=404;
        return next(error);
    }
    return res.json({
        status:"Done",
        data:stadium
    });
}
const postStadium=async(req,res,next)=>{
    const {name,price,description,avatar}=req.body
    // if(!avatar){
        //     const error=new Error();
        //     error.message='not found image';
        //     error.statusCode=404;
        //     return next(error);
        // }
        // try {
        //      const imageType=req.file.mimetype.split('/')[0];
        // if (imageType==='image') {
           
        // }else{
        //     const error=new Error();
        //         error.message='not found image';
        //         error.statusCode=404;
        //         return next(error);        }
        // console.log("image ",imageType);
        // } catch (error) {
        //     // const error=new Error();
        //     error.message='not found image 2';
        //     error.statusCode=404;
        //     return next(error);     
        // }
       
        const stadium=new Stadium({
            name,
            price,
            description,
            avatar:req.file.filename
        });
    console.log("add",req.file)
    await stadium.save();

    res.status(201).json({
        status:"success",
        data:stadium
    })
}

const deleteStadium=async(req,res)=>{
    console.log(req.params.Stadium);
    await Stadium.deleteOne({_id:req.params.stadiumId})
    res.json({
        message:"this staduim is deleted",
        data:null
    })

}
const updateStadium=async(req,res)=>{
    const stadium =await Stadium.findByIdAndUpdate(req.params.stadiumId,{$set:{...req.body}})

    try {
        if(!stadium)
        {
            return res.status(404).json({msg:"NOT FOUND THIS ID "});
        }
        res.status(200).json(
          {  updatedcourse:stadium,
            msg: "course updated "
            }
            );
    } catch (error) {
        return res.status(400).json({
            status:"ERROR",
            message:error.message
        })
    }
}
module.exports={
    getStadiums,
    deleteStadium,
    postStadium,
    getStadium,
    updateStadium
};