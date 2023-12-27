"use strict";
//key !dmbg install by Mongo Snippets for Nodejs
const { model, Schema } = require("mongoose");


const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        privateKey: {
            type: String,
            required: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: Array,
            default: [] // những token đã được sử dụng rồi, nếu dùng lại sẽ khóa tài khoản xem như tài khoản nghi vấn hoặc bị hack
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
