import { ReminderType, StatusEnum } from "@/types/reminderType";
import { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { useReminderStore } from "@/store/reminder-store";
import { SquareCheck } from "lucide-react";
import dayjs from "dayjs";
const ReminderItem = ({
  reminderId,
  description,
  status,
  dueDate,
  onClick,
}: ReminderType & { onClick: MouseEventHandler<HTMLButtonElement> }) => {
  const updateReminder = useReminderStore((state) => state.updateReminder);
  const curDate = dayjs(dueDate);
  const showDate = curDate.isAfter(dayjs().add(2, "day"));
  const isDone = status === StatusEnum.enum.DONE;

  return (
    <div className={"flex gap-2 items-center"}>
      <button
        className={
          "p-2 rounded-md flex items-center bg-white cursor-pointer flex-1 justify-between"
        }
        onClick={onClick}
      >
        <span className={isDone ? "line-through" : ""}>{description}</span>
        {showDate ? (
          <span className={"text-rose-600 text-xs"}>
            {curDate.format("MMM/DD")}
          </span>
        ) : null}
      </button>
      <Button
        variant={"ghost"}
        onClick={() => {
          updateReminder(reminderId, {
            status: isDone ? StatusEnum.enum.NONE : StatusEnum.enum.DONE,
          });
        }}
      >
        <SquareCheck className={isDone ? "text-gray-300" : ""} />
      </Button>
    </div>
  );
};

export default ReminderItem;
