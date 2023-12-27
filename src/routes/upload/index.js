"use strict";

const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/upload.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { uploadDisk, uploadMemory } = require("../../configs/multer.cfg");
const { authentication } = require("../../auth/authUtils");

// router.use(authentication);
router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
	"/product/thumb",
	uploadDisk.single("file"),
	asyncHandler(uploadController.uploadFileThumb)
);

router.post(
	"/product/multiple",
	uploadDisk.array("files", 3),
	asyncHandler(uploadController.uploadImageFromLocalFiles)
);

//upload s3
router.post(
	"/product/bucket",
	uploadMemory.single("file"),
	asyncHandler(uploadController.uploadImageFromLocalS3)
);

module.exports = router;
