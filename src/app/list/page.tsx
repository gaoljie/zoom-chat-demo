"use client";
import ReminderItem from "@/app/list/reminder-item";
import { Button } from "@/components/ui/button";
import FormDialog from "@/app/list/form-dialog";
import { Suspense, useEffect, useState } from "react";
import { useReminderStore } from "@/store/reminder-store";
import { useSearchParams } from "next/navigation";
import { get, post } from "@/utils/request";
import { RecurringEnum, ReminderType, StatusEnum } from "@/types/reminderType";
import { Textarea } from "@/components/ui/textarea";
import { CaretSortIcon, FileIcon } from "@radix-ui/react-icons";
import { CalendarCheck, Archive } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import IsToday from "dayjs/plugin/isToday";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SearchBar from "@/app/list/search-bar";
import { getUserId } from "@/utils/getUserId";

dayjs.extend(IsToday);

const List = () => {
  const defaultValue: ReminderType = {
    reminderId: "",
    title: "",
    description: "",
    category: "",
    tags: [],
    recurring: RecurringEnum.enum.NONE,
    userId: "",
    status: StatusEnum.enum.NONE,
    dueDate: dayjs().add(1, "day").toString(),
  };
  const { reminderList, resetReminder } = useReminderStore((state) => ({
    reminderList: state.reminderList,
    resetReminder: state.resetReminder,
  }));
  const [curReminder, setCurReminder] = useState<ReminderType | null>(null);
  const [prompt, setPrompt] = useState("");

  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const userId = searchParams.get("userId");
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
    if (!getUserId()) return;
    get<ReminderType[]>(`/api/reminder?userId=${getUserId()}`).then((res) => {
      console.log(res);
      resetReminder(res);
    });
  }, [resetReminder]);

  const generate = async () => {
    const promptReminder = await post("/api/ai", { json: { text: prompt } });
    console.log(promptReminder);
    setCurReminder({
      ...defaultValue,
      userId: getUserId(),
      description: promptReminder.title,
      dueDate: promptReminder.dueDate,
    });
  };

  useEffect(() => {
    if (message) {
      setCurReminder({
        ...defaultValue,
        userId: getUserId(),
        description: message,
      });
    }
  }, [message]);

  return (
    <div className={"flex justify-center"}>
      <div className={"grid pt-8 min-w-[400px]"}>
        <SearchBar
          reminders={reminderList}
          onClickHandler={(reminder) => {
            setCurReminder(reminder);
          }}
        />
        <div className={"flex justify-center items-center gap-4 mb-4"}>
          <Textarea
            className={"bg-white"}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Button className={"flex items-center gap-1"} onClick={generate}>
            <FileIcon className={"text-white"} />
            <span>Generate</span>
          </Button>
        </div>
        <Tabs defaultValue="today" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3 bg-red-50">
            <TabsTrigger className={"flex gap-2"} value="today">
              <CalendarCheck />
              Today
            </TabsTrigger>
            <TabsTrigger className={"flex gap-2"} value="tomorrow">
              <CalendarCheck />
              Tomorrow
            </TabsTrigger>
            <TabsTrigger className={"flex gap-2"} value="all">
              <Archive />
              All
            </TabsTrigger>
          </TabsList>
          <ReminderTabContent
            value={"today"}
            reminders={reminderList.filter((reminder) => {
              return dayjs(reminder.dueDate).isToday();
            })}
            onClickHandler={(reminder) => {
              setCurReminder(reminder);
            }}
          />
          <ReminderTabContent
            value={"tomorrow"}
            reminders={reminderList.filter((reminder) => {
              return dayjs(reminder.dueDate).subtract(1, "day").isToday();
            })}
            onClickHandler={(reminder) => {
              setCurReminder(reminder);
            }}
          />
          <ReminderTabContent
            value={"all"}
            reminders={reminderList}
            onClickHandler={(reminder) => {
              setCurReminder(reminder);
            }}
          />
        </Tabs>
      </div>
      {curReminder ? (
        <FormDialog
          open
          onOpenChange={(open) => {
            if (!open) setCurReminder(null);
          }}
          curReminder={curReminder}
          setCurReminder={setCurReminder}
        />
      ) : null}
    </div>
  );
};

const ReminderTabContent = ({
  reminders,
  value,
  onClickHandler,
}: {
  reminders: ReminderType[];
  value: string;
  onClickHandler: (reminder: ReminderType) => void;
}) => {
  return (
    <TabsContent value={value}>
      <div className={"grid gap-2 max-w-md w-full"}>
        {reminders
          .filter((i) => i.status === StatusEnum.enum.NONE)
          .map((reminder) => (
            <ReminderItem
              key={reminder.reminderId}
              {...reminder}
              onClick={() => {
                onClickHandler(reminder);
              }}
            />
          ))}
      </div>
      <Collapsible
        // open={isOpen}
        // onOpenChange={setIsOpen}
        className={"grid gap-2 max-w-md w-full mt-5"}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={"flex justify-between px-0"}
          >
            <span>Completed</span>
            <div className={"flex items-center"}>
              <span>
                {
                  reminders.filter((i) => i.status === StatusEnum.enum.DONE)
                    .length
                }
              </span>
              <CaretSortIcon className="h-4 w-4" />
            </div>
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          {reminders
            .filter((i) => i.status === StatusEnum.enum.DONE)
            .map((reminder) => (
              <ReminderItem
                key={reminder.reminderId}
                {...reminder}
                onClick={() => {
                  onClickHandler(reminder);
                }}
              />
            ))}
        </CollapsibleContent>
      </Collapsible>
    </TabsContent>
  );
};

const ListPage = () => (
  <Suspense>
    <List />
  </Suspense>
);

export default ListPage;
