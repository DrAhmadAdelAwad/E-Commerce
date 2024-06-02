import userModel from "../../DB/Models/User.model.js"
import { asyncHandler } from "../Utils/errorHandling.js"
import jwt from "jsonwebtoken"

export const isAuthenticated = asyncHandler (async (req,res,next)=>{
    const {token} = req.headers
    if(!token?.startsWith(process.env.BEARER_KEY)) {
        return next(new Error('Invalid Token or Bearer Key' , {cause : 400}))
    }
    const payLoad  = token.split(process.env.BEARER_KEY)[1]
    const decoded = jwt.verify(payLoad , process.env.TOKEN_SIGNATURE)
    if(!decoded.id) {
        return next(new Error('Invalid Token Payload' , {cause : 400}))
    }
    const user = await userModel.findById(decoded.id)
    if(!user) {
            return next(new Error('Invalid User Id' , {cause : 400}))
        }
    if(user.status == "offline"){
            return next(new Error('Please Login' , {cause : 400}))
        }
    req.user = user
    return next()
})