const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const express  = require('express');

const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
// utf8
app.use(
    express.urlencoded({
        extended: true,
    })
);

// test pub sub redis
// require("./tests/inventory.test");
// const productTest = require("./tests/product.test");
// productTest.purchaseProduct("product:001", 10);

require("./databases/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

//init routes
app.use("/", require("./routes"));

//handing error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});


// hàm quản lý lỗi
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: err.stack,
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
