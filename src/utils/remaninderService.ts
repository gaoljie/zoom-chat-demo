import { getReminderByUserId } from "../app/db/databaseService";
export async function getRemindersFromDB(userId: string) {
  let remaindersByuserId = await getReminderByUserId(userId);
  return remaindersByuserId;
}
