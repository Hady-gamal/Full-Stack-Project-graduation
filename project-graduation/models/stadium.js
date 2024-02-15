const mongoose=require('mongoose')

const erenaSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
        avatar:{
        type:String,
        default:'uploads/bg.jpg'
    }
})
module.exports=mongoose.model('Erena',erenaSchema)  