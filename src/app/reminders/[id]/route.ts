import { NextRequest, NextResponse } from "next/server";
import { getRemindersFromDB } from "@/utils/remaninderService";
type Params = {
  id: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const userId = context.params.id;
    let reminders = await getRemindersFromDB(userId, "", "");
    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
