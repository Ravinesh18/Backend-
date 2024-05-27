import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";


const toggleVideoLike  = asyncHandler(async(req, res)=>{
    
    const {videoId} = req.params;

    if (!videoId) {
        throw new ApiError(400 , "VideoId ID is required!")
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400 , "Invalid Video Id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400 , "Video not found!")
    }
    const alreadyLiked = await Like.findOne({
        video : videoId ,
        likedBy : req.user._id
    })

    if (alreadyLiked) {
        const deleteLike = await Like.findByIdAndDelete(alreadyLiked._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200 , deleteLike , "Video Unliked Successfully!")
        )
    }

    const like  = await Like.create({
        video :videoId ,
        likedBy:req.user._id ,
    })

    if (!like) {
        throw new ApiError(400 , "Video cannot be Liked !")
    }

    return res 
    .status(200)
    .json(new ApiResponse(200 , like , "Video likd successfully"))
})


const toggleCommentLike  = asyncHandler(async(req, res)=>{


    const {commentId} = req.params

    if (!!commentId) {
        throw new ApiError(400 , "Comment Id is not found!")

    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400  , "Invalid Comment Id")
    }

    const comment  = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(400  , "Comment not found!")
    }

    const alreadyLiked = await Like.findOne({
        comment :commentId ,
        likedBy: req.user._id
    }) 

    if (alreadyLiked) {
        const deleteLike = await Like.findByIdAndDelete(alreadyLiked._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200 , deleteLike , "Comment unliked successfully")
        )
    }

    const like = await Like.create({
        comment :commentId ,
        likedBy:req.user._id,
    })

    if (!like) {
        throw new ApiError(400 , "Comment cannot be liked")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , like , "Comment liked successfully")
    )

     
})
const toggleTweetLike  = asyncHandler(async(req, res)=>{
    const {tweetId} = req.params

    if (!!tweetId) {
        throw new ApiError(400 , "Tweet Id is not found!")

    }

    if (!mongoose.Types.ObjectId.isValid(tweetIdId)) {
        throw new ApiError(400  , "Invalid Comment Id")
    }

    const tweet  = await Comment.findById(tweetIdId);

    if (!tweet) {
        throw new ApiError(400  , "Tweet not found!")
    }

    const alreadyLiked = await Like.findOne({
        tweet :tweetIdId ,
        likedBy: req.user._id
    }) 

    if (alreadyLiked) {
        const deleteLike = await Like.findByIdAndDelete(alreadyLiked._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200 , deleteLike , "Tweet unliked successfully")
        )
    }

    const like = await Like.create({
        tweet :tweetId ,
        likedBy:req.user._id,
    })

    if (!like) {
        throw new ApiError(400 , "Comment cannot be liked")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , like , "Comment liked successfully")
    )


})
const getLikedVideo  = asyncHandler(async(req, res)=>{
    const LikedVideo = await Like.aggregate([
        {
            $match:{
                likedBy:req.user._id,
                comment : null,
                tweet:null,
            },
        },
        {
            $lookup:{
                from:"videos",
                foreignField:"_id",
                localField:"video",
                as:"video",
                pipeline:[
                    {
                        $project:{
                            videoFile:1,
                            thumbnail:1,
                            title:1,
                            duration:1,
                            views:1,
                        },
                    },
                ],
            },
        },
        {
            $unwind:{
                path:"$video",
            },
        },
        {
            $unset:"likedBy"
            }
        
    ])

    if (LikedVideo.length==0) {
        return res 
        .status(200)
        .json(new ApiResponse(200 , null, "Liked Video not found!" ))
    }



    return res
    .status(200)
    .json(
        new ApiResponse(200 , LikedVideo , "Liked video fetched successfully!")
    )

})

export{
    toggleCommentLike ,
    toggleTweetLike ,
    toggleVideoLike ,
    getLikedVideo
}