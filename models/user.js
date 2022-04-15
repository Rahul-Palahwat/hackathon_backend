const mongoose=require('mongoose');

//this is for schemas
const {Schema}=mongoose;

// this is the schema to store data in a proper format 
const UserSchema=new Schema({
    name:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true 
    },
    phone:{
        type:Number,
        unique:true 
    },
    address:{
        type:String,
        
    }
});

const User=mongoose.model('user',UserSchema);
module.exports=User;