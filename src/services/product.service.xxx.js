"use strict";

const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById,
} = require("../models/repositories/product.repo");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
    removeUndefinedObject,
    updateNestedObjectParse,
} = require("../utils/common-function");

///add notification services
const { pushNotiToSystem } = require("./notification.service");

//define Factory class to create product
class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid Product Types ${type}`);
        return new productClass(payload).createProduct();

        // switch (type) {
        //     case "Electronics":
        //         return new Electronics(payload).createProduct();
        //     case "Clothing":
        //         return new Clothing(payload).createProduct();
        //     case "Furniture":
        //         return new Furniture(payload).createProduct();
        //     default:
        //         throw new BadRequestError(`Invalid Product Types ${type}`);
        // }
    }
    // PATCH
    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid Product Types ${type}`);
        return new productClass(payload).updateProduct(productId);
    }
    // END PATCH

    //PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }
    //END PUT

    //query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProducts({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await findAllProduct({
            limit,
            sort,
            filter,
            page,
            select: [
                "product_name",
                "product_price",
                "product_thumb",
                "product_shop",
            ],
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] });
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_type,
        product_shop,
        product_attributes,
        product_quantity,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
        this.product_shop = product_shop;
        this.product_type = product_type;
    }

    ///create new product
    // async createProduct(product_id) {
    //     return await product.create({ ...this, _id: product_id });
    // }

    ///add to inventory
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id });
        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })
                .then((rs) => console.log(rs))
                .catch((err) => console.log(err));
            //push noti to system collection
            pushNotiToSystem({
                type: "SHOP-001",
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop,
                },
            })
                .then((rs) => console.log(rs))
                .catch((err) => console.log(err));
        }
        return newProduct;
    }

    ///level 1
    // async updateProduct(productId, bodyUpdate) {
    //     return await product.findByIdAndUpdate(productId, bodyUpdate, {
    //         new: true,
    //     });
    // }

    ///level 2
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({
            productId,
            bodyUpdate,
            model: product,
        });
    }
}

//Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing)
            throw new BadRequestError("create new Clothing error");
        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("create new Product error");
        return newProduct;
    }

    async updateProduct(productId) {
        /*
            {
                a:undefined,
                b:null
            }
        */
        //1. remove attr has null undefined
        const objectParams = removeUndefinedObject(this);

        //2.check xem update o cho nao?
        if (objectParams.product_attributes) {
            //update child
            // await clothing.findByIdAndUpdate(
            //     productId,
            //     objectParams.product_attributes,
            //     {
            //         new: true,
            //     }
            // );
            //level 2
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParse(
                    objectParams.product_attributes
                ),
                model: clothing,
            });
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParse(objectParams)
        );
        return updateProduct;
    }
}

//Define sub-class for different product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic)
            throw new BadRequestError("create new Electronics error");
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("create new Product error");
        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture)
            throw new BadRequestError("create new Furniture error");
        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("create new Product error");
        return newProduct;
    }
}

//register product types
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
