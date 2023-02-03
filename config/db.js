const mongoose=require("mongoose");
const connection= async (URL) =>{
try {
    const db_opt={
        name:"chaman"
    }
   await mongoose.connect(URL, db_opt)
    console.log("sucess")
} catch (error) {
    console.log(error)
    
}
};
module.exports= connection