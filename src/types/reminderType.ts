import { z } from "zod";

export const RecurringEnum = z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]);

export type ReminderType = {
  date: string;
  time: string;
  title: string;
  description: string;
  recurring: z.infer<typeof RecurringEnum>;
  priority: string;
  tags: string[];
  userId: string;
  reminderId: string;
  dueDate: string;
  category: string;
  status: string;
  accountId: string;
  timezone: string;
};

export type UserType = {
  userId: string;
  name: string;
  preference: string;
};
