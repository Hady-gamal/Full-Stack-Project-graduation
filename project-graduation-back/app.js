const express=require('express');
const cors=require('cors');
const Stadium=require('./models/stadium.js')
const mongoose=require('mongoose');
require('dotenv').config()
const router =express.Router()

const stadiumRouter=require('./routes/stadium.route.js')
const userRouter=require('./routes/user.route.js')
const timeRouter=require('./routes/time.route.js')
const httpStatusText=require('./utilz/httpStatusText')
const path =require('path');
const app=express();
app.use(express.json())
app.use(cors())
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
 const url=process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log("mongodb connected");
})

 app.use('/api/stadium',stadiumRouter);
app.use('/api/users',userRouter);
app.use('/api/hour',timeRouter);


// ERROR
app.use((error,req,res,next)=>{
    res.status(error.statusCode||500).json({
        status:httpStatusText.ERROR||"error",
        message:error.message
    })
})
app.all('*',(req,res,next)=>{

    res.status(404).json({
        status:httpStatusText.ERROR||"ERROR",
                message:{
                    stadium:"NOT FOUND THIS RESOURCE "
                },
            code:404,
            
    })
    next()
})
app.listen(process.env.PORT,()=>{
    console.log("HELLO");
})