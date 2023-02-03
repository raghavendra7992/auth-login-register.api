const jwt=require("jsonwebtoken");
const UserModal=require("../model/user.model.js")

let checkUser=async(req,res,next)=>{
    let token;
    const {authorization}=req.headers
    if(authorization && authorization.startsWith("Bearer")){
        try {
            token=authorization.split(" ")[1]

            const {userID}=jwt.verify(token,process.env.JWT_SECRET_KEY)


            req.user=await UserModal.findById(userID).select("-password")
            next()
        } catch (error) {
            res.status(401).send({"status":"unothorized user"})
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","msg":"no token"})
    }
}

module.exports=checkUser