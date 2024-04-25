import { NextRequest, NextResponse } from "next/server";
import { getReminderByUserId, saveReminder } from "../../db/databaseService";
import { ReminderType } from "@/types/reminderType";
//import { v4 as uuidv4 }  from "uuid";
import { uuid } from "../../../utils/apiUtils";

export async function POST(request: NextRequest) {
  const req: ReminderType = await request.json();
  req["reminderId"] = uuid();
  let result = await saveReminder(req);
  console.log(`result of create = ${result}`);
  console.log(` request body, inside create reminder = ${JSON.stringify(req)}`);
  return NextResponse.json(req);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") as string;
  // call service method to list reminders
  console.log(`inside list reminders API, userId = ${userId}`);
  if (!userId) {
    return NextResponse.json({ message: "userId query param is missing" });
  }
  let result = await getReminderByUserId(userId);
  console.log(`list reminders result = ${result}`);

  return NextResponse.json(result);
}
