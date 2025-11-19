import { Router } from "express";
import { signup, login, refresh } from "./auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);

export default router;
