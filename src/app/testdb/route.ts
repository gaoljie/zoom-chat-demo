import {
  saveReminder,
  getReminder,
  getAllPendingReminders,
} from "@/app/db/databaseService";

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
    dbResponse = await getAllPendingReminders();
    console.log(`dbResponse = ${dbResponse}`);
  } else {
    dbResponse = "invalid action";
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
