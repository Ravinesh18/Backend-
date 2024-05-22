import mongoose , {isValidObjectId} from "mongoose";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


//getallvideos , getvideobyid , publishvideo , updatevideo , deletevideo , togglepublishstatus

const getAllVideos = asyncHandler(async(req,res)=>{

})



const getVideoByID = asyncHandler(async(req,res)=>{

    const {videoId} = req.params 

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400 , "Invalid video ID")
    }

    const video = await Video.findById(videoId).populate( 'owner' , 'username')

    if (!video) {
        throw new ApiError(400 , "Video not found!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , "Video fetched Successfully!")
    )

})

const publishVideo = asyncHandler(async(req,res)=>{
    const {title , description} = req.body

    if (!title && !description) {
        throw new ApiError(400 , "Title and Description is required !")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400 , "Video File is required !")
    }
    
    const videoFile  = await uploadOnCloudinary(videoLocalPath)

    if (!videoFile) {
        throw new ApiError(400 , "Video File is required !")
    }
    

    const video = new Video({
        title ,
        description ,
        videoFile : videoFile.url 
    })

     await video.save();

     if (!video) {
        throw new ApiError(400 , "Something went wring while uploading video !")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(video , "Video published successfully!")
        
     )
})

const updateVideo = asyncHandler(async(req,res)=>{
  const {videoId} = req.params

  const{title , description , thumbnail} = req.body

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400 , "Video Id not found !")
  }

  if (!title || !description || !thumbnail) {
    throw new ApiError(400 ,"Fill the required fields !")
  }

  const video = await Video.findByIdAndUpdate(
    videoId ,{
        $set:{
            title ,
            description ,
            thumbnail
        }
    },{
        new:true
    }
  )

return res
.status(200)
.json(
    new ApiResponse(200 , "Updated Video successfully!")
)
})

const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400 , "VideoId is invalid !")
    }
 
    const video = await Video.findByIdAndDelete(videoId);
 
    if (!video) {
     throw new ApiError(400 , "Video not found !")
    }
 
    return res 
    .status(200)
    .json(
     new ApiResponse(200 , "Video deleted successfully !")
    )
  
})

const togglePublishStatus  = asyncHandler(async(req,res)=>{

    const {videoId} = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400 , "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400 , "Video not found!")
    }
    
    video.isPublished = !video.isPublished;

    await video.save();

    return res
    .status(200)
    .json(
        200 , video ,  "Video toggled successfully !"
    )
})


export{
togglePublishStatus ,
updateVideo ,
deleteVideo ,
publishVideo ,
getAllVideos ,
getVideoByID

}