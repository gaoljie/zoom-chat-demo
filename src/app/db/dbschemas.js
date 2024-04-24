const remindersSchema = {
  title: "reminders",
  description: "it contains all reminders for the app",
  version: 0,
  primaryKey: "id",
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
    name: {
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
    date: {
      type: "string",
      format: "date-time",
    },
  },
};

const userSchema = {
  title: "User schema",
  description: "describes User",
  version: 0,
  primaryKey: "id",
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
