import { NextRequest, NextResponse } from "next/server";
import { generateReminderFromAI } from "@/utils/generateReminderFromAI";

export async function POST(request: NextRequest) {
  const req: { text: string } = await request.json();
  let result = await generateReminderFromAI(req.text);
  return NextResponse.json(result);
}
