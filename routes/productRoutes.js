const express = require("express");

const router = express.Router();

const multer = require("multer");


const {

    addProduct,

    getProducts,

    deleteProduct,

    editProductPage,

    updateProduct

} = require(
    "../controllers/productController"
);


/* STORAGE */

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/");
    },

    filename: function(req, file, cb){

        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    }

});

const upload = multer({ storage });

/* ROUTES */

router.post(
    "/add",
    upload.single("image"),
    addProduct
);

router.get("/", getProducts);

/* DELETE */

router.get(
    "/delete/:id",
    deleteProduct
);

/* EDIT PAGE */

router.get(
    "/edit/:id",
    editProductPage
);

/* UPDATE */

router.post(

    "/update/:id",

    upload.single("image"),

    updateProduct
);


module.exports = router;