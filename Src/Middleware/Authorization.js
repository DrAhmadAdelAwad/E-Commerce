const isAuthorized = (...role)=>{
    return (req,res,next)=>{
        if(role.includes(req.user.role)){
            return next()
        }
        return res.status(403).json({message : "you are not authorized"})
    }
}

export default isAuthorized