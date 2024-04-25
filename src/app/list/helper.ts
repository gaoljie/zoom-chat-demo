import { z } from "zod";
import { RecurringEnum } from "@/types/reminderType";

export const formSchema = z.object({
  reminderId: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  recurring: RecurringEnum,
  dueDate: z.string(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
