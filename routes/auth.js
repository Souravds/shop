const router = require("express").Router()
const User = require("../models/User")
const CryptoJs = require("crypto-js")
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    })

    try {
        //SAVED NEW USER SUCESSFUL
        const savedUser = await newUser.save()
        
        //Status code 200 = Successful / 201 = Succesfully Added
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})  

//LOGIN
router.post("/login", async (req,res) => {
    try {
        //Find User 
        const user = await User.findOne({username: req.body.username})
        
        //If not User = 401 = Unauthorized client error
        !user && res.status(401).json("Wrong Credentials!")
    
        //Decrypt Password
        const hashedPassword = CryptoJs.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        )
        
        //Matching User Pssword
        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8)
        originalPassword !== req.body.password && res.status(401).json("Wrong Credentials!")
            
        //Token Create
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.SECRET_KEY, {expiresIn: "3d"})

        //Destructure others info except password
        const {password, ...others } = user._doc
        res.status(200).json({others, accessToken})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
