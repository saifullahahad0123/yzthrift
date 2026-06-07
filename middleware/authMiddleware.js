const isAdmin = (req, res, next) => {

    /* CHECK LOGIN */

    if(!req.session.user){

        return res.redirect("/login");
    }

    /* CHECK ADMIN */

    if(!req.session.user.isAdmin){

        return res.send(
            "Access Denied. Admin Only."
        );
    }

    next();
};

/* LOGIN CHECK */

const isLoggedIn = (req, res, next) => {

    if(req.session.user){

        next();

    } else {

        res.redirect("/login");
    }
};

module.exports = {

    isAdmin,

    isLoggedIn
};