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
import { RecurringEnum } from "@/types/reminderType";
import { TagsInput } from "@/components/tags-input";

const FormDialog = ({
  open,
  onOpenChange,
  defaultValues,
  setDefaultFormValue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: FormSchemaType;
  setDefaultFormValue: Dispatch<SetStateAction<FormSchemaType | null>>;
}) => {
  const { addReminder, updateReminder } = useReminderStore((state) => ({
    addReminder: state.addReminder,
    updateReminder: state.updateReminder,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!values.reminderId) {
      addReminder({
        reminderId: Math.random() + "",
        title: "",
        description: values.description,
        date: "2024-04-30",
        time: "10:00 AM",
        recurring: RecurringEnum.enum.NONE,
        priority: "1",
        tags: ["a", "b"],
        userId: "cnvbvmb",
      });
    } else {
      updateReminder({
        title: values.title,
        description: values.description,
        date: "2024-04-30",
        time: "10:00 AM",
        recurring: values.recurring,
        priority: "1",
        tags: ["a", "b"],
        userId: "cnvbvmb",
      });
    }

    setDefaultFormValue(null);
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
            <DatePicker control={form.control} name={"date"} label={"Date"} />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Time</FormLabel>
                  <FormControl>
                    <div className={"flex items-center w-[200px] gap-2"}>
                      <Select
                        onValueChange={(value) => {
                          field.onChange({
                            ...field.value,
                            hours: parseInt(value),
                          });
                        }}
                        defaultValue={field.value.hours + ""}
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
                          field.onChange({
                            ...field.value,
                            minutes: parseInt(value),
                          });
                        }}
                        defaultValue={field.value.minutes + ""}
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
                                  {index}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                </FormItem>
              )}
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
