import { NextRequest, NextResponse } from "next/server";
import { saveReminder } from "../../db/databaseService";
import { ReminderType, UserType } from "@/types/reminderType";
//import { v4 as uuidv4 }  from "uuid";
import { uuid } from "../../../utils/apiUtils";

export async function POST(request: NextRequest) {
  const req: ReminderType = await request.json();
  // Generate a random UUID
  // const random_uuid = uuidv4();
  const random_uuid = uuid();
  // Print the UUID
  console.log(random_uuid);

  req["reminderId"] = random_uuid;

  let result = await saveReminder(req);

  console.log(`result of create = ${result}`);
  console.log(` request body, inside create reminder = ${JSON.stringify(req)}`);

  return NextResponse.json(req);
}

export async function GET(request: NextRequest) {
  // call service method to list reminders
  console.log("inside list reminders");

  return NextResponse.json({ list: "remiders" });
}
