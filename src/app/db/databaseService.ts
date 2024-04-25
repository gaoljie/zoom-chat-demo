import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMongoDB } from "rxdb/plugins/storage-mongodb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";

import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

// const DB = await createRxDatabase({
//   name: "hackathon_2024_db",
//   storage: getRxStorageMemory(),
// });

import { RxDBUpdatePlugin } from "rxdb/plugins/update";

import { remindersSchema, userSchema } from "./dbschemas";
import {
  RecurringEnum,
  ReminderType,
  StatusEnum,
  UserType,
} from "@/types/reminderType";
import _ from "lodash";
addRxPlugin(RxDBUpdatePlugin);

const DB = process.env.MONGO_DB_CONNECTION
  ? await createRxDatabase({
      name: "hackathon_2024_db2",
      storage: getRxStorageMongoDB({
        connection: process.env.MONGO_DB_CONNECTION,
      }),
      ignoreDuplicate: false,
    })
  : await createRxDatabase({
      name: "hackathon_2024_db",
      storage: getRxStorageMemory(),
    });

//add a collection
await DB.addCollections({
  reminders: {
    schema: remindersSchema,
  },
  users: {
    schema: userSchema,
  },
});

export async function getReminder(id: string): Promise<ReminderType> {
  console.log("inside getReminder() method id: ", id);
  // run a query
  const result: ReminderType = await DB.reminders
    .findOne({
      selector: {
        reminderId: id,
      },
    })
    .exec();
  console.log(`reminders from DB = ${JSON.stringify(result)}`);
  return result;
}

export async function deleteReminder(id: string): Promise<ReminderType> {
  console.log("inside getReminder() method id: ", id);
  // run a query
  const result = await DB.reminders
    .findOne({
      selector: {
        reminderId: id,
      },
    })
    .exec();
  if (result) {
    result.remove();
    console.log(`reminder removed from DB = ${JSON.stringify(result)}`);
  }
  return result;
}

export async function getReminderByUserId(id: string): Promise<ReminderType[]> {
  console.log("inside getReminderByUserId() method , id: ", id);
  // run a query
  const result: ReminderType[] = await DB.reminders
    .find({
      selector: {
        userId: id,
      },
    })
    .exec();
  console.log(`reminders from DB = ${JSON.stringify(result)}`);
  return result;
}

export async function getAllPendingReminders(): Promise<ReminderType[]> {
  console.log("inside getAllPendingReminders() method id: ");
  // run a query
  const result: ReminderType[] = await DB.reminders
    .find({
      selector: {
        status: "NONE",
      },
    })
    .exec();
  console.log(`reminders from DB = ${JSON.stringify(result)}`);
  return result;
}

export async function getCompletedReminders(): Promise<ReminderType[]> {
  console.log("inside getCompletedReminders() method id: ");
  // run a query
  const result: ReminderType[] = await DB.reminders
    .find({
      selector: {
        status: "completed",
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
    reminderId: reminder.reminderId,
    userId: reminder.userId,
    title: reminder.title,
    description: reminder.description,
    category: reminder.category,
    timezone: reminder.timezone,
    accountId: reminder.accountId,
    status: reminder.status || StatusEnum.enum.NONE,
    dueDate: reminder.dueDate || new Date(),
    recurring: reminder.recurring || RecurringEnum.enum.NONE,
    tags: reminder.tags || [],
  });
  console.log(`Inserted Reminder to DB = ${JSON.stringify(result)}`);
  return result;
}

export async function updateReminder(reminder: ReminderType) {
  console.log(
    `inside updateReminder() method, reminder obj = ${JSON.stringify(reminder)}`,
  );
  console.log(
    `inside updateReminder() method, reminder.reminderId = ${reminder.reminderId}`,
  );
  // insert a record.
  const reminderFromDB = await DB.reminders
    .findOne({
      selector: {
        reminderId: reminder.reminderId,
      },
    })
    .exec();
  console.log(` reminder from  DB, ${reminderFromDB}`);
  if (reminderFromDB) {
    console.log(`save reminder to  DB, ${reminderFromDB}`);
    let updatedReminder: {
      accountId: string;
      timezone: string;
      dueDate: string;
      description: string;
      title: string;
      category: string;
      userId: string;
      status: string;
    } = {
      userId: reminder.userId,
      title: reminder.title,
      description: reminder.description,
      category: reminder.category,
      status: reminder.status,
      dueDate: reminder.dueDate,
      timezone: reminder.timezone,
      accountId: reminder.accountId,
    };

    console.log(_.omitBy(updatedReminder, _.isNil));
    await reminderFromDB.patch(_.omitBy(updatedReminder, _.isNil));
  } else {
    console.log("reminder not found");
  }
  console.log(`Updated Reminder to DB = ${JSON.stringify(reminderFromDB)}`);
  return reminderFromDB;
}

export async function saveUser(user: UserType) {
  console.log("inside InsertUser() method");

  // run a query
  const result = await DB.users.insert({
    userId: user.userId,
    name: user.name,
    preference: user.preference,
    at: user.at,
    rt: user.rt,
  });
}

export async function updateUser(user: Partial<UserType>) {
  console.log("inside updateUser() method");
  const userFromDb = await DB.users
    .findOne({
      selector: {
        userId: user.userId,
      },
    })
    .exec();

  if (!userFromDb) {
    return;
  } else {
    const userObjToUpdate: Partial<UserType> = {};
    userObjToUpdate.name = user.name;
    userObjToUpdate.preference = user.preference;
    userObjToUpdate.at = user.at;
    userObjToUpdate.rt = user.rt;
    //const res = await userFromDb.save();
    // return await userFromDb.update({
    //   $set: userObjToUpdate,
    // });
    await userFromDb.patch(_.omitBy(userObjToUpdate, _.isNil));
    console.log(`Updated User to DB = ${JSON.stringify(user)}`);
  }
}

export async function getUser(userId: string) {
  return await DB.users
    .findOne({
      selector: {
        userId: userId,
      },
    })
    .exec();
}
