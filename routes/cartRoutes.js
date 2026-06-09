const express = require("express");

const router = express.Router();

const {

    addToCart,

    getCart,

    removeFromCart,

    increaseQuantity,

    decreaseQuantity

} = require("../controllers/cartController");

const {
    isLoggedIn
} = require(
    "../middleware/authMiddleware"
);

/* SHOW CART */

router.get("/", getCart);



router.get(
    "/add/:id",

    isLoggedIn,

    addToCart
);

/* REMOVE */

router.get(
    "/remove/:id",
    removeFromCart
);

/* INCREASE */

router.get(
    "/increase/:id",
    increaseQuantity
);

/* DECREASE */

router.get(
    "/decrease/:id",
    decreaseQuantity
);

module.exports = router;