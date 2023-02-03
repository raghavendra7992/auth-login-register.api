const dotenv=require("dotenv");
dotenv.config();
const express =require('express')
const cors=require("cors")
const connection =require ("./config/db.js")
const userRoutes=require("./routes/user.routes.js")
const port=process.env.PORT;
const url=process.env.URL;
const app=express()
// app.use(express.urlencoded({extended:true}))
app.use(cors())
connection(url)
app.use(express.json())
app.use("/api/user",userRoutes)
// app.get('/',(req, res)=>res.send('my app'))

app.listen(port, () => {console.log(`server starting http://localhost:${port}`)})