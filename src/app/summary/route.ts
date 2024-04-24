import { NextRequest, NextResponse } from "next/server";
import { RecurringEnum, ReminderType } from "@/types/reminderType";
import { getFromAIService } from "@/utils/aiServiceClient";

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
        time: "11:00 AM",
        title: "Meeting",
        description: "Weekly meeting with the team",
        recurring: RecurringEnum.enum.WEEKLY,
        priority: "2",
        tags: ["x", "b"],
        userId: "cnvbvmb",
        reminderId: "dfkkfgggkgkg",
      },
    ];

    let summary = "Summary of Reminders:\n";
    reminders.forEach((reminder, index) => {
      summary += `${index + 1}. ${reminder.title} at ${reminder.time} on ${reminder.date}: ${reminder.description}\n`;
    });

    let aiResponse = await getFromAIService(summary);
    return NextResponse.json(aiResponse, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
