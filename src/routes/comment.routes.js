import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment ,
    deleteComment ,
    getAllVideosComment ,
    updateComment
} from "../controllers/comment.controller.js"

const router = Router();
router.use(verifyJWT);

router.route("/:videoId").post(addComment).get(getAllVideosComment)

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;