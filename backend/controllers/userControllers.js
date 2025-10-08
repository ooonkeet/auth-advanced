import { verifyMail } from "../email/verifyMail.js"
import { User } from "../models/userModels.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { Session } from "../models/sessionModels.js"

export const registerUser=async(req,res)=>{
    try {
        const {username,email,password}=req.body
        if(!username || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=await User.create({username,email,password:hashedPassword})
        const token=jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:"10m"})
        verifyMail(token,email)
        newUser.token=token
        await newUser.save()
        return res.status(201).json({
            success:true,
            message:"User created successfully",
            data:newUser
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const verification=async(req,res)=>{
    try {
        const authHeader=req.headers.authorization
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Authorization token is missing or invalid."
            })
        }
        const token=authHeader.split(" ")[1]
        let decoded
        try {
            decoded=jwt.verify(token,process.env.SECRET_KEY)
        } catch (error){
            if(error.name==="TokenExpiredError"){
                return res.status(400).json({
                    success:false,
                    message:"The registration token has expired."
                })
            }
            return res.status(400).json({
                success:false,
                message:"Token verification failed."
            })
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }
        user.token=null
        user.isVerified=true
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Email verified successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
            const user=await User.findOne({email})
            if(!user){
                return res.status(401).json({
                    success:false,
                    message:"Unauthorized access."
                })
            }
            const passCheck=await bcrypt.compare(password,user.password)
            if(!passCheck){
                return res.status(402).json({
                    success:false,
                    message:"Incorrect Password."
                })
            }
            if(!user.isVerified){
                return res.status(403).json({
                    success:false,
                    message:"Please verify your email. Then log in."
                })
            }
            //existing session check and deletion
           const existingSession=await Session.findOne({userId:user._id})
           if(existingSession){
            await existingSession.deleteOne({userId:user._id})
           }
           //create a new session
           await Session.create({userId:user._id})
           //generate tokens
           const accessToken=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"10d"})
           const refreshToken=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"30d"})
           user.isLogin=true
           await user.save()
           return res.status(200).json({
            success:true,
            message:`Welcome back ${user.username}`,
            accessToken,
            refreshToken,
            data:user
           })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const logoutUser=async(req,res)=>{
    try {
        const userId=req.userId
        await Session.deleteOne({userId})
        await User.findByIdAndUpdate(userId,{isLogin:false})
        return res.status(200).json({
            success:true,
            message:"User logged out successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    
}