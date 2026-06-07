const express = require("express");

const router = express.Router();

const {

    registerUser,

    loginUser,

    logoutUser

} = require("../controllers/authController");

/* REGISTER */

router.post(
    "/register",
    registerUser
);

/* LOGIN */

router.post(
    "/login",
    loginUser
);

/* LOGOUT */

// router.get(
//     "/logout",
//     logoutUser
// );



router.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if(error){

            console.log(error);
        }

        res.redirect("/login");

    });

});

module.exports = router;