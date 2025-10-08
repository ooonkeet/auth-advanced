import yup from "yup"
export const userSchema=yup.object({
    username:yup.string().trim().min(3,"Username must be at least 3 characters long").required(),
    email:yup.string().email('Invalid email address').required(),
    password:yup.string().min(8,"Password must be at least 8 characters long").required()
})
export const validateUser=(schema) => async(req,res,next)=>{
    try{
        await schema.validate(req.body)
        next()
    }catch(err){
        return res.status(400).json({
            errors:err.errors
        })
    }
}

