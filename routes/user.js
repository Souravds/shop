const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const User = require("../models/User")
const CryptoJs = require("crypto-js")
const router = require("express").Router()

//UPDATE THE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    //Updated new password hashed
    if(req.body.password){
        req.body.password = CryptoJs.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        ).toString()
    }

    //Find the user
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            //Update everything from body into MOngoDB
            $set: req.body
        
        //return the User
        },{new: true})

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

//DELETE THE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Usr has been deleted!")
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET THE USER BY ADMIN
router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, ...others } = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET THE USER BY ADMIN
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    //localhost:5000/api/user?new=true
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({_id : -1}).limit(5) : await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})


//GET SUER STATUS FOR EVERY MONTH
router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
    const date = new Date()
    console.log("Date: ", date);
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
    console.log("Last year: ",lastYear)

    try {
        const data = await User.aggregate([
            //Less than today but Greater than last year
            { $match: {createdAt: { $gte: lastYear } } },
            {
                $project:{
                    month: { $month: "$createdAt" },
                }
            },
            {
                $group:{
                    //Showing month and sum every registered user
                    _id: "$month",
                    total: { $sum: 1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router
