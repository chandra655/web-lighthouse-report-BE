import { insightsRouter } from "./resources/insights";

import express from "express";
const apiRouter = express.Router();

apiRouter.use("/insights", insightsRouter);

export default apiRouter;
