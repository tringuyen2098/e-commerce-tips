"use strict";

const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");
// const { pushToLogDiscord } = require("../middlewares");

//add log discord
// router.use(pushToLogDiscord);

//check apiKey

// Thực hiện các tác vụ trước khi ứng dụng xử lý yêu cầu
router.use(apiKey);
//check permission
router.use(permission("0000"));

// Thực hiện các tác vụ sau khi các hàm trung gian đã được thực thi
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api", require("./access"));

module.exports = router;
