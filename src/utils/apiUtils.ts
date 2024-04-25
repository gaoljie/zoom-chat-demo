// @ts-nocheck
export function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}

export function filterReminders(reminders, status, dueDate) {
  console.log("filterReminders------>");
  if (!reminders || reminders.length == 0) {
    return [];
  }
  // Filter by status
  let filteredReminders = reminders.filter((reminder) => {
    if (status === "DONE") {
      return reminder.status === "DONE";
    } else if (status === "NONE") {
      return reminder.status === "NONE";
    } else {
      return true; // No status filter
    }
  }); // Filter by due date
  if (dueDate === "today") {
    const today = new Date().toISOString().split("T")[0];
    filteredReminders = filteredReminders.filter((reminder) => {
      const reminderDueDate = reminder.dueDate.split("T")[0];
      return reminderDueDate === today;
    });
  } else if (dueDate === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split("T")[0];
    filteredReminders = filteredReminders.filter((reminder) => {
      const reminderDueDate = reminder.dueDate.split("T")[0];
      return reminderDueDate === tomorrowDateString;
    });
  }
  console.log("<-----filterReminders");
  return filteredReminders;
}

export function extractDateKeywords(text) {
  const regex = /\b(?:tomorrow|today)\b/gi;
  const matches = text.match(regex);
  return matches ? matches[0] : null;
}
