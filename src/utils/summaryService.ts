import { getFromAIService } from "@/utils/aiServiceClient";
import { getRemindersFromDB } from "@/utils/remaninderService";

export async function generateReminderSummary(
  userId: string,
  dueDate: string,
  status: string,
) {
  let reminders = await getRemindersFromDB(userId, dueDate, status);
  let aiResponse = "";
  let summary = "";
  if (reminders.length == 0) {
    summary =
      "There are no reminders available. please provide a response indicating that there no reminders without including the additional assistance message.";
    aiResponse = await getFromAIService(summary);
  } else {
    summary =
      "Please generate a Summary of Reminders without including the initial acknowledgment.\n";
    reminders.forEach((reminder, index) => {
      summary += `${index + 1}. \n`;
      summary += ` - Date: ${reminder.date}\n`;
      summary += ` - Time: ${reminder.time}\n`;
      summary += ` - Title: ${reminder.title}\n`;
      summary += ` - Description: ${reminder.description}\n\n`;
    });
    aiResponse = await getFromAIService(summary);
  }

  if (aiResponse.length > 0) {
    return aiResponse[0];
  }
  return aiResponse;
}
