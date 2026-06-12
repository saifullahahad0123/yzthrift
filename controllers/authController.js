const bcrypt = require("bcryptjs");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/* REGISTER */

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        /* CHECK USER */

        const userExists =
        await User.findOne({ email });

        if(userExists){

            return res.send("User already exists");
        }

        /* HASH PASSWORD */

        const salt =
        await bcrypt.genSalt(10);

        const hashedPassword =
        await bcrypt.hash(password, salt);

        /* CREATE USER */

        const user =
        new User({

            name,

            email,

            password: hashedPassword,
              isVerified: false
        });
await user.save();
        

        const otp = Math.floor(
    100000 + Math.random() * 900000
);

req.session.otp = otp;
req.session.userId = user._id;

await sendEmail(

    user.email,

    "Verify Your Email Address – SF Thrift Store",

`Hello ${user.name},

Thank you for creating an account with SF Thrift Store.

To complete your registration and verify your email address, please use the One-Time Password (OTP) below:

OTP: ${otp}

This OTP is valid for 10 minutes.

For your security, please do not share this code with anyone.

If you did not create an account with SF Thrift Store, please ignore this email.

Thank you,

SF Thrift Store Team`
);

res.redirect("/verify-otp");

      

    } catch (error) {

        console.log(error);
    }

};

const verifyOtp = async (req, res) => {

    if(
        req.body.otp ==
        req.session.otp
    ){

        const user =
        await User.findById(
            req.session.userId
        );

        if(!user){

            return res.send(
                "User not found"
            );
        }

        user.isVerified = true;

        await user.save();

        /* CLEAR OTP SESSION */

        req.session.otp = null;

        req.session.userId = null;

        return res.redirect(
            "/login"
        );
    }

    res.send(
        "Invalid OTP"
    );
};
/* LOGIN */

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        /* FIND USER */

        const user =
        await User.findOne({ email });

        if(!user){

            return res.send("User not found");
        }
        if(!user.isVerified){

    return res.send(
        "Please verify your email first."
    );
}

        /* MATCH PASSWORD */

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){

            return res.send("Invalid password");
        }

        /* SESSION */

        req.session.user = {

            id: user._id,

            name: user.name,
             email: user.email,

            isAdmin: user.isAdmin
        };

        res.redirect("/");

    } catch (error) {

        console.log(error);
    }

};

/* LOGOUT */

const logoutUser = (req, res) => {

    req.session.destroy();

    res.redirect("/login");
};

module.exports = {

    registerUser,

    loginUser,

    logoutUser,
    verifyOtp
};