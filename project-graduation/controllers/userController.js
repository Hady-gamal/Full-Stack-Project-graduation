const User=require('../models/user.model.js')
const generateJwt = require('../utilz/generate.jwt.js')
const httpStatusText=require('../utilz/httpStatusText')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const multer=require('multer')
const upload=multer({dest:'updloads/'})
// const {refreshToken}=require('../middleware/refreshtoken.js')
const getAllUsers=async(req,res)=>{
    const query=req.query;
    const limit=query.limit||100;
    const page=query.page||1;
    const token= await jwt.sign({},process.env.JWT_SECRET_KEY,{expiresIn:'1y'})

    const users=await User.find({},{"__v":false,"_id":true,password:false}).limit(limit).skip((page-1)*limit);
    res.json({
        status:httpStatusText.SUCCESS,
        data:users,
        token
    });
}
// 

const deleteUser=async(req,res)=>{
    // console.log(req.params.User);
    await User.deleteOne({_id:req.params.userId})
    res.json({
        message:"this user is deleted ",
        data:null
    })

}
const getUser=async (req,res,next)=>{
    const user =await User.findById(req.params.userId)
    if(!user)
    {
        const error=new Error();
        error.message='not found ';
        error.statusCode=404;
        return next(error);
    }
    return res.json({
        status:"Done",
        data:user
    });
}
const get_user_by_email=async (req,res,next)=>{
    const {email} = req.body;
    const user=await User.findOne({ email: email });   
    console.log(user);
     if(!user){
        return res.status(401).json({
             message:"Error ",
             status:res.statusCode
         })
     }
     res.status(200).json({
        status:httpStatusText.SUCCESS||"Done",
        data:user
    })
    //  (err, user) => {
    //     if (err) {
    //         console.error('Error fetching user by email:', err);
    //     } else {
    //         if (user) {
    //             console.log('User found:', user);
    //             res.json({
    //                 message:"get user successfully ",
    //                 user
    //             })
    //         } else {
    //             console.log('User not found for email:', email  );
    //         }
    //     }
    // });
}
const updateUser=async(req,res)=>{
    const user =await User.findByIdAndUpdate(req.params.userId,{$set:{...req.body}})

    try {
        if(!user)
        {
            return res.status(404).json({msg:"NOT FOUND THIS ID "});
        }
        res.status(200).json(
          {  updateduser:user,
            msg: "user updated "
            }
            );
    } catch (error) {
        return res.status(400).json({
            status:"ERROR",
            message:error.message
        })
    }
}
const register=async(req,res)=>{
    const {firstName,lastName,email,password,role}=req.body
    
    const oldUser=await User.findOne({email:email})
    if (oldUser) {
        return res.status(400).json({
            message:"Error with duplication"  ,
            status: 400
        })
    }
    // hashing password
    const hashedPassword=await bcrypt.hash(password,10)
    const user=new User({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        role
    });
    // generate web token
    const token=await generateJwt({email:user.email,id:user._id,role:user.role})
    // user.token=token;


    await user.save();
    res.status(201).json({
        
        token,
        status:httpStatusText.SUCCESS||"Done",
        data:user
    })
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    
    if(!email&&!password){
        
        return res.status(401).json({

            status:httpStatusText.FAIL,
            message:"email and password are required ||"
        })
    }
    const user = await User.findOne({email:email})
    if(!user){
       return res.status(401).json({
            message:"Error with logging , this user can not be found please check you sign up first",
            status:res.statusCode
        })
    }
    const matchedPassword =await bcrypt.compare(password,user.password);
    if(user && matchedPassword){
        const token=await generateJwt({email:user.email,id:user._id,role:user.role})
        // const refreshToken=await refreshToken(user._id)
        res.json({
            data:user,
            token
        })
    }else{
        res.status(422).json({
            message:"rewrite the email and password ",
            error:"something wrong with login"
        })
    }
}
const logOut=async(req, res) => {
    // req.session.destroy((err) => {
    //   if (err) {
    //     return res.status(500).json({ success: false, message: 'Error logging out' });
    //   }
    //   res.clearCookie('connect.sid'); // Clear the session cookie
    //   res.status(200).json({ success: true, message: 'Logout successful' });
    // });
    console.log("hi");
  }
module.exports={
    getAllUsers,
    register,
    login,
    deleteUser,
    updateUser,
    getUser,
    logOut,
    get_user_by_email   
}
