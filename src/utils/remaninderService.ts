import { getReminderByUserId } from "../app/db/databaseService";
import { filterReminders } from "./apiUtils";
export async function getRemindersFromDB(
  userId: string,
  dueDate: string,
  status: string,
) {
  let remaindersByuserId = await getReminderByUserId(userId);
  console.log(
    "remainderService getRemindersFromDB ----->" + remaindersByuserId,
  );
  const filteredReminders = filterReminders(
    remaindersByuserId,
    dueDate,
    status,
  );
  console.log(
    "<-------remainderService getRemindersFromDB ----->" + filteredReminders,
  );
  return filteredReminders;
}
