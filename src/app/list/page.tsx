"use client";
import ReminderItem from "@/app/list/reminder-item";
import { Button } from "@/components/ui/button";
import FormDialog from "@/app/list/form-dialog";
import { Suspense, useEffect, useState } from "react";
import { defaultValue, FormSchemaType } from "@/app/list/helper";
import { useReminderStore } from "@/store/reminder-store";
import { useSearchParams } from "next/navigation";
import { get } from "@/utils/request";
import { ReminderType } from "@/types/reminderType";

const List = () => {
  const { reminderList, resetReminder } = useReminderStore((state) => ({
    reminderList: state.reminderList,
    resetReminder: state.resetReminder,
  }));
  const [defaultFormValue, setDefaultFormValue] =
    useState<FormSchemaType | null>(null);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    get<ReminderType[]>("/reminders").then((res) => {
      resetReminder(res);
    });
  }, [resetReminder]);

  useEffect(() => {
    if (message) {
      setDefaultFormValue({ ...defaultValue, description: message });
    }
  }, [message]);

  return (
    <div className={"flex justify-center"}>
      <div className={"grid pt-8 min-w-[400px]"}>
        <div className={"flex justify-center mb-4"}>
          <Button onClick={() => setDefaultFormValue(defaultValue)}>Add</Button>
        </div>
        <div className={"grid gap-2 max-w-md w-full"}>
          {reminderList.map((reminder) => (
            <ReminderItem
              key={reminder.reminderId}
              {...reminder}
              onClick={() => {
                setDefaultFormValue({
                  ...defaultValue,
                  title: reminder.title,
                  description: reminder.description,
                  tags: reminder.tags,
                });
              }}
            />
          ))}
        </div>
      </div>
      {defaultFormValue ? (
        <FormDialog
          open
          onOpenChange={(open) => {
            if (!open) setDefaultFormValue(null);
          }}
          defaultValues={defaultFormValue}
          setDefaultFormValue={setDefaultFormValue}
        />
      ) : null}
    </div>
  );
};

const ListPage = () => (
  <Suspense>
    <List />
  </Suspense>
);

export default ListPage;
