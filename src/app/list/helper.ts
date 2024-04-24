import { z } from "zod";
import { RecurringEnum } from "@/types/reminderType";

export const formSchema = z.object({
  reminderId: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  recurring: RecurringEnum,
  time: z.string(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
export const defaultValue: FormSchemaType = {
  reminderId: "",
  title: "",
  description: "",
  date: "2024-04-30",
  tags: [],
  time: "10:00 AM",
  recurring: RecurringEnum.enum.NONE,
};
