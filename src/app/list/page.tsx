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
import { Textarea } from "@/components/ui/textarea";
import { FileIcon } from "@radix-ui/react-icons";
import { CalendarCheck, Archive } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import IsToday from "dayjs/plugin/isToday";

dayjs.extend(IsToday);

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

  const generate = () => {
    setDefaultFormValue({
      ...defaultValue,
      date: dayjs().add(1, "day").format("YYYY-MM-DD").toString(),
      time: dayjs().format("hh:mm A").toString(),
    });
  };

  useEffect(() => {
    if (message) {
      setDefaultFormValue({ ...defaultValue, description: message });
    }
  }, [message]);

  return (
    <div className={"flex justify-center"}>
      <div className={"grid pt-8 min-w-[400px]"}>
        <div className={"flex justify-center items-center gap-4 mb-4"}>
          <Textarea className={"bg-white"} />
          <Button className={"flex items-center gap-1"} onClick={generate}>
            <FileIcon className={"text-white"} />
            <span>Generate</span>
          </Button>
        </div>
        <Tabs defaultValue="today" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 bg-red-50">
            <TabsTrigger className={"flex gap-2"} value="today">
              <CalendarCheck />
              Today
            </TabsTrigger>
            <TabsTrigger className={"flex gap-2"} value="all">
              <Archive />
              All
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <div className={"grid gap-2 max-w-md w-full"}>
              {reminderList
                .filter((reminder) => {
                  return dayjs(reminder.date).isToday();
                })
                .map((reminder) => (
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
          </TabsContent>
          <TabsContent value="all">
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
          </TabsContent>
        </Tabs>
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
