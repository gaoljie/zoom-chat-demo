import { ReminderType } from "@/types/reminderType";
import { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { useReminderStore } from "@/store/reminder-store";
import { SquareCheck } from "lucide-react";
const ReminderItem = ({
  reminderId,
  description,
  onClick,
}: ReminderType & { onClick: MouseEventHandler<HTMLButtonElement> }) => {
  const removeReminder = useReminderStore((state) => state.removeReminder);
  return (
    <div className={"flex gap-2 items-center"}>
      <button
        className={
          "p-2 rounded-md flex items-center bg-white cursor-pointer flex-1"
        }
        onClick={onClick}
      >
        <span>{description}</span>
      </button>
      <Button variant={"ghost"} onClick={() => removeReminder(reminderId)}>
        <SquareCheck />
      </Button>
    </div>
  );
};

export default ReminderItem;
