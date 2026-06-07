const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {

        type:
        mongoose.Schema.Types.ObjectId,

        ref: "User"

    },

    items: [

        {

            product: {

                type:
                mongoose.Schema.Types.ObjectId,

                ref: "Product"
            },

            name: String,

            price: Number,

            quantity: Number,

            image: String
        }

    ],

    shippingAddress: {

        fullName: String,

        phone: String,

        city: String,

        address: String
    },

    totalPrice: Number,

    status: {

        type: String,

        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model("Order", orderSchema);