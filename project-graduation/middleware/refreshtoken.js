const jwt =require('jsonwebtoken')
const refreshToken =async (req,res,next)=>{
    const authHeader=req.headers['Authorization']||req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({
            message:"invalid token and is required"
        })    
    }
    const token=authHeader.split(' ')[1];
    // console.log(token)
    try {
        
         jwt.verify(token,process.env.JWT_SECRET_KEY_refresh_token)
        next();
    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
    }


}
module.exports=refreshToken;