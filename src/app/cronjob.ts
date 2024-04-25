import cron from "node-cron";

// Define your cron job schedule
const cronSchedule = "* * * * *"; // Runs every minute

// Define the cron job function
export const cronTask = () => {
  console.log("Cron job executed at:", new Date());
  // Perform your task here
};

// Start the cron job
cron.schedule(cronSchedule, cronTask);
