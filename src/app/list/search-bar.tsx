"use client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ChangeEventHandler, useRef, useState } from "react";
import { useOnClickOutside } from "@/utils/useOnClickOutside";
import { ReminderType } from "@/types/reminderType";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";

const SearchBar = ({
  reminders,
  onClickHandler,
}: {
  reminders: ReminderType[];
  onClickHandler: (reminder: ReminderType) => void;
}) => {
  const [focus, setFocus] = useState(false);
  const [list, setList] = useState<ReminderType[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    setFocus(false);
  });

  const searchOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value.toLowerCase();
    if (value) {
      setList(
        reminders
          .filter(
            (item) =>
              item.description.toLowerCase().includes(value) ||
              item.title.toLowerCase().includes(value),
          )
          .slice(0, 10),
      );
    } else {
      setList([]);
    }
  };
  return (
    <div className="w-full mb-4 sm:max-w-[300px] relative" ref={ref}>
      <div
        className={cn(
          "rounded-3xl flex gap-2 items-center px-4 shadow-[0_2px_5px_1px_rgba(64,60,67,.16)] bg-white",
          list.length && focus && "rounded-b-none",
        )}
      >
        <MagnifyingGlassIcon width={20} height={20} />
        <Input
          className="border-none shadow-none p-0 text-base focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-transparent"
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            // setFocus(false);
          }}
          onChange={searchOnChange}
        />
      </div>
      <div
        className={cn(
          "w-full border-t p-4 hidden absolute bg-background rounded-b-3xl shadow-[0_9px_8px_-3px_rgba(64,60,67,.24),8px_0_8px_-7px_rgba(64,60,67,.24),-8px_0_8px_-7px_rgba(64,60,67,.24)]",
          list.length && focus && "block",
        )}
      >
        <ul className="grid gap-2">
          {list.map((item) => (
            <li
              key={item.reminderId}
              className={"cursor-pointer"}
              onClick={() => {
                onClickHandler(item);
              }}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
