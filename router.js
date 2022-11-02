const router = require("express").Router();
const userdata = require("./modal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validation = require("./verificationToken")
require("dotenv").config();


const key = "userinfoSecretId";

//create mail host 

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, 
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
})

//signup

router.post("/register",async (req,res)=>{

    try {
        let emailExit = await userdata.findOne({ email: req.body.email })
        if (emailExit) {
            return res.status(400).json("Email already taken");
        }
        let psHash = await bcrypt.hash(req.body.password, 10);
        const data = new userdata({
            name: req.body.name,
            email: req.body.email,
            password: psHash,
        });
        let result = await data.save();
        res.json(result);
       


    } catch (error) {
        res.status(500).send({ message: "INPUT ERROR" });
    }


});

//login

router.post("/login",async(req,res)=>{
    try {
        
        let userExit = await userdata.findOne({ email: req.body.email })
        if (!userExit) {
            return res.status(400).json("Your Email Wrong");
        }
        let passwordValidation = await bcrypt.compare(req.body.password, userExit.password);
        if (!passwordValidation) {
            return res.status(400).json("Your Password Wrong");
        }
        const userToken = jwt.sign({ email: userExit.email, name: userExit.name,id:userExit._id },key,{expiresIn:"1d"});
        res.header("auth",userToken).send(userToken);


    } catch (error) {
        res.status(500).send({ message: "INPUT ERROR" });
    }
});


router.post("/forgotpassword",async (req,res)=>{
    try {
        
     const exituser = await userdata.findOne({email:req.body.email});
     if(!exituser){
        return res.json("user not exists");
     }
     
     const secret = key+exituser.password;
     const userToken = jwt.sign({ email: exituser.email,id:exituser._id },secret,{expiresIn:"5m"});

     transporter.sendMail({
        to: exituser.email,
        from: process.env.EMAIL,
        subject: "verification mail",
        text:`This link http://localhost:8000/forgotpassword/${userToken}`
     })
     
     res.status(200).json("password send");
       
     

    } catch (error) {
        res.status(500).send({ message: "INPUT ERROR" });
        
    }
})


//sendmail

router.post("/mailsend",validation, async(req,res)=>{

     try {
         
        const userInfo = await userdata.findOne({email:req.body.email});
        transporter.sendMail({
            to: userInfo.email,
            from: process.env.EMAIL,
            subject: "verification mail",
            html:`<p>user verification mail</p>`
        })
        res.send("MAIL SEND....!");
     } catch (error) {
         res.status(500).send({ message: "INPUT ERROR" });
     }


})



module.exports= router;


