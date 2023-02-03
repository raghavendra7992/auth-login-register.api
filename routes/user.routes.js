const usercontroller=require("../controllers/usercontroller.js")
const express=require("express");
const router=express.Router();
const checkUser=require("../middeleware/auth.middleware.js")
//route middleware -to protect route
router.use("/changepassword",checkUser)
//public
router.post("/register",usercontroller.userRegistration)

router.post("/login",usercontroller.userLogin)

//protected routes;
router.post("/changepassword",usercontroller.changeUserpassword)







module.exports=router