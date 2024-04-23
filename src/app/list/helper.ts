import { z } from "zod";

export const RecurringEnum = z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]);

export const formSchema = z.object({
  id: z.string(),
  note: z.string(),
  date: z.date(),
  recurring: RecurringEnum,
  time: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
});

export type FormSchemaType = z.infer<typeof formSchema>;
export const defaultValue: FormSchemaType = {
  id: "",
  note: "",
  date: new Date(),
  time: {
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  },
  recurring: RecurringEnum.enum.NONE,
};
