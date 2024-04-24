import { NextRequest, NextResponse } from "next/server";
import { generateReminderSummary } from "@/utils/summaryService";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    let aiResponse = await generateReminderSummary();
    return NextResponse.json(aiResponse, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
