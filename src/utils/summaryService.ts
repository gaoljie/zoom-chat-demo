import { RecurringEnum, ReminderType } from "@/types/reminderType";
import { getFromAIService } from "@/utils/aiServiceClient";
import { getRemindersFromDB } from "@/utils/remaninderService";

export async function generateReminderSummary() {
  let reminders = await getRemindersFromDB();
  let summary =
    "Please generate a Summary of Reminders without including the initial acknowledgment:\n";
  reminders.forEach((reminder, index) => {
    summary += `${index + 1}. \n`;
    summary += ` - Date: ${reminder.date}\n`;
    summary += ` - Time: ${reminder.time}\n`;
    summary += ` - Title: ${reminder.title}\n`;
    summary += ` - Description: ${reminder.description}\n\n`;
  });
  let aiResponse = await getFromAIService(summary);
  return aiResponse;
}
