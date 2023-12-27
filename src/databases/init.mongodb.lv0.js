"use strict";

const mongoose = require("mongoose");
require("dotenv").config();

const connectString = process.env.MONGO_URI;
mongoose.set("strictQuery", true);
mongoose
    .connect(connectString, {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((_) => console.log(`Connected Mongodb Success`))
    .catch((err) => console.log(`Error Connect!`));

//dev
if (1 === 0) {
    mongoose.set("debug", true);
    mongose.set("debug", { color: true });
}

module.exports = mongoose;
