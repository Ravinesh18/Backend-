import mongoose from "mongoose"
import {Subscription} from "../models/subscription.model.js"
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async(req,res)=>{
    const {channelId} = req.params 

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400 , "Invalid Channel ID")
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(400 , "Channel not found!")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber : req.user._id,
        channel  : channelId
    })

    if (existingSubscription) {
        const unSubscribeChannel = await Subscription.findByIdAndDelete(
            existingSubscription._id
        )

        return res
        .status(200)
        .json(
            new ApiResponse(200 , unSubscribeChannel , "Channel Unsubscribed successfully!")
        )
    }
    else{
        const newSubscription = await Subscription.create({
            subscriber:req.user._id ,
            channel : channelId
        })

        return res.status(200)
        .json(
        new ApiResponse(200 , newSubscription , "Channel Subscribed Successfully")
        )
    }
})

const getSubscribedChannel  = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params 

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400 , "Invalid subscriber Id")
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match:{
                subscriber:subscriberId ,
            },
        },
        {
            $lookup:{
                from :"users",
                foreignField:"_id",
                localField:"channel",
                as:"subscribedChannel",
                pipeline:[
                    {
                        $project:{
                            username :1,
                            email:1,
                            fullname :1,
                            avatar:1 ,
                        },
                    },
                ],
            },
        },{
            $project:{
                subscribedChannels:1 , 
            }
        }
    ])


    if (subscribedChannels.length==0) {
        return res.status(200).json(
            new ApiResponse(200 , null , "You are not subscribed to any channel!")
        )
    }


    return res.status(200)
    .json(
        new ApiResponse(200 , subscribedChannels[0] , "Subscribedd Channel Fetched Successfully!")
    )

})

const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.params 

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400 , "Invalid Channel Id")
    }

    const channelSubscribers = await Subscription.aggregate([
        {
            $match:{
                channel:channelId ,
            },
        },
        {
            $lookup:{
                from:"users",
                foreignField:"_id",
                localField:"subscriber",
                as:"channelSubscribers",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            email:1,
                            fullname:1,
                            avatar:1,
                        },
                    },
                ],
            },
        },
        {
            $project:{
                channelSubscribers:1,
            }
        }
    ])


    if (channelSubscribers.length==0) {
        return res.status(200)
    .json(
        new ApiResponse(200 , null , "Channel has no Subscriber !")
    )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , channelSubscribers[0] , "Channel Subscribers fetched successfully !")
    )
})

export{
    toggleSubscription ,
    getSubscribedChannel ,
    getUserChannelSubscribers
}