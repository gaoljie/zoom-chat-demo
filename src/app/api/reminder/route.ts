import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();

  // call service method to create
  console.log(` request body inside create reminder = ${JSON.stringify(req)}`);

  return NextResponse.json(req);
}

export async function GET(request: NextRequest) {
  // call service method to list reminders
  console.log("inside list reminders");

  return NextResponse.json({ list: "remiders" });
}
