const Product = require("../models/Product");

/* ADD PRODUCT */

const addProduct = async (req, res) => {

    try {

        const newProduct = new Product({

            name: req.body.name,

            price: req.body.price,

            category: req.body.category,

            image: req.file.filename,

            description: req.body.description

        });

        await newProduct.save();

        res.redirect("/products");

    } catch (error) {

        console.log(error);
    }

};




/* DELETE PRODUCT */

const deleteProduct =
async (req, res) => {

    try {

        const productId =
        req.params.id;

        await Product.findByIdAndDelete(
            productId
        );

        res.redirect("/admin");

    } catch (error) {

        console.log(error);
    }

};



/* EDIT PRODUCT PAGE */

const editProductPage =
async (req, res) => {

    try {

        const product =
        await Product.findById(
            req.params.id
        );

        res.render(
            "admin/editProduct",
            {
                user: req.session.user,
                product
            }
        );

    } catch (error) {

        console.log(error);
    }

};

/* UPDATE PRODUCT */

const updateProduct =
async (req, res) => {

    try {

        const productId =
        req.params.id;

        const updatedData = {

            name: req.body.name,

            price: req.body.price,

            category: req.body.category,

            description:
            req.body.description
        };

        /* IMAGE UPDATE */

        if(req.file){

            updatedData.image =
            req.file.filename;
        }

        await Product.findByIdAndUpdate(

            productId,

            updatedData

        );

        res.redirect("/admin");

    } catch (error) {

        console.log(error);
    }

};

/* GET PRODUCTS */

const getProducts = async (req, res) => {

    try {

        const products =
        await Product.find();

        res.render("products", {
            products
        });

    } catch (error) {

        console.log(error);
    }

};


module.exports = {

    addProduct,

    getProducts,

    deleteProduct,

    editProductPage,

    updateProduct
};