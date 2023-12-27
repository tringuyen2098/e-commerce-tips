"use strict";
const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Get token success!",
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }),
        });
    };

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout success!",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    };
    signUp = async (req, res, next) => {
        new CREATED({
            message: "Regiserted OK!",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
        // return res.status(201).json(await AccessService.signUp(req.body));
        // try {
        //     console.log(`[P]::signUp::`, req.body);

        // } catch (err) {
        //     next(err);
        // }
    };
}

module.exports = new AccessController();
