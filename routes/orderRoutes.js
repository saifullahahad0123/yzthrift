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

/* CHECKOUT */

// router.get(
//     "/checkout",
//     checkoutPage
// );

router.get(
    "/checkout",

    isLoggedIn,

    checkoutPage
);

/* PLACE ORDER */

// router.post(
//     "/place-order",
//     placeOrder
// );

router.post(
    "/place-order",

    isLoggedIn,

    placeOrder
);

/* ORDERS */

// router.get(
//     "/orders",
//     userOrders
// );

router.get(
    "/orders",

    isLoggedIn,

    userOrders
);

module.exports = router;