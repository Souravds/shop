const Cart = require("../models/Cart")
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require("./verifyToken")

const router = require("express").Router()

//Create Cart
router.post("/",verifyToken, async (req,res) =>{
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Update Cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true
            }
        )

        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)        
    }
})

//Delete the Cart
router.delete("/:id",verifyTokenAndAuthorization, async (req,res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted!")
    } catch (error) {
        res.status(500).json(error)
    }
})


//Get User's Cart ( Here id = User id )
router.get("/find/:userId", async (req,res) => {
    try {
        //Quesry by userId and findOne for every user has one Cart
        const individualUserCart = await Cart.findOne({ userId: req.params.userId })
        res.status(200).json(individualUserCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get All Carts for Admin
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }

})


module.exports = router