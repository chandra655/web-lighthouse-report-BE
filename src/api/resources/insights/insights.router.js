import express from "express";
import insightsController from "./insights.controller";

export const insightsRouter = express.Router();

insightsRouter.route("/").get(insightsController.findAll);

insightsRouter.route("/:routeId").get(insightsController.findAllByRoute);
