import { createRxDatabase } from "rxdb";
import { getRxStorageMongoDB } from "rxdb/plugins/storage-mongodb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";

const DB = await createRxDatabase({
  name: "hackathon_2024_db",
  storage: getRxStorageMemory(),
});

import { heroSchema, animalSchema } from "./dbschemas";

// const DB = await createRxDatabase({
//     name: 'hackathon_2024_db',
//     storage: getRxStorageMongoDB({
//         /**
//          * MongoDB connection string
//          * @link https://www.mongodb.com/docs/manual/reference/connection-string/
//          */
//         connection: 'mongodb://localhost:27017'
//     })
// });

// add a collection
await DB.addCollections({
  users: {
    schema: heroSchema,
  },
  animals: {
    schema: animalSchema,
  },
});

export async function getUserFromDB(name: string) {
  console.log("inside getDBTest() method");

  // run a query
  const result = await DB.users
    .find({
      selector: {
        name: name,
      },
    })
    .exec();

  console.log(`user from DB = ${JSON.stringify(result)}`);

  return result;
}

export async function insertUserToDB(name: string, color: string) {
  console.log("inside InsertAnimal() method");

  // insert a record.
  const result = await DB.users.insert({
    name: name,
    color: color,
  });

  console.log(`Inserted animal to DB = ${JSON.stringify(result)}`);

  return result;
}

export async function insertAnimalToDB(name: string, owner: string) {
  console.log("inside InsertAnimal() method");

  // run a query
  const result = await DB.animals.insert({
    name: name,
    owner: owner,
  });

  console.log(`Inserted animal to DB = ${JSON.stringify(result)}`);

  return result;
}
