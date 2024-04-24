import { NextRequest, NextResponse } from "next/server";

interface Reminder {
  data: string;
  time: string;
  note: { title: string; description: string };
  recurring: {
    type: string;
  };
  priority: string;
  tags: string[];
  userId: string;
  remainderId: string;
}

const reminders: Reminder[] = [
  {
    data: "2024-04-30",
    time: "10:00 AM",
    note: { title: "Meeting", description: "Monthly meeting with the team" },
    recurring: { type: "monthly" },
    priority: "1",
    tags: ["a", "b"],
    userId: "cnvbvmb",
    remainderId: "dfkkfggggg",
  },
  {
    data: "2024-04-30",
    time: "10:00 AM",
    note: { title: "Meeting", description: "Weekly meeting with the team" },
    recurring: { type: "weekly" },
    priority: "2",
    tags: ["x", "b"],
    userId: "cnvbvmb",
    remainderId: "dfkkfgggkgkg",
  },
];

export async function GET(request: NextRequest) {
  try {
    // Perform any asynchronous operations here (e.g., fetching data from a database) // For now, let's just return a sample remainder data
    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
