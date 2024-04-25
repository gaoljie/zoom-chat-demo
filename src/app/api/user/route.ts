import { NextRequest, NextResponse } from "next/server";
import { saveUser, updateUser } from "../../db/databaseService";
import { UserType } from "@/types/reminderType";

export async function POST(request: NextRequest) {
  const req: UserType = await request.json();
  let result = await saveUser(req);
  console.log(`result of create = ${result}`);
  console.log(` request body, inside create user = ${JSON.stringify(req)}`);
  return NextResponse.json(req);
}

export async function PATCH(request: NextRequest) {
  const req: UserType = await request.json();
  let result = await updateUser(req);
  console.log(`result of update = ${result}`);
  console.log(` request body, inside update reminder = ${JSON.stringify(req)}`);
  return NextResponse.json(result);
}
