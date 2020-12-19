const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { validationResult} = require("express-validator");
const jws = require("jsonwebtoken");

exports.auth_register = async (req,res)=>{
 
    const {firstName, lastName, email, password} = req.body;

    const validationErr = validationResult(req);

    if(validationErr?.errors?.length > 0){
        return res.status(400).json({errors: validationErr.array() });
    }

    //TODO1: Validate the fields
    //TODO2 : check already registered
    //TODO3 : crypt password
    //TODO4: save the user to DB

    const userData = await User.findOne({email});
    if(userData){
        return res.status(400).json({errors: [{message : "User already exists!!"}] });
    }

    //Password hash
    const salt = await bcrypt.genSalt(10);
    const newPassword =await bcrypt.hash(password, salt);
  

    // Save User
    const user = new User({
        firstName,
        lastName,
        email,
        password : newPassword ,
    });

    await user.save();
    // TODO error handling
    res.send("Register Completed");
};


exports.auth_login = async (req, res) =>{

    const {email, password} = req.body;

    //Field validation
    const validationErr = validationResult(req);

    if(validationErr.errors.length > 0){
        return res.status(400).json({errors: validationErr.array() });
    }

    //User exist check
    const userData = await User.findOne({email});
    if(!userData){
        return res
            .status(400)
            .json({errors: [{message : "User doesn't exists!!"}] });
    }

    //Password compare
    const isPasswordMatch = await bcrypt.compare(password,userData.password);
    if(!isPasswordMatch){
        return res.status(400).json({errors: [{message : "Invalid credentials"}] });

    }

   // authentication return JSON WEB TOKEN - JWT
    
    jws.sign(
        {userData},
        process.env.JWT_SECRET_KEY,
        {expiresIn:3600}, 
        (err, token)=>{
        if(err){
            return res
            .status(400)
            .json({errors: [{message: "Unkonown Error "}] });   
        }       
        res.send(token);


    });
 


};