import { getReminderByUserId } from "../app/db/databaseService";
import { filterReminders } from "./apiUtils";
export async function getRemindersFromDB(
  userId: string,
  dueDate: string,
  status: string,
) {
  let remaindersByuserId = await getReminderByUserId(userId);
  const filteredReminders = filterReminders(
    remaindersByuserId,
    dueDate,
    status,
  );
  return filteredReminders;
}
