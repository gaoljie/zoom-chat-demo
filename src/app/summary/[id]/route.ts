import { NextRequest, NextResponse } from "next/server";
import { generateReminderSummary } from "@/utils/summaryService";
type Params = {
  id: string;
};
export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    const userId = context.params.id;
    let aiResponse = await generateReminderSummary(userId, "", "");
    return NextResponse.json(aiResponse, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
