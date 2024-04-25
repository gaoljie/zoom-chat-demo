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

export async function GET(request: NextRequest) {
  console.log(`before calling DB, action `);
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as string;
  const id = searchParams.get("id") as string;

  let dbResponse = {};
  if (type === "get-reminder") {
    dbResponse = await getReminderByUserId(id);
    console.log(`dbResponse = ${dbResponse}`);
  } else {
    dbResponse = "invalid action";
  }

  // Assuming your date and time string in the specified format and timezone are in variables
  const inputDateTimeString: string = "2024-04-24 12:00:00 PM"; // Example input date and time string

  const prevDate: string = "2024-04-24 11:59:00 PM"; // Example input date and time string

  const inputTimeZone: string = "America/New_York"; // Example input timezone

  // Convert to ISO format with the specified timezone
  const isoDateTimeString = moment
    .tz(inputDateTimeString, "YYYY-MM-DD hh:mm:ss A", inputTimeZone)
    .toISOString();
  const prevIsoDateTimeString = moment
    .tz(prevDate, "YYYY-MM-DD hh:mm:ss A", inputTimeZone)
    .toISOString();

  // Convert ISO strings to Date objects
  const date1: Date = new Date(isoDateTimeString);
  const date2: Date = new Date(prevIsoDateTimeString.split(" ")[0]);
  console.log(`date1 = ${date1}`);

  // Compare dates
  if (date1 < date2) {
    console.log("date1 is earlier than date2");
  } else if (date1 > date2) {
    console.log("date1 is later than date2");
  } else {
    console.log("date1 is equal to date2");
  }
  return Response.json(dbResponse);
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
