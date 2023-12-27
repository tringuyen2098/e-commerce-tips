"use strict";

const router = require("express").Router();
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

//get amount a discount
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
    "/list_product_code",
    asyncHandler(discountController.getAllDiscountCodesWithProducts)
);

///authentication
router.use(authentication);

router.post("/", asyncHandler(discountController.createDiscountCode));
router.get("/", asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
