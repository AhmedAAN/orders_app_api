import { UserController } from "../controllers/userController";
import express from "express";

const router = express.Router();

router.get("/:id");
router.delete("/:id");
router.post("/login", UserController.login);
router.post("/get-code", UserController.getCode);
router.post("/check-code", UserController.checkCode);
router.post("/sign-up", UserController.signUp);
router.post("/guest", UserController.createGuest);

export default router;
