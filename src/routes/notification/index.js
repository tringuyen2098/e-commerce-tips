"use strict";
const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/notification.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.use(authentication);
router.get("", asyncHandler(notificationController.getNotification));

module.exports = router;
