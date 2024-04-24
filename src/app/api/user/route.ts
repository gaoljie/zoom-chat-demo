import { NextRequest, NextResponse } from "next/server";
import { saveUser } from "../../db/databaseService";
import { ReminderType, UserType } from "@/types/reminderType";
import { uuid } from "../../../utils/apiUtils";

export async function POST(request: NextRequest) {
  const req: UserType = await request.json();
  req["userId"] = uuid();
  let result = await saveUser(req);
  console.log(`result of create = ${result}`);
  console.log(` request body, inside create user = ${JSON.stringify(req)}`);
  return NextResponse.json(req);
}
