import cron from "node-cron";
import { ReminderType } from "@/types/reminderType";
import {
  getAllPendingReminders,
  getReminderByUserId,
  updateReminder,
} from "@/app/db/databaseService";
import * as moment from "moment";
import "moment-timezone";
import { sendChatBotMsg } from "@/app/api/chatbot/route";
const cronSchedule = "* * * * *"; // Runs every minute

// Define the cron job function
export const cronTask = () => {
  //await processReminders()
};

// Start the cron job
cron.schedule(cronSchedule, processReminders);

export async function processReminders(): Promise<string> {
  console.log("Cron job executed at:", new Date());
  let dbRespons: ReminderType[] = await getAllPendingReminders();

  for (let i = 0; i < dbRespons.length; i++) {
    if (
      validateReminderDue(dbRespons[i].dueDate, dbRespons[i].timezone) &&
      dbRespons[i].status == "pending"
    ) {
      // Send Notification
      sendReminder(dbRespons[i]);
      console.log("reminder sent successfully");
      let reminder: ReminderType = dbRespons[i];
      let updatedReminder: ReminderType = {
        date: reminder.date,
        time: reminder.time,
        title: reminder.title,
        description: reminder.description,
        recurring: reminder.recurring,
        priority: reminder.priority,
        tags: reminder.tags,
        userId: reminder.userId,
        reminderId: reminder.reminderId,
        dueDate: reminder.dueDate,
        category: reminder.category,
        status: "completed",
        accountId: reminder.accountId,
        timezone: reminder.timezone,
      };
      await updateReminder(updatedReminder);
      console.log("saved updated reminder");
    }
  }
  return "success";
}

function validateReminderDue(date: string, timezone: string): boolean {
  if (!date || !timezone) {
    return false;
  }
  console.log("date :" + date);
  console.log("timezone :" + timezone);
  const currentDate = new Date(); // Get current date and time
  const currentDateISO = currentDate.toISOString(); // Convert to ISO format
  const reminderISO = moment
    .tz(date, "YYYY-MM-DD hh:mm:ss A", timezone)
    .toISOString();

  const systemDate: Date = new Date(currentDateISO);
  const reminderDate: Date = new Date(reminderISO);
  if (reminderDate < systemDate) {
    return true;
  } else {
    return false;
  }
}

export async function sendReminder(reminder: ReminderType) {
  console.log(
    `inside sendReminderNotification, reminder JSON = ${JSON.stringify(reminder)}`,
  );

  const contentStr = JSON.stringify({
    robot_jid: process.env.ZOOM_BOT_JID,
    to_jid: reminder.userId + "@xmpp.zoom.us",
    visible_to_user: reminder.userId,
    account_id: reminder.accountId,
    user_jid: reminder.userId + "@xmpp.zoom.us",
    content: {
      settings: {
        default_sidebar_color: "#0E72ED",
        is_split_sidebar: true,
      },
      head: {
        text: "Reminder",
      },
      body: [
        {
          type: "section",
          sections: [
            {
              type: "message",
              text: reminder.title,
              style: {
                bold: true,
              },
            },
            {
              type: "message",
              text: reminder.description
                ? reminder.description
                : reminder.title,
            },
          ],
        },
      ],
    },
  });

  sendChatBotMsg(contentStr);
}
