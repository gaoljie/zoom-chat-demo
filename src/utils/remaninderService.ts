import { getReminderByUserId } from "../app/db/databaseService";
export async function getRemindersFromDB(userId) {
  let remaindersByuserId = await getReminderByUserId(userId);
  return remaindersByuserId;
}
