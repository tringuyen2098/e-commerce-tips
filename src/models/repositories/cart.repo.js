const {
    getSelectData,
    getUnSelectData,
    convertObjectIdMongodb,
} = require("../../utils/common-function");
const { cart } = require("../cart.model");

const findCartById = async (cartId) => {
    return await cart
        .findOne({ _id: convertObjectIdMongodb(cartId), cart_state: "active" })
        .lean();
};

module.exports = {
    findCartById,
};
