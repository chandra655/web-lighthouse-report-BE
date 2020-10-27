import path from "path";

require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

import express from "express";
import schedule from "node-schedule";
// import cron from "node-cron";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

schedule.scheduleJob("0 * */1 * * *", function () {
  const messageOptions = {
    from: "chandrapenugonda655@gmail.com",
    to: "chandra.penugonda@unacademy.com",
    subject: "Scheduled Email",
    text: `Hi there. This email was automatically sent by us. ${new Date()}`,
  };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });
  transporter.sendMail(messageOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email successfully sent!");
    }
  });
  urls.forEach((url) => {
    setTimeout(() => {
      getInsight(url).then(async (data) => {
        if (data) {
          await piDB.add({
            ...data,
            date: getDate(),
            routeId: crypto.createHash("sha1").update(url).digest("hex"),
          });
        } else {
          console.log("error");
        }
      });
    }, 60 * 1000);
  });
});

// cron.schedule("0 */6 * * *", () => {
//   const messageOptions = {
//     from: "chandrapenugonda655@gmail.com",
//     to: "chandra.penugonda@unacademy.com",
//     subject: "Scheduled Email",
//     text: `Hi there. This email was automatically sent by us. ${new Date()}`,
//   };

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     secure: false,
//     auth: {
//       user: process.env.email,
//       pass: process.env.password,
//     },
//   });

//   transporter.sendMail(messageOptions, function (error, info) {
//     if (error) {
//       throw error;
//     } else {
//       console.log("Email successfully sent!");
//     }
//   });
//   urls.forEach((url) => {
//     setTimeout(() => {
//       getInsight(url).then(async (data) => {
//         if (data) {
//           const output = await piDB.add({
//             ...data,
//             date: getDate(),
//             routeId: crypto.createHash("sha1").update(url).digest("hex"),
//           });
//         } else {
//           console.log("error");
//         }
//       });
//     }, 60 * 1000);
//   });
// });

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Application running at PORT ${PORT}`);
});
