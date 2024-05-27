import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

//add comment , delete comment , update comment , get all video comment

const getAllVideosComment = asyncHandler(async (req, res) => {
   const {videoId} = req.params
   const {page ,limit} = req.query

   if (!videoId) {
    throw new ApiError(400 ,"Video Id is required")
   }
   
   if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400 , "Invalid Video Id")
   }

   const video = await Video.findById(videoId)
   
   if (!video) {
    throw new ApiError(400 , "Video not found!")
   }
    
   const videoComments = await Comment.aggregate([
    {
      $match:{
        video:new mongoose.Types.ObjectId(videoId)
      },
    },
    {
      $lookup:{
        from :"users",
        foreignField:"_id",
        localField:"owner",
        as:"owner",
        pipeline:[
          {
            $project:{
              username : 1 ,
              avatar:1 ,
              fullname :1,
            },
          },
        ],

      },
    },
    {
      $addFields:{
        owner:{
          $first:"$owner",
        },
      },
    },
    {
      $skip:(parseInt(page)-1)*parseInt(limit),
    },
    {
      $limit:parseInt(limit),
    },
   ])


   if (videoComments.length==0) {
    return res.status(200).json(
      new ApiResponse(
        200 , {} , "Video has no comments !"
      )
    )
   }


   return res.status(200).json(
    new ApiResponse(200 , videoComments , "Comments fetched Successfully !")
   )

});
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
