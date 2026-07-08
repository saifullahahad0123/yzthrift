
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
const sendEmail = require("./utils/sendEmail");
const MongoStore = require("connect-mongo").default;


connectDB();

const app = express();
app.use(session({

    secret: "thriftsecret",

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({

        mongoUrl: process.env.MONGO_URI
    }),

    cookie: {

        maxAge: 2 * 24 * 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {

    res.locals.user = req.session?.user || null;

    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");


app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/", authRoutes);

app.use("/orders",orderRoutes);

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

        const mysteryBoxes =
await Product.find({

    category: "Mystery Box"
});

        res.render("index", {

            user:
            req.session.user,

            products,
             mysteryBoxes,

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


app.get("/products", async (req, res) => {
    res.render("products", {
        user: req.session.user
    });
});

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

app.get("/contact", (req, res) => {

    res.render("contact", {
        user: req.session.user
    });

});




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







app.post(

    "/admin/orders/status/:id",

    isAdmin,

    async (req, res) => {

    try {

        const order =
        await Order.findById(

            req.params.id
        );

        if(!order){

            return res.send(
                "Order not found"
            );
        }

        /* UPDATE STATUS */

        order.status =
        req.body.status;

        await order.save();

        /* SEND EMAIL */

        await sendEmail(

            order.email,

            "Order Status Updated",

`Hello ${order.shippingAddress.fullName},

Your order status has been updated.

New Status:
${order.status}

Thank you for shopping with YZ Thrift .
`
        );

        res.redirect(
            "/admin/orders"
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




const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on ${PORT}`
    );
});