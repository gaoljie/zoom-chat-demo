import { NextRequest, NextResponse } from "next/server";
import { RecurringEnum, ReminderType } from "@/types/reminderType";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // List of reminders
    const reminders: ReminderType[] = [
      {
        date: "2024-04-30",
        time: "10:00 AM",
        title: "Meeting",
        description: "Monthly meeting with the team",
        recurring: RecurringEnum.enum.MONTHLY,
        priority: "1",
        tags: ["a", "b"],
        userId: "cnvbvmb",
        reminderId: "dfkkfggggg",
      },
      {
        date: "2024-04-30",
        time: "10:00 AM",
        title: "Meeting",
        description: "Weekly meeting with the team",
        recurring: RecurringEnum.enum.WEEKLY,
        priority: "2",
        tags: ["x", "b"],
        userId: "cnvbvmb",
        reminderId: "dfkkfgggkgkg",
      },
    ];
    // Generate the summary text - TODO call API service to retrieve the summary
    const summary = reminders
      .map(
        (reminder, index) =>
          `${index + 1}. Meeting at ${reminder.time} on ${reminder.date}: ${reminder.description}`,
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
