module.exports=(...roles)=>{
    console.log(roles);
    return(req,res,next)=>{
        if(!roles.includes(req.currentUser.role)){
            return next(res.json({
                message:"not authorized",status:401
            }))
        }
        next()
    }
}