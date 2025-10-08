import jwt from "jsonwebtoken"
import 'dotenv/config'
import { User } from "../models/userModels.js"
export const isAuthenticated=async(req,res,next)=>{
    try {
        const authHeader=req.headers.authorization
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Access token is missing or invalid."
            })
        }
        const token=authHeader.split(" ")[1]
        jwt.verify(token,process.env.SECRET_KEY,async(err,decoded) =>{
            if(err){
                if(err.name==="TokenExpiredError"){
                    return res.status(400).json({
                        success:false,
                        message:"The access token has expired. Use refreshToken to generate a new one."
                    })
                }
                return res.status(400).json({
                    success:false,
                    message:"Access token is missing or invalid"
                })
            }
            const {id}=decoded
            const user=await User.findById(id)
            if(!user){
                return res.status(404).json({
                    success:false,
                    message:"User not found."
                })
            }
            req.userId=user._id
            next()
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}