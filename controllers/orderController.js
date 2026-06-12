const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

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

         const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(
            !emailRegex.test(req.body.email)
        ){
            return res.send(
                "Please enter a valid email address"
            );
        }

        /* VALIDATE PHONE */

        const phoneRegex =
        /^[0-9]{10}$/;

        if(
            !phoneRegex.test(req.body.phone)
        ){
            return res.send(
                "Please enter a valid 10-digit phone number"
            );
        }

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

const lastOrder = await Order.findOne()
    .sort({ orderNumber: -1 });

const orderNumber =
    lastOrder?.orderNumber
        ? lastOrder.orderNumber + 1
        : 100;

        const newOrder =
        new Order({
   orderNumber: orderNumber,
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
                item.product.image,
               

            })),

            shippingAddress: {

    fullName: req.body.fullName,

    email: req.body.email,

    phone: req.body.phone,

    country: req.body.country,

    state: req.body.state,

    city: req.body.city,

    zipCode: req.body.zipCode,

    landmark: req.body.landmark,

    address: req.body.address
},
            email:
                 req.session.user.email,

            totalPrice: total
        });

        await newOrder.save();

await sendEmail(

    process.env.ADMIN_EMAIL,

    "New Order Received",

`Customer:
${req.session.user.name}

Phone:
${req.body.phone}

Address:
${req.body.address}

A new order has been placed.`
);




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


const deleteOrder =
async (req, res) => {

    try {

        const order =
        await Order.findById(

            req.params.id
        );

        /* ORDER ALREADY DELETED */

        if(!order){

            return res.redirect(
                "/orders"
            );
        }

        /* ADMIN CAN DELETE ANY ORDER */

        if(

        req.session.user.isAdmin

        ){

            await Order.findByIdAndDelete(

                req.params.id
            );

            return res.redirect(
                "/admin/orders"
            );
        }

        /* CUSTOMER CAN DELETE ONLY OWN ORDER */

        if(

order.user.toString()

===

req.session.user.id

){

    /* ALLOW ONLY PENDING OR PROCESSING */

    if(

        order.status !== "Pending"

        &&

        order.status !== "Processing"

    ){

        return res.send(

            "This order can no longer be cancelled."

        );
    }

    await Order.findByIdAndDelete(

        req.params.id
    );

    return res.redirect(
        "/orders"
    );
}

        res.send(
            "Access Denied"
        );

    } catch (error) {

        console.log(error);
    }
};


module.exports = {

    checkoutPage,

    placeOrder,

    userOrders,

    deleteOrder
};