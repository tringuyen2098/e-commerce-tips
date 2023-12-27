"use strict";
const crypto = require("crypto");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const cloudinary = require("../configs/cloudinary.cfg");
const { s3, PutObjectCommand, GetObjectCommand } = require("../configs/s3.cfg");
const randomImageName = () => crypto.randomBytes(16).toString("hex");
const urlImagePublish = "https://d39tezpbxjawap.cloudfront.net";

const uploadImageFromLocalS3 = async ({ file }) => {
	try {
		const imageName = randomImageName();
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: imageName,
			// Key: file.originalname || "unknown",
			Body: file.buffer,
			ContentType: "image/jpeg",
		});

		//export url
		//cloudfont normal
		// const result = await s3.send(command);
		// const signedUrl = new GetObjectCommand({
		// 	Bucket: process.env.AWS_BUCKET_NAME,
		// 	Key: imageName,
		// });
		// const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
		// return {
		// 	url: `${urlImagePublish}/${imageName}`,
		// 	result,
		// };

		//cloudfont secret
		const result = await s3.send(command);
		const url = getSignedUrl({
			url: `${urlImagePublish}/${imageName}`,
			keyPairId: "K30WDQV71OP4H5",
			dateLessThan: new Date(Date.now() + 1000 * 60),
			privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
		});
		return {
			url,
			result,
		};
	} catch (err) {
		console.log(err);
	}
};
//END S3 service ///

const uploadImageFromUrl = async () => {
	try {
		const urlImage = "";
		const folderName = "product/shopId",
			newFileName = "testdemo";
		const result = await cloudinary.uploader.upload(urlImage, {
			public_id: newFileName,
			folder: folderName,
		});
		return result;
	} catch (err) {
		console.log(err);
	}
};

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
	try {
		const result = await cloudinary.uploader.upload(path, {
			public_id: "thumb",
			folder: folderName,
		});
		return {
			image_url: result.secure_url,
			shopId: 8409,
			thumb_url: await cloudinary.url(result.public_id, {
				height: 100,
				width: 100,
				format: "jpg",
			}),
		};
	} catch (err) {
		console.log(err);
	}
};

const uploadImageFromLocalFiles = async ({
	files,
	folderName = "product/8409",
}) => {
	try {
		if (!files.length) return;
		const uploadedUrls = [];
		for (const file of files) {
			const result = await cloudinary.uploader.upload(file.path, {
				folder: folderName,
			});

			uploadedUrls.push({
				image_url: result.secure_url,
				shopId: 8409,
				thumb_url: await cloudinary.url(result.public_id, {
					height: 100,
					width: 100,
					format: "jpg",
				}),
			});
		}
		return uploadedUrls;
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	uploadImageFromUrl,
	uploadImageFromLocal,
	uploadImageFromLocalS3,
	uploadImageFromLocalFiles,
};
