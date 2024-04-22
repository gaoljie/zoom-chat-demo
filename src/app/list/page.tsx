"use client";
import ReminderItem from "@/app/list/reminder-item";
import { Button } from "@/components/ui/button";
import FormDialog from "@/app/list/form-dialog";
import { useState } from "react";
import { defaultValue, FormSchemaType } from "@/app/list/helper";
import { useReminderStore } from "@/store/reminder-store";

const List = () => {
  const reminders = useReminderStore((state) => state.reminderList);
  const [open, setOpen] = useState(false);
  const [defaultFormValue, setDefaultFormValue] =
    useState<FormSchemaType | null>(null);
  return (
    <div className={"flex justify-center"}>
      <div className={"grid pt-8 min-w-[400px]"}>
        <div className={"flex justify-center mb-4"}>
          <Button onClick={() => setDefaultFormValue(defaultValue)}>Add</Button>
        </div>
        <div className={"grid gap-2 max-w-md w-full"}>
          {reminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              {...reminder}
              onClick={() => {
                setDefaultFormValue({ ...defaultValue, ...reminder });
              }}
            />
          ))}
        </div>
      </div>
      {defaultFormValue ? (
        <FormDialog
          open
          onOpenChange={(open) => setDefaultFormValue(null)}
          defaultValues={defaultFormValue}
          setDefaultFormValue={setDefaultFormValue}
        />
      ) : null}
    </div>
  );
};

export default List;
