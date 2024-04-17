import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinry } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser  = asyncHandler(async (req, res)=>{
     //get user data from frontend 
     //validation - not empty
     //check if user already exist - username , email
     //check for image , avtar , 
     //upload them to cloudinary , avtar
     //create user object - create entry in db
     //remove password and refresh token field from rsponse 
     //check for user creation
     //return res

   const {fullname , email , username , password } = req.body
   console.log("Email : ",email)

    
   //One of the way to validate all the field in a single if statement  or you can go with multiple if statement

   if (
    [fullname , email , username , password].some((field)=>
  field?.trim()=="")
   ) {
    throw new ApiError(400 , "All field are required !")
    
   }



  const existeduser =  User.findOne({
    $or:[{username},{email}]
   })


   if(existeduser){
    throw new ApiError(409 , "User with email or username already exist !")
   }


   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar file is required !")

   }

   const avatar = await uploadOnCloudinry(avatarLocalPath);
   const coverImage = await uploadOnCloudinry(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400 ,  "Avatar file is required !")
   }

   const user = User.create({
    fullname ,
    avatar : avatar.url ,
    coverImage : coverImage?.url || "" ,
    email ,
    password ,
    username : username.toLowerCase()
   })



   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )


   if(!createdUser){
    throw new ApiError(500 , "Something went wrong while registering the user !")
   }


   return res.status(201).json(
    new ApiResponse(200 , createdUser , "User Registered Successfully !")
   )
})

export {
    registerUser
}

