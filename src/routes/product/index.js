"use strict";

const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");

router.get(
    "/search/:keySearch",
    asyncHandler(productController.getListSearchProduct)
);

router.get("", asyncHandler(productController.findAllProducts));

router.get("/:product_id", asyncHandler(productController.findProduct));

// authentication
router.use(authentication);
///////////////
router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post(
    "/publish/:id",
    asyncHandler(productController.publicProductByShop)
);

router.post(
    "/unpublish/:id",
    asyncHandler(productController.unPublicProductByShop)
);

//QUERY//
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
