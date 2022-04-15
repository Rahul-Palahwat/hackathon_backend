const mongoose=require('mongoose');

// this is the string to connect to the database 
const mongoURI="mongodb://localhost:27017/Hackathon_User?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectToMongo= ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo successfully");
    })
}

// now we import this module 
module.exports= connectToMongo;