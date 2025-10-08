import express from "express"
import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword, verification, verifyOTP } from "../controllers/userControllers.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { userSchema, validateUser } from "../validators/userValidate.js"
const router=express.Router()
router.post('/register',validateUser(userSchema),registerUser)
router.post('/verify',verification)
router.post('/login',loginUser)
router.post('/logout',isAuthenticated,logoutUser)
router.post('/forgot-password',forgotPassword)
router.post('/verify-otp/:email',verifyOTP)
router.post('/reset-password/:email',resetPassword)
export default router