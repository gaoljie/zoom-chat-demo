import { z } from "zod";
import { RecurringEnum } from "@/types/reminderType";

export const formSchema = z.object({
  reminderId: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  tags: z.array(z.string()),
  recurring: RecurringEnum,
  time: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
});

export type FormSchemaType = z.infer<typeof formSchema>;
export const defaultValue: FormSchemaType = {
  reminderId: "",
  title: "",
  description: "",
  date: new Date(),
  tags: [],
  time: {
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  },
  recurring: RecurringEnum.enum.NONE,
};
