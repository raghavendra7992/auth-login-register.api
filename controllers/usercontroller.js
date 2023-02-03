
const bcrypt=require("bcrypt");
const e = require("express");
const jwt =require("jsonwebtoken");
const UserModal = require("../model/user.model.js");

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
            res.send({"msg":"password and confirm new password does not match"})
        }else{
            const salt=await bcrypt.genSalt(10)
            const hashpass=await bcrypt.hash(password,salt)
            await UserModal.findByIdAndUpdate(req.user._id,{$set:{password:hashpass}})
            res.send({"status":"succes","msg":"password change sucess"})
        }
    }else{
        res.send({"msg":"All feild require"})
    }
    }
    static loggedUser=async (req,res)=>{
        res.send({"user":req.user})
    }
    static resetPassEmail=async (req,res)=>{
       const {email}=req.body
       if(email){
        const user= await UserModal.findOne({email:email})
        if(user){
            const secret=user._id+process.env.JWT_SECRET_KEY
            const token=jwt.sign({userID: user._id},{
                expiresIn:"15m"
            })
            const link=`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`



            console.log(link)
            res.send({"msg":"email and password change succesfull"})
        }else{
            res.send({"status":"failed","msg":"email does not exist"})
        }
       } else{
        res.send({"status":"failed","msg":"Email Feild require"})

       }
    }
    static userPasswordReset=async (req,res)=>{
        const {password,co_password}=req.body;
        const {id,token}=req.params;
        const user=await UserModal.findById(id)
        const new_tken=user._id+process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token,new_tken)
            if(password && con_password){
                if(password!==con_password){
                    res.send({"msg":"status failed passwornd not match"})
                }else{
                    const salt=await bcrypt.genSalt(10)
                    const newhashpass=await bcrypt.hash(password,salt)
                    await UserModal.findByIdAndUpdate(user._id,{$set:{password:newhashpass}})
                    res.send({"msg":"succsfully"})
                }
            }else{
                res.send({"msg":"all feild required"})
            }
        } catch (error) {
            res.send({"msg":"invalid token"})
            
        }
    }
}
module.exports=usercontroller