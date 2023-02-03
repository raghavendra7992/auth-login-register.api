
const bcrypt=require("bcrypt");
const e = require("express");
const jwt =require("jsonwebtoken");
const UserModal = require("../model/user.model");

class usercontroller{
    static userRegistration= async (req,res)=>{
        const {name,email,password,con_password,tc}=req.body
        const user=await UserModal.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"email is already is there"})
        }else{
            if(name && email&&password&&con_password&&tc){
                if(password===con_password){
                    try {
                        const salt=await bcrypt.genSalt(10)
                        const hashpass=await bcrypt.hash(password,salt)

                    const doc=new UserModal({
                        name:name,
                        email:email,
                        password:hashpass,
                        tc:tc
                    })
                    await doc.save();
                    const saved_jwt=await UserModal.findOne({
                        email:email
                    })
                    const token=jwt.sign({userID:saved_jwt._id},
                        process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
                    res.send({"status":"sucess","message":"sucessfull","token":token})
                    } catch (error) {
                        res.send({"status":"failed","message":"user is not valid"})
                    }

                }else{
                    res.send({"message":"fill all data"})
                }
            }
        }
       
    }
    static userLogin=async (req,res)=>{
        try {
            const {email,password}=req.body
            if(email && password){
                const user=await UserModal.findOne({email:email})
                if(user!=null){
            const match=await bcrypt.compare(password,user.password)
                if(user.email===email && match){
                    const token=jwt.sign({userID:user._id},
                        process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
                    res.send({"msg":"sucess","token":token})
                }  else{
                    res.send({"msg":"failed"})
                }
                }else{
                    res.send({"msg":"not a user"})
                }

            }

        } catch (error) {
            res.send({"status":"Failed","mesage":"Incorrect"})
        }
    }
    static changeUserpassword=async (req,res)=>{
        const {password, con_password}=req.body;
        if(password&&con_password){
        if(password!==con_password){
            res.status(201).send({"msg":"password and confirm new password does not match"})
        }else{
            const salt=await bcrypt.genSalt(10)
            const hashpass=await bcrypt.hash(password,salt)
            res.send({"status":"succes","msg":"password change sucess"})
        }
    }else{
        res.send({"msg":"All feild require"})
    }
    }
}
module.exports=usercontroller