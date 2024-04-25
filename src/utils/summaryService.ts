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
      "There are no reminders available. please provide a response indicating that there no reminders excluding the dialogue and initial acknowledgment.";
    aiResponse = await getFromAIService(summary);
  } else {
    summary =
      "Please generate a Summary of Reminders in list format excluding the dialogue and initial acknowledgment.";
    reminders.forEach((reminder, index) => {
      summary += `${index + 1}.`;
      summary += ` - Date: ${reminder.date}`;
      summary += ` - Time: ${reminder.time}`;
      summary += ` - Title: ${reminder.title}`;
      summary += ` - Description: ${reminder.description}`;
    });
    aiResponse = await getFromAIService(summary);
  }

  if (aiResponse.length > 0) {
    return aiResponse[0];
  }
  return aiResponse;
}
