import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const aiRoutes = Router();

aiRoutes.use(authMiddleware);

aiRoutes.route("/ai/grammar-check")
    .post();
aiRoutes.route("/ai/summarize").post();
aiRoutes.route("/ai/enhance").post();
aiRoutes.route("/ai/complete").post();
aiRoutes.route("/ai/suggestions").post();

export default aiRoutes;