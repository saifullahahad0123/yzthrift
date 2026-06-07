
require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const { isAdmin } = require("./middleware/authMiddleware");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

connectDB();

const app = express();

app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use( "/uploads", express.static("uploads"));
app.use(session({ secret: "thriftsecret", resave: false, saveUninitialized: false }));


app.set("view engine", "ejs");

app.use((req,res,next) => {
    res.locals.user = req.user || null; 
    next();
});

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/", authRoutes);
app.use("/", orderRoutes);



// app.use((req,res,next) => {
//     res.locals.user =  null; 
//     next();
// });


// app.get("/", (req, res) => {

//     res.render("index", {
//         user: req.session.user
//     });

// });




app.get("/", async (req, res) => {

    try {

        /* CATEGORY */

        const category =
        req.query.category;

        let products;

        /* FILTER */

        if(category && category !== "All"){

            products =
            await Product.find({

                category: category

            });

        } else {

            products =
            await Product.find();

        }

        res.render("index", {

            user:
            req.session.user,

            products,

            selectedCategory:
            category || "All"
        });

    } catch (error) {

        console.log(error);
    }

});

/* PRODUCT DETAILS */

app.get(
    "/products/:id",

    async (req, res) => {

    try {

        const product =
        await Product.findById(
            req.params.id
        );

        res.render(
            "productDetails",
            {

                user:
                req.session.user,

                product
            }
        );

    } catch (error) {

        console.log(error);
    }

});


// app.get("/", async (req, res) => {

//     try {

//         /* GET PRODUCTS */

//         const products =
//         await Product.find().limit(8);

//         res.render("index", {

//             user:
//             req.session.user,

//             products
//         });

//     } catch (error) {

//         console.log(error);
//     }

// });

/* SEARCH PRODUCTS */

app.get(
    "/search",

    async (req, res) => {

    try {

        const searchQuery =
        req.query.query;

        const products =
        await Product.find({

            $or: [

                {

                    name: {

                        $regex: searchQuery,

                        $options: "i"
                    }
                },

                {

                    category: {

                        $regex: searchQuery,

                        $options: "i"
                    }
                },

                {

                    description: {

                        $regex: searchQuery,

                        $options: "i"
                    }
                }

            ]

        });

        res.render(
            "searchResults",
            {

                user:
                req.session.user,

                products,

                searchQuery
            }
        );

    } catch (error) {

        console.log(error);
    }

});

app.get("/products", (req, res) => {
    res.render("products");
     user: req.session.user
   
});

app.get("/product", (req, res) => {
    res.render("productDetails");
    user: req.session.user
   
});


app.get("/cart", (req, res) => {
    res.render("cart");
     user: req.session.user

});


app.get("/login", (req, res) => {
   
    res.render("login", {
        user: req.session.user
    });
});

/* REGISTER */

app.get("/register", (req, res) => {
        res.render("register", {
        user: req.session.user
    });

});


// app.get("/admin", (req, res) => {
//     res.render("admin/dashboard");
// });

// app.get(
//     "/admin",
//     isAdmin,
//     (req, res) => {

//     res.render("admin/dashboard", {
//         user: req.session.user
//     });

// });

app.get("/admin", isAdmin, async (req, res) => {

    try {

        /* COUNT DATA */

        const totalProducts =
        await Product.countDocuments();

        const totalUsers =
        await User.countDocuments();

        const totalOrders =
        await Order.countDocuments();

        /* RECENT PRODUCTS */

        const products =
        await Product.find().limit(5);

        res.render("admin/dashboard", {

            user: req.session.user,

            totalProducts,

            totalUsers,

            totalOrders,

            products

        });

    } catch (error) {

        console.log(error);
    }

});



// app.get("/admin/add-product", (req, res) => {
//     res.render("admin/addProduct");
// });


/* ADMIN ORDERS */

app.get(
    "/admin/orders",

    isAdmin,

    async (req, res) => {

    try {

        const orders =
        await Order.find();

        res.render(
            "admin/orders",
            {

                user:
                req.session.user,

                orders
            }
        );

    } catch (error) {

        console.log(error);
    }

});



/* ADMIN PRODUCTS */

app.get(
    "/admin/products",

    isAdmin,

    async (req, res) => {

    try {

        const products =
        await Product.find();

        res.render(
            "admin/products",
            {

                user:
                req.session.user,

                products
            }
        );

    } catch (error) {

        console.log(error);
    }

});


/* ADMIN USERS */

app.get(
    "/admin/users",

    isAdmin,

    async (req, res) => {

    try {

        const users =
        await User.find();

        res.render(
            "admin/users",
            {

                user:
                req.session.user,

                users
            }
        );

    } catch (error) {

        console.log(error);
    }

});

app.get(
    "/admin/add-product",
    isAdmin,
    (req, res) => {

    res.render("admin/addProduct", {
        user: req.session.user
    });

});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});