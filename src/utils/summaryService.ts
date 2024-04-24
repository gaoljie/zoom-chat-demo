import { RecurringEnum, ReminderType } from "@/types/reminderType";
import { getFromAIService } from "@/utils/aiServiceClient";

const reminders: ReminderType[] = [
  {
    date: "2024-04-30",
    time: "10:00 AM",
    title: "GO Deployment",
    description: "Montly Deployment ",
    recurring: RecurringEnum.enum.MONTHLY,
    priority: "1",
    tags: ["a", "b"],
    userId: "cnvbvmb",
    reminderId: "dfkkfggggg",
  },
  {
    date: "2024-04-30",
    time: "11:00 AM",
    title: "Meeting",
    description: "Weekly meeting with the team",
    recurring: RecurringEnum.enum.WEEKLY,
    priority: "2",
    tags: ["x", "b"],
    userId: "cnvbvmb",
    reminderId: "dfkkfgggkgkg",
  },
  {
    date: "2024-04-30",
    time: "11:00 AM",
    title: "Meeting",
    description: "1:1 meeting",
    recurring: RecurringEnum.enum.NONE,
    priority: "2",
    tags: ["x", "b"],
    userId: "cnvbvmb",
    reminderId: "dfkkfgggkgkg",
  },
];
export async function generateReminderSummary() {
  let summary = "Summary of Reminders:\n";
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
