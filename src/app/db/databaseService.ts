import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMongoDB } from "rxdb/plugins/storage-mongodb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { remindersSchema, userSchema } from "./dbschemas";
import {
  RecurringEnum,
  ReminderType,
  StatusEnum,
  UserType,
} from "@/types/reminderType";
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

/*const DB = await createRxDatabase({
  name: "hackathon_2024_db2",
  storage: getRxStorageMongoDB({
    /!**
     * MongoDB connection string
     * @link https://www.mongodb.com/docs/manual/reference/connection-string/
     *!/
    connection: "mongodb://localhost:27017",
  }),
  ignoreDuplicate: false,
});*/

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
        status: "pending",
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
  console.log(` reminder from  DB, ${JSON.stringify(reminderFromDB)}`);
  if (reminderFromDB) {
    const reminderObtToUpdate: Partial<ReminderType> = {};
    if (reminder.title) {
      reminderObtToUpdate.title = reminder.title;
    }
    if (reminder.description) {
      reminderObtToUpdate.description = reminder.description;
    }
    if (reminder.dueDate) {
      reminderObtToUpdate.dueDate = reminder.dueDate;
    }
    if (reminder.status) {
      reminderObtToUpdate.status = reminder.status;
    }

    if (reminder.dueDate) {
      reminderObtToUpdate.dueDate = reminder.dueDate;
    }

    if (reminder.recurring) {
      reminderObtToUpdate.recurring = reminder.recurring;
    }

    if (reminder.tags) {
      reminderObtToUpdate.tags = reminder.tags;
    }
    console.log(`save reminder to  DB, ${reminderObtToUpdate}`);

    return await reminderFromDB.update({
      $set: reminderObtToUpdate,
    });
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
  });
}

export async function updateUser(user: UserType) {
  console.log("inside InsertAnimal() method");
  const userFromDb = await DB.users
    .findOne()
    .where("id")
    .eq(user.userId)
    .exec();
  userFromDb.name = user.name;
  userFromDb.preference = user.preference;
  await userFromDb.save();

  console.log(`Updated User to DB = ${JSON.stringify(user)}`);
  return true;
}
