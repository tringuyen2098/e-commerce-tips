"use strict";

const CheckoutService = require("../services/checkout.service");
const { SuccessResponse } = require("../core/error.response");

class CheckoutController {
    /**
     * @desc add to cart for user
     * @param {int} userId
     * @param {*} res
     * @param {*} next
     * @method POST
     * @url
     * @return {}
     **/
    checkoutReview = async (req, res, next) => {
        //new
        new SuccessResponse({
            message: "Create new Cart success",
            metadata: await CheckoutService.checkoutReview(req.body),
        }).send(res);
    };
}

module.exports = new CheckoutController();
