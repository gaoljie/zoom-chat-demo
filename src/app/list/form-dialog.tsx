import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/date-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formSchema, FormSchemaType } from "@/app/list/helper";
import { useReminderStore } from "@/store/reminder-store";
import { Dispatch, SetStateAction } from "react";
import { RecurringEnum, ReminderType } from "@/types/reminderType";
import { TagsInput } from "@/components/tags-input";
import dayjs from "dayjs";
import { get, patch, post } from "@/utils/request";
import { getUserId } from "@/utils/getUserId";

const FormDialog = ({
  open,
  onOpenChange,
  curReminder,
  setCurReminder,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curReminder: ReminderType;
  setCurReminder: Dispatch<SetStateAction<ReminderType | null>>;
}) => {
  const { addReminder, updateReminder, resetReminder } = useReminderStore(
    (state) => ({
      addReminder: state.addReminder,
      updateReminder: state.updateReminder,
      resetReminder: state.resetReminder,
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: curReminder,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!values.reminderId) {
      await post("/api/reminder", {
        json: {
          ...values,
          dueDate: dayjs(values.dueDate).format("YYYY-MM-DD HH:MM:ss"),
        },
      });
    } else {
      await patch("/api/reminder", {
        json: {
          ...values,
          dueDate: dayjs(values.dueDate).format("YYYY-MM-DD HH:MM:ss"),
        },
      });
    }
    const newList = await get<ReminderType[]>(
      `/api/reminder?userId=${getUserId()}`,
    );

    resetReminder(newList);
    setCurReminder(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reminder</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id={"reminder-form"}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Note</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DatePicker
              control={form.control}
              name={"dueDate"}
              label={"Date"}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => {
                const date = dayjs(field.value);
                return (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Time</FormLabel>
                    <FormControl>
                      <div className={"flex items-center w-[200px] gap-2"}>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(
                              date.set("hour", parseInt(value)).toString(),
                            );
                          }}
                          defaultValue={date.hour() + ""}
                        >
                          <SelectTrigger aria-label="Hour" id="hour">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Array(24)
                                .fill(null)
                                .map((_, index) => (
                                  <SelectItem key={index} value={index + ""}>
                                    {index}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        :
                        <Select
                          onValueChange={(value) => {
                            field.onChange(
                              date.set("minute", parseInt(value)).toString(),
                            );
                          }}
                          defaultValue={date.minute() + ""}
                        >
                          <SelectTrigger aria-label="Minute" id="minute">
                            <SelectValue placeholder="Minute" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Array(60)
                                .fill(null)
                                .map((_, index) => (
                                  <SelectItem key={index} value={index + ""}>
                                    {index + ""}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Recurring</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger aria-label="Recurring" id="recurring">
                        <SelectValue placeholder="Recurring" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={RecurringEnum.enum.NONE}>
                            None
                          </SelectItem>
                          <SelectItem value={RecurringEnum.enum.DAILY}>
                            Daily
                          </SelectItem>
                          <SelectItem value={RecurringEnum.enum.WEEKLY}>
                            Weekly
                          </SelectItem>
                          <SelectItem value={RecurringEnum.enum.MONTHLY}>
                            Monthly
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 gap-4">
                  <FormLabel className="text-right mt-2">Tags</FormLabel>
                  <FormControl>
                    <TagsInput
                      className={"col-span-3"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button form={"reminder-form"} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
