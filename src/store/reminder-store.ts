import { create } from "zustand";
import { ReminderType } from "@/types/reminderType";

export const useReminderStore = create<{
  reminderList: ReminderType[];
  addReminder: (reminder: ReminderType) => void;
  resetReminder: (reminders: ReminderType[]) => void;
  removeReminder: (id: string) => void;
  updateReminder: (id: string, reminder: Partial<ReminderType>) => void;
}>((set) => ({
  reminderList: [],
  resetReminder: (reminders: ReminderType[]) => {
    set({ reminderList: reminders });
  },
  addReminder: (reminder: ReminderType) =>
    set((state) => ({ reminderList: [...state.reminderList, reminder] })),
  removeReminder: (id: string) =>
    set((state) => ({
      reminderList: state.reminderList.filter((item) => item.reminderId !== id),
    })),
  updateReminder: (id, reminder: Partial<ReminderType>) =>
    set((state) => ({
      reminderList: state.reminderList.map((item) =>
        item.reminderId === id ? { ...item, ...reminder } : item,
      ),
    })),
}));
