const Order = require("../models/Order");

/* CHECKOUT PAGE */

const checkoutPage = (req, res) => {

    const cart =
    req.session.cart || [];

    let total = 0;

    cart.forEach(item => {

        total +=
        item.product.price *
        item.quantity;
    });

    res.render("checkout", {

        user: req.session.user,

        cart,

        total
    });
};

/* PLACE ORDER */

const placeOrder =
async (req, res) => {

    try {

        const cart =
        req.session.cart || [];

        if(cart.length === 0){

            return res.send(
                "Cart is empty"
            );
        }

        let total = 0;

        cart.forEach(item => {

            total +=
            item.product.price *
            item.quantity;
        });

        const newOrder =
        new Order({

            user:
            req.session.user.id,

            items:
            cart.map(item => ({

                product:
                item.product._id,

                name:
                item.product.name,

                price:
                item.product.price,

                quantity:
                item.quantity,

                image:
                item.product.image

            })),

            shippingAddress: {

                fullName:
                req.body.fullName,

                phone:
                req.body.phone,

                city:
                req.body.city,

                address:
                req.body.address
            },

            totalPrice: total
        });

        await newOrder.save();

        /* CLEAR CART */

        req.session.cart = [];

        res.redirect("/orders");

    } catch (error) {

        console.log(error);
    }
};

/* USER ORDERS */

const userOrders =
async (req, res) => {

    try {

        const orders =
        await Order.find({

            user:
            req.session.user.id

        });

        res.render("orders", {

            user:
            req.session.user,

            orders
        });

    } catch (error) {

        console.log(error);
    }
};

module.exports = {

    checkoutPage,

    placeOrder,

    userOrders
};