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

    email: String,

    phone: String,

    country: String,

    state: String,

    city: String,

    zipCode: String,

    address: String,

    landmark: String
},
    email: String,

    totalPrice: Number,

    orderNumber: {

    type: Number,

    unique: true
},

    status: {

        type: String,

        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model("Order", orderSchema);