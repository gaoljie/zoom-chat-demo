import { ReminderType, StatusEnum } from "@/types/reminderType";
import { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { useReminderStore } from "@/store/reminder-store";
import { Square, SquareCheck } from "lucide-react";
import dayjs from "dayjs";
import { patch } from "@/utils/request";
const ReminderItem = ({
  reminderId,
  title,
  status,
  dueDate,
  onClick,
}: ReminderType & { onClick: MouseEventHandler<HTMLButtonElement> }) => {
  const updateReminder = useReminderStore((state) => state.updateReminder);
  const curDate = dayjs(dueDate);
  const isDone = status === StatusEnum.enum.DONE;

  return (
    <div className={"flex gap-2 items-center"}>
      <button
        className={
          "p-2 rounded-md flex items-center bg-white cursor-pointer flex-1 justify-between"
        }
        onClick={onClick}
      >
        <span className={isDone ? "line-through" : ""}>{title}</span>
        <span className={"text-rose-600 text-xs"}>
          {curDate.format("MMM/DD HH:mm")}
        </span>
      </button>
      <Button
        variant={"ghost"}
        onClick={async () => {
          await patch("/api/reminder", {
            json: {
              reminderId,
              status: isDone ? StatusEnum.enum.NONE : StatusEnum.enum.DONE,
            },
          });

          updateReminder(reminderId, {
            status: isDone ? StatusEnum.enum.NONE : StatusEnum.enum.DONE,
          });
        }}
      >
        {isDone ? <SquareCheck className={"text-gray-300"} /> : <Square />}
      </Button>
    </div>
  );
};

export default ReminderItem;
