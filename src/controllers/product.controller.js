"use strict";
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const { product } = require("../models/product.model");

class ProductController {
    createProduct = async (req, res, next) => {
        // new SuccessResponse({
        //     message: "Create product success!",
        //     metadata: await ProductService.createProduct(
        //         req.body.product_type,
        //         {
        //             ...req.body,
        //             product_shop: req.user.userId,
        //         }
        //     ),
        // }).send(res);

        new SuccessResponse({
            message: "Create product success!",
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };

    //PATCH
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Update Product success!",
            metadata: await ProductServiceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };
    //END PATCH

    // PUT
    publicProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Product success!",
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    unPublicProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "UnPublish Product success!",
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    //END PUT

    //QUERY
    /**
     * @desc Get all Draft for shop
     * @param {Number} limit
     * @param {Number} limit
     * @return {JSON}
     **/
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Draft Success!",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Public Success!",
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list search success!",
            metadata: await ProductServiceV2.searchProducts(req.params),
        }).send(res);
    };

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list all products success!",
            metadata: await ProductServiceV2.findAllProducts(req.query),
        }).send(res);
    };

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list product success!",
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res);
    };

    // END QUERY
}

module.exports = new ProductController();
