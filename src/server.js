import path from "path";

require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

import express from "express";
import cron from "node-cron";
import cors from "cors";
import crypto from "crypto";

import { getInsight } from "./utils/getSpeedInsights";
import { urls } from "./constants/urls";
import firebase from "./firebase/init";
import apiRouter from "./api";
import { getDate } from "./utils/dates";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());
const piDB = firebase.firestore().collection("performance-results");

cron.schedule(
  "0 0 */12 * * *",
  () => {
    urls.forEach((url) => {
      setTimeout(() => {
        getInsight(url).then(async (data) => {
          if (data) {
            const di = await piDB.add({
              ...data,
              date: getDate(),
              routeId: crypto.createHash("sha1").update(url).digest("hex"),
            });
            console.log(di);
          }
        });
      }, 60 * 1000);
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Application running at PORT ${PORT}`);
});
