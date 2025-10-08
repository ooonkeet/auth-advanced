import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from "../backend/routes/userRoute.js"
const app = express()
const PORT = process.env.PORT||3000
app.use(express.json())
app.use('/user',userRoute)
// http://localhost:8000/user/register -> endpoint (post)
app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is listening at port ${PORT}`);
})