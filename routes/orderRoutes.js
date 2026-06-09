const express =
require("express");
const {isLoggedIn} = require("../middleware/authMiddleware");
const router =
express.Router();

const {

    checkoutPage,

    placeOrder,

    userOrders

} = require(
    "../controllers/orderController"
);



router.get(
    "/checkout",

    isLoggedIn,

    checkoutPage
);

/* PLACE ORDER */



router.post(
    "/place-order",

    isLoggedIn,

    placeOrder
);



router.get(
    "/orders",

    isLoggedIn,

    userOrders
);

module.exports = router;