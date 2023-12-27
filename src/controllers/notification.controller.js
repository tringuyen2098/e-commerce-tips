"use strict";
const { SuccessResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {
    getNotification = async (req, res, next) => {
        new SuccessResponse({
            message: "get notification",
            metadata: await listNotiByUser(req.query),
        }).send(res);
    };
}

module.exports = new NotificationController();
