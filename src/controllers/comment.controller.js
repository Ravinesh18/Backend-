import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { isValidObjectId } from "mongoose";
import { compare } from "bcrypt";

//add comment , delete comment , update comment , get all video comment

const getAllVideosComment = asyncHandler(async (req, res) => {});
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }
  if (!content) {
    throw new ApiError(400, "Comment content is required !");
  }

  const newComment = new Comment({
    videoId,
    content,
  });

  await newComment.save();

  return res.status(200).json(200, "Comment added successfully!");
});
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  if (!content) {
    throw new ApiError(400, "Content for comment not found!");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  return res 
  .status(200)
  .json(
    200 , "Comment updated successfully!"
  )
});
const deleteComment = asyncHandler(async (req, res) => {

    const {commentId} = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400 , "Invalid comment Id")
    }

    const comment  = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError(400 , "Comment not found !")
    }
 });

export { getAllVideosComment, addComment, deleteComment, updateComment };
