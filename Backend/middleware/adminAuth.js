
import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        const token = authorization.split(" ")[1]

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (verifyToken) {
            next();
        } else {
            res.json({ success: false, message: "UnAuthorized Access" })
        }

    } catch (error) {
        res.json({ success: false, message: "UnAuthorized Access" })
        console.log(error);

    }
}

export default adminAuth