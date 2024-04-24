import { NextRequest, NextResponse } from "next/server";
import { RecurringEnum, ReminderType } from "@/types/reminderType";

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

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
