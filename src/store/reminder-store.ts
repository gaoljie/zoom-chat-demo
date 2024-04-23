import { create } from "zustand";
import { ReminderType } from "@/types/reminderType";

export const useReminderStore = create<{
  reminderList: ReminderType[];
  addReminder: (reminder: ReminderType) => void;
  removeReminder: (id: string) => void;
  updateReminder: (reminder: ReminderType) => void;
}>((set) => ({
  reminderList: [
    {
      id: "1",
      note: "reminder 1",
    },
    {
      id: "2",
      note: "reminder 2",
    },
  ],
  addReminder: (reminder: ReminderType) =>
    set((state) => ({ reminderList: [...state.reminderList, reminder] })),
  removeReminder: (id: string) =>
    set((state) => ({
      reminderList: state.reminderList.filter((item) => item.id !== id),
    })),
  updateReminder: (reminder: ReminderType) =>
    set((state) => ({
      reminderList: state.reminderList.map((item) =>
        item.id === reminder.id ? reminder : item,
      ),
    })),
}));
