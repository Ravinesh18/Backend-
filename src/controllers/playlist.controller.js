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
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
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
