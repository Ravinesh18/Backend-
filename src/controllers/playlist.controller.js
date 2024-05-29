import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Playlist Name is required!");
  }

  if (!description) {
    throw new ApiError(400, "Description is required!");
  }

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(400, "Could not create playlist !");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created!"));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const userPlaylist = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "videos",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  if (userPlaylist.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Couldnt find any playlist!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "User Playlist fetched successfully! ")
    );
});
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist Id required!");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid Playlist ID");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup:{
        from:"videos",
        foreignField:"_id",
        localField:"videos",
        as:"videos",
        pipeline:[
          {
            $lookup:{
              from:"users",
              foreignField:"_id",
              localField:"owner",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    username:1,
                    fullname:1,
                    avatar:1,
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
        ],
      },  
    }
  ]);

  if (playlist.length==0) {
    throw new ApiError(400 , "Playlist not found!")
  }

  return res.status(200).json(
    new ApiResponse(200 , playlist[0] , "Playlist Fetched Successfully!")
  )
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400 , "Playlist ID required!")
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400 , "Playlist ID is invalid!")
  }

  const deletePlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletePlaylist) {
    throw new ApiError(400 , "Playlist not found!")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200 , deletePlaylist , "Playlist Succesfully deleted!")
  )
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const {name , description} = req.body

  if (!playlistId) {
    throw new ApiError(400 , "Playlist ID is required!")
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400 , "Invaid playlist ID")
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
  throw new ApiError(400 , "Playlist not found!")
  }

  const updatePlaylist = await Playlist.findByIdAndUpdate(
    playlist._id,{
      name : name ? name :playlist.name,
      description : description ? description : playlist.description,
    },{
      new : true
    }
  )

  if (!updatePlaylist) {
    throw new ApiError(400 , "Playlist not updated!")
  }

  return res.status(200).json(
    new ApiResponse(200 , updatePlaylist , "Playlist updated successfully!")
  )
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist Id not found");
  }
  if (!videoId) {
    throw new ApiError(400, "Video Id not found");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist Id is not valid");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video Id is not valid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video is already present in playlist");
  }

  playlist.videos.push(videoId);

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    playlist,
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(400, "Video can not be added");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "video added to playlist succcessfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist Id not found");
  }
  if (!videoId) {
    throw new ApiError(400, "Video Id not found");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist Id is not valid");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video Id is not valid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not found in playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(400, "video can not be removed from the playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video removed from playlist successfully"
      )
    );
});

export {
  createPlaylist,
  getPlaylistById,
  getUserPlaylist,
  deletePlaylist,
  updatePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
