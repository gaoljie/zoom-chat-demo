import {
  getUserFromDB,
  insertAnimalToDB,
  insertUserToDB,
} from "@/app/db/databaseService";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") as string;
  const name = searchParams.get("name") as string;
  const owner = searchParams.get("owner") as string;
  const color = searchParams.get("color") as string;

  console.log(`before calling DB, action = ${action}`);

  let dbResponse = {};
  if (action === "get-user") {
    dbResponse = await getUserFromDB(name);
  } else if (action === "insert-animal") {
    dbResponse = await insertAnimalToDB(name, owner);
  } else if (action === "insert-user") {
    dbResponse = await insertUserToDB(name, color);
  } else {
    dbResponse = "unknown action. please check the usage of this API.";
  }
  console.log(`dbResponse = ${dbResponse}`);
  return Response.json(dbResponse);
}
