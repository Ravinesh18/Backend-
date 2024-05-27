import mongoose from "mongoose";
import {User} from '../models/user.model.js';
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getChannelStats = asyncHandler(async(req,res)=>{
    const userId  = req.user._id;


    //subscriber count
    const subscriberCount  = await Video.countDocuments({
        channel : userId,
    })

    //videos count 
    const vdeosCount  = await Video.countDocuments({
        owner : userId,
    })

    const likesCount = await Like.aggregate([
        {
            $match:{
                comment :null,
                tweet : null
            },
        },
        {
            $lookup:{
                from:"videos",
                foreignField:"_id",
                localField:"video",
                as:"video"
            },
        },
        {
            $unwind:"$video"
        },
        {
            $match:{
                "video.owner":new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $count:"totalLikes",
        }
    ])


    const totalLikes = likesCount.length>0?likesCount[0].totalLikes:0;

    //views count 

    const viewsCount  = await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            },
        },{

            $group:{
              _id:null,
              viewsCount:{
                $sum:"$views"
              },
            },
        },
    ])


    const totalViews = viewsCount>0?viewsCount[0].viewsCount:0;


    const channelGeneralInfo = await User.findById(userId).select(
        "-password -refreshToken"
    )



    return res 
    .status(200)
    .json(
        new ApiResponse(
        200 , {
            subscriberCount ,
            likesCount : totalLikes ,
            vdeosCount ,
            viewsCount : totalViews ,
            channelGeneralInfo
        },
        "Channel stats fetched successfully !"
    )
    )
})

const getChannnelVideos = asyncHandler(async(req, res)=>{
       
    const userId  = req.user._id ;


    const userVideo = await Video.find(
        {
            owner:userId ,
        }
    ).select("-owner -__v");


    if (userVideo.length===0) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , 
                {} , "User has no videos uploaded"
            )

        )
    }

    return res.status(200).json(
        new ApiResponse(200 , userVideo , "User Video fetched Successfully!")
    )


})

export {
    getChannelStats ,
    getChannnelVideos
}