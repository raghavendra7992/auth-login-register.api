const usercontroller=require("../controllers/usercontroller.js")
const express=require("express");
const router=express.Router();
const checkUser=require("../middeleware/auth.middleware.js")
//route middleware -to protect route
router.use("/changepassword",checkUser)
router.use("/loggeduser",checkUser)
//public
router.post("/register",usercontroller.userRegistration)

router.post("/login",usercontroller.userLogin)
router.post("/resetemail",usercontroller.changeUserpassword)
router.post("/resetpass",usercontroller.changeUserpassword)
//protected routes;
router.post("/changepassword/:id/:token",usercontroller.changeUserpassword)
router.get("/loggeduser",usercontroller.loggedUser)







module.exports=router