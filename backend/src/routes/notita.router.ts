import { getAllNotitas, getNotitaById, postNotita, putNotita, deleteNotita } from "../controllers/notita.controller";
import express from "express";

const router = express.Router();

router.get("/", getAllNotitas);
router.get("/:id", getNotitaById);
router.post("/", postNotita);
router.put("/:id", putNotita);
router.delete("/:id", deleteNotita);

export default router;