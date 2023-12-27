"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils/common-function");
const { findByEmail } = require("./shop.service");

const {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
    ForbiddenError,
} = require("../core/error.response");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;

        // neu token ton tai trong array thi xoa token luon
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError("Something wrong happen !! Pls re-login");
        }

        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError("Shop not registered!");

        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop not registered!");
        //create 1 cai moi
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        //update token
        await keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user,
            tokens,
        };
    };

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({ delKey });
        return delKey;
    };

    // 1-check email in dbs
    // 2- match password
    // 3-create at vs rt and save
    // 4-generate tokens
    // 5-get data return login


    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError("Shop not registered");

        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError("Authentication error");

        
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
        });

        return {
            code: 201,
            metadata: {
                shop: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: foundShop,
                }),
                tokens,
            },
        };
    };

    static signUp = async ({ name, email, password }) => {
        try {
            //check email exists
            // lean(): giam thieu response cua object and tang toc cpu
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                throw new BadRequestError("Error: Shop already registered!");
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            });

            
            if (newShop) {

                // create privatedKey, publicKey
                // private key: dùng để sign token
                // public key: dùng để verify token

                  // rsa: thuật toán bất đối xứng,
                  // format: pem : /; định dạng mã hóa nhị phân, ssl, tsl, rsa

                
                // const { privateKey, publicKey } = crypto.generateKeyPairSync(
                //     "rsa",
                //     {
                //         modulusLength: 4096,
                //         publicKeyEncoding: {
                //             type: "pkcs1",
                //             format: "pem",
                //         },
                //         privateKeyEncoding: {
                //             type: "pkcs1",
                //             format: "pem",
                //         },
                //     }
                // );
                const privateKey = crypto.randomBytes(64).toString("hex");
                const publicKey = crypto.randomBytes(64).toString("hex");

                ///Public key CryptoGraphy Standards
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                });

                if (!keyStore) {
                    return {
                        code: "xxxx",
                        message: "keyStore error",
                    };
                }

                // const publicKeyObject = crypto.createPublicKey(publicKeyString);

                //create token pair
                const tokens = await createTokenPair(
                    {
                        userId: newShop._id,
                        email,
                    },
                    publicKey,
                    privateKey
                );
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                        tokens,
                    },
                };
            }
            return {
                code: "xxx",
                metadata: null,
            };
        } catch (err) {
            return {
                code: "xxx",
                message: err.message,
                status: "error",
            };
        }
    };
}

module.exports = AccessService;
