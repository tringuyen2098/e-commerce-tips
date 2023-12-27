const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // error passed on to the error handling route
    };
};

module.exports = asyncHandler;
