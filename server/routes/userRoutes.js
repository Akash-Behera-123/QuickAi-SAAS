import express from "express";
import {
    getPublishedCreations,
    getUserCreations,
    toggleLikeCreation,
    getUserData
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations', auth, getUserCreations);
userRouter.get('/get-published-creations', auth, getPublishedCreations);

// FIXED
userRouter.post('/toggle-like-creation', auth, toggleLikeCreation);

userRouter.get('/get-user-data', auth, getUserData);

export default userRouter;