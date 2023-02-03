const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    tc:{type:Boolean,required:true}
})
const UserModal=mongoose.model("user",userSchema)
module.exports=UserModal