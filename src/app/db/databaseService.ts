import { createRxDatabase } from "rxdb";
import { getRxStorageMongoDB } from "rxdb/plugins/storage-mongodb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";

const DB = await createRxDatabase({
  name: "hackathon_2024_db",
  storage: getRxStorageMemory(),
});

import { remindersSchema, userSchema } from "./dbschemas";
import { ReminderType, UserType } from "@/types/reminderType";

// const DB = await createRxDatabase({
//     name: 'hackathon_2024_db2',
//     storage: getRxStorageMongoDB({
//         /**
//          * MongoDB connection string
//          * @link https://www.mongodb.com/docs/manual/reference/connection-string/
//          */
//         connection: 'mongodb://localhost:27017'
//     }),
//     ignoreDuplicate: false,
// });

//add a collection
await DB.addCollections({
  reminders: {
    schema: remindersSchema,
  },
  users: {
    schema: userSchema,
  },
});

export async function getReminder(id: string): Promise<ReminderType[]> {
  console.log("inside getReminder() method");
  // run a query
  const result: ReminderType[] = await DB.reminders
    .find({
      selector: {
        id: id,
      },
    })
    .exec();
  console.log(`reminders from DB = ${JSON.stringify(result)}`);
  return result;
}

export async function saveReminder(reminder: ReminderType) {
  console.log("inside saveReminder() method");
  // insert a record.
  const result = await DB.reminders.insert({
    id: reminder.reminderId,
    name: reminder.title,
    description: reminder.description,
    category: reminder.category,
    status: reminder.status,
    dueDate: reminder.dueDate,
  });
  console.log(`Inserted Reminder to DB = ${JSON.stringify(result)}`);
  return result;
}

export async function updateReminder(reminder: ReminderType) {
  console.log("inside InsertAnimal() method");
  // insert a record.
  const reminderFromDB = await DB.users
    .findOne()
    .where("id")
    .eq(reminder.reminderId)
    .exec();
  if (reminderFromDB) {
    if (reminder.title) {
      reminderFromDB.name = reminder.title;
    }
    if (reminder.description) {
      reminderFromDB.description = reminder.description;
    }
    if (reminder.date) {
      reminderFromDB.dueDate = reminder.date;
    }
    if (reminder.status) {
      reminderFromDB.status = reminder.status;
    }
    await reminderFromDB.save();
  } else {
    console.log("reminder not found");
  }
  reminderFromDB.name = reminder.title;
  console.log(`Updated Reminder to DB = ${JSON.stringify(reminderFromDB)}`);
  return reminderFromDB;
}

export async function saveUser(user: UserType) {
  console.log("inside InsertAnimal() method");

  // run a query
  const result = await DB.users.insert({
    id: user.id,
    name: user.name,
    preference: user.preference,
  });
}

export async function updateUser(user: UserType) {
  console.log("inside InsertAnimal() method");
  const userFromDb = await DB.users.findOne().where("id").eq(user.id).exec();
  userFromDb.name = user.name;
  userFromDb.preference = user.preference;
  await userFromDb.save();

  console.log(`Updated User to DB = ${JSON.stringify(user)}`);
  return true;
}
