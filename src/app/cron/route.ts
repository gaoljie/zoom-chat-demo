import {
  saveReminder,
  getReminder,
  getAllPendingReminders,
  getReminderByUserId,
} from "@/app/db/databaseService";
import * as moment from "moment-timezone";

import { NextApiRequest } from "next";
import { NextRequest } from "next/server";
import { ReminderType } from "@/types/reminderType";
import { processReminders, sendReminder } from "@/app/cronjob";

export async function GET(request: NextRequest) {
  console.log(`before calling DB, action `);
  await processReminders();
  return Response.json(await getReminder("Xyz12322423"));
}

export async function POST(request: NextRequest) {
  console.log(`before calling DB, action = $(method)`);
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as string;
  const id = searchParams.get("id") as string;
  let dbResponse = {};
  if (type === "create-reminder") {
    const reminder: ReminderType = await request.json();
    console.log(`reminder = ${JSON.stringify(reminder)}`);
    await saveReminder(reminder);
    dbResponse = "Saved!";
  } else {
    dbResponse = "invalid action";
  }

  return Response.json(dbResponse);
}
