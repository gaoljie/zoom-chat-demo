import { z } from "zod";

export const RecurringEnum = z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]);
export const StatusEnum = z.enum(["NONE", "DONE"]);

export type ReminderType = {
  date?: string;
  time?: string;
  title: string;
  description: string;
  recurring: z.infer<typeof RecurringEnum>;
  tags: string[];
  userId: string;
  reminderId: string;
  dueDate: string;
  category: string;
  status: z.infer<typeof StatusEnum>;
};

export type UserType = {
  userId: string;
  name: string;
  preference: string;
};
