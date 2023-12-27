"use strict";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "ben1205",
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_KEY_SECRET,
});

module.exports = cloudinary;
