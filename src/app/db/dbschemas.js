const { z } = require("zod");
const { RecurringEnum } = require("@/types/reminderType");
const remindersSchema = {
  title: "reminders",
  description: "it contains all reminders for the app",
  version: 0,
  primaryKey: "reminderId",
  type: "object",
  properties: {
    reminderId: {
      type: "string",
      primary: true,
      maxLength: 100,
    },
    userId: {
      type: "string",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
    },
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
    category: {
      type: "string",
    },
    status: {
      type: "string",
    },
    dueDate: {
      type: "string",
      format: "date-time",
    },
    priority: {
      type: "string",
      format: "date-time",
    },
  },
};

const userSchema = {
  title: "User schema",
  description: "describes User",
  version: 0,
  primaryKey: "userId",
  type: "object",
  properties: {
    userId: {
      type: "string",
      primary: true,
      maxLength: 100,
    },
    preference: {
      type: "string",
    },
    name: {
      type: "string",
    },
  },
};

module.exports = { remindersSchema, userSchema };
