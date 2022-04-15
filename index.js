const { request } = require('express');
const express=require('express');
const cors=require('cors');
const app=express();

const port=8000;


// now we will import db.js to start the connection 
const connectToMongo=require('./db.js');
// now to connect we will call the function 
connectToMongo();


// now to get data from req.body we will use middleware....by which we will get the data in JSON format 
app.use(cors());
app.use(express.json());

// end points for request...which will be availbabe from routes folder 
// app.use('/signup',require('./routes/sign.js'))
// this is to import schema 
const User=require('./models/user');

// this is to encrypting password 
const bcrypt=require('bcryptjs');

// this is for validation of input from body 
const {body, validationResult}=require('express-validator');




// Route1: create an user using post "/signup"
// here we are using validation's , if anything not valid then that will be passed to error array 
app.post('/signup',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid Email').isEmail(),
    body('password','password must be atleast 7 characters').isLength({min:7})
],async(req,res)=>{
  let success=false;
    // this will return bad request with the error array 
    // console.log("Hello world")
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // now we will check if user with this mail or phone is already present or not if not then we will save the user info 
    try {
        console.log("Hello");
        console.log(req.body);
        let user1= await User.findOne({email:req.body.email});
        let user2= await User.findOne({phone:req.body.phone});
        if(user1){
            return res.status(400).json({success,error:"Sorry this email is already registered"});
        }
        if(user2){
            return res.status(400).json({success,error:"Sorry this phone is already registered"});
        }

        success=true;
        // now we will encrypt the password 
        const salt=await bcrypt.genSalt(10);
        secPass=await bcrypt.hash(req.body.password,salt);

        const user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPass,
            phone:req.body.phone,
            address:req.body.address,
            // dob:req.body.dob,
        })

        console.log(user);
        res.status(200).json({success,user});
        
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
        
    }

})
// Route2: fecth an user using post "/login"
// here we are using validation's , if anything not valid then that will be passed to error array 
//Route 2: Authenticationg a user using : post "/api/auth/login". Doesn't require auth
app.post('/login',[
    body('email','Enter a valid Email').isEmail(),
    body('password','password can not be blank').exists(),
    
  ],async (req,res)=>{
    let success=false;
    // yen errors ke liye h , this will return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
    }
  
    const {email,password}=req.body;
    try {
      let user= await User.findOne({email});
      if(!user){
        return res.status(400).json({success,error:"Please try to login with correct email id"})
      }
      const passwordCompare= await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({success,error:"Please try to login with correct password"})
      }
      // this is the data of the user when all the datils are correct 
      success=true;
      // const json=await user.json();
      console.log(user);
      res.status(200).json({success,user});
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server errror");
  }
  
  
  
  })






//this is to listen the server
app.listen(port,()=>{
    console.log(`This site is listening at http://localhost:${port}`);
})