"use strict";
const { SuccessResponse } = require("../core/success.response");
const {
    createComment,
    getCommentsByParentID,
    deleteComment,
} = require("../services/comment.service");

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "create new comment success",
            metadata: await createComment(req.body),
        }).send(res);
    };

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: "delete comment success",
            metadata: await deleteComment(req.body),
        }).send(res);
    };

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: "get comment success",
            metadata: await getCommentsByParentID(req.query),
        }).send(res);
    };
}

module.exports = new CommentController();
