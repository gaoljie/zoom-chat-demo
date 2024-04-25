import { NextRequest, NextResponse } from "next/server";
import {getReminder, deleteReminder, updateReminder} from "../../../db/databaseService";
import { ReminderType, UserType } from "@/types/reminderType";
type Params = {
  id: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  const reminderId = context.params.id;
  // call service method to get reminder and return.
  console.log(`reminder id , inside get = ${reminderId}`);
  let reminderObjFromDB = await getReminder(reminderId);
  console.log(`reminderObjFromDB = ${reminderObjFromDB}`);
  return NextResponse.json(reminderObjFromDB?reminderObjFromDB:{});
}

export async function DELETE(
  request: NextRequest,
  context: { params: Params },
) {
  const reminderId = context.params.id;
  // call service method to delete reminder and return.
  console.log(`reminder id , inside delete = ${reminderId}`);
  let reminderObjFromDB = await deleteReminder(reminderId);
  return NextResponse.json(reminderObjFromDB);
}

export async function PATCH(request: NextRequest, context: { params: Params }) {
  const reminderId = context.params.id;
  // call service method to update reminder and return.
  console.log(`reminder id, inside patch = ${reminderId}`);
  const req : ReminderType = await request.json();
  req.reminderId = reminderId;
  let reminderObjFromDB = await updateReminder(req);

  return NextResponse.json(reminderObjFromDB);
}
