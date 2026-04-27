import cron from "node-cron";
import { processEmailOutbox } from "../workers/emailWorker.js";

export const startEmailWorker = () => {
  cron.schedule("*/10 * * * * *", async () => {
    await processEmailOutbox();
  });

  console.log("Email worker started");
};
