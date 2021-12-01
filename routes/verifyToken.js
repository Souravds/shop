const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if(authHeader){
        //split "Bearer" and TOKEN
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err) res.status(403).json("Token is not valid!")
            //pass the User
            req.user = user
            next()
        })
    }else{
        // 401 = Not Authenticated
        res.status(401).json("You are not authenticated!")
    }
}

//Verfiy Token and Authorization
const verifyTokenAndAuthorization = (req,res,next) =>{
    verifyToken(req,res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

//Verfiy token and Admin
const verifyTokenAndAdmin = (req,res,next) =>{
    verifyToken(req,res, () => {
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do that!")
        }
    })
}


module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}