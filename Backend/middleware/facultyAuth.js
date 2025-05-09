import jwt from "jsonwebtoken"


const facultyAuth = async (req , res , next) => {
    try {
        const authorization = req.headers.authorization
        console.log(req);
        
        const token = authorization.split(" ")[1]
        
        const verifyToken = jwt.verify(token , process.env.JWT_SECRET_KEY)
        if(verifyToken.id){
            req.id = verifyToken.id 
            next() 
            return
        }
        
        res.json({success : false , message : "UnAuthorized Access"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : "UnAuthorized Access"})
    }
} 

export default facultyAuth