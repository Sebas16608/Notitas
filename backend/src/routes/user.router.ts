import { Router } from "express";
import { register, login, getUsers, refreshToken } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/", authenticateToken, getUsers);

export default router;
