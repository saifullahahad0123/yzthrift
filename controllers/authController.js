const bcrypt = require("bcryptjs");

const User = require("../models/User");

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

            password: hashedPassword

        });

        await user.save();

        res.redirect("/login");

    } catch (error) {

        console.log(error);
    }

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

    logoutUser
};