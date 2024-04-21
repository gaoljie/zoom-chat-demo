import { ReminderType } from "@/types/reminderType";

const ReminderItem = ({ text }: ReminderType) => {
  return (
    <div className={"p-2 rounded-md flex items-center bg-white cursor-pointer"}>
      <span>{text}</span>
    </div>
  );
};

export default ReminderItem;
