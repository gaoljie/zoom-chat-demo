import { NextRequest, NextResponse } from "next/server";
import { getRemindersFromDB } from "@/utils/remaninderService";
export async function GET(request: NextRequest) {
  try {
    let reminders = await getRemindersFromDB();
    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
