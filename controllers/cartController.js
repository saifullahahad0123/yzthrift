const Product =
require("../models/Product");

/* ADD TO CART */

const addToCart = async (req, res) => {

    try {

        const productId = req.params.id;

        const product =
        await Product.findById(productId);

        /* CREATE CART */

        if(!req.session.cart){

            req.session.cart = [];
        }

        /* CHECK EXISTING */

        const existingProduct =
        req.session.cart.find(item =>
            item.product._id == productId
        );

        if(existingProduct){

            existingProduct.quantity += 1;

        } else {

            req.session.cart.push({

                product,

                quantity: 1

            });
        }

        res.redirect("/cart");

    } catch (error) {

        console.log(error);
    }

};

/* SHOW CART */

const getCart = (req, res) => {

    const cart =
    req.session.cart || [];

    let total = 0;

    cart.forEach(item => {

        total +=
        item.product.price *
        item.quantity;
    });

    res.render("cart", {

        user: req.session.user,

        cart,

        total

    });
};

/* REMOVE ITEM */

const removeFromCart = (req, res) => {

    const productId =
    req.params.id;

    req.session.cart =
    req.session.cart.filter(item =>

        item.product._id != productId
    );

    res.redirect("/cart");
};

/* INCREASE QUANTITY */

const increaseQuantity = (req, res) => {

    const productId =
    req.params.id;

    req.session.cart.forEach(item => {

        if(item.product._id == productId){

            item.quantity += 1;
        }

    });

    res.redirect("/cart");
};

/* DECREASE QUANTITY */

const decreaseQuantity = (req, res) => {

    const productId =
    req.params.id;

    req.session.cart.forEach(item => {

        if(
            item.product._id == productId &&
            item.quantity > 1
        ){

            item.quantity -= 1;
        }

    });

    res.redirect("/cart");
};

module.exports = {

    addToCart,

    getCart,

    removeFromCart,

    increaseQuantity,

    decreaseQuantity
};