const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: String
            },
            quantity: {
                type: Number,
                default: 1
            },
        }
    ], 
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Cart", cartSchema)