import ReminderItem from "@/app/list/reminder-item";
import { Button } from "@/components/ui/button";

const reminders = [
  {
    id: 1,
    text: "reminder 1",
  },
  {
    id: 2,
    text: "reminder 2",
  },
];
const List = () => {
  return (
    <div className={"flex justify-center"}>
      <div className={"grid pt-8 min-w-[400px]"}>
        <div className={"flex justify-center mb-4"}>
          <Button>Add</Button>
        </div>
        <div className={"grid gap-2 max-w-md w-full"}>
          {reminders.map((reminder) => (
            <ReminderItem key={reminder.id} {...reminder} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
