import jwt from "jsonwebtoken"

export const studentAuth = async (req , res , next) => {
    try {

        const token = req.headers.authorization
        let verifyToken = null

        if(token){
            verifyToken = await jwt.verify( token.split(" ")[1] , process.env.JWT_SECRET_KEY)
        } 
       
        if(verifyToken) {
            req.regNo = verifyToken.regNo
            next()
            return 
        }
        res.json({success : false , message : "UnAuthorized Access"})
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message })
    }
}