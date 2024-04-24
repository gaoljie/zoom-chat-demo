import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // List of reminders
    const reminders = [
      {
        data: "2024-04-30",
        time: "10:00 AM",
        note: {
          title: "Meeting",
          description: "Monthly team meeting with the team",
        },
        recurring: { type: "monthly" },
        priority: "1",
        tags: ["a", "b"],
        userId: "cnvbvmb",
        remainderId: "dfkkfggggg",
      },
      {
        data: "2024-04-30",
        time: "11:00 AM",
        note: {
          title: "Meeting",
          description: "Weekly team meeting with the team",
        },
        recurring: { type: "weekly" },
        priority: "2",
        tags: ["x", "b"],
        userId: "cnvbvmb",
        remainderId: "dfkkfgggkgkg",
      },
    ];
    // Generate the summary text - TODO call API service to retrieve the summary
    const summary = reminders
      .map(
        (reminder, index) =>
          `${index + 1}. Meeting at ${reminder.time} on ${reminder.data}: ${reminder.note.description}`,
      )
      .join("\n");
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
