import sqlite from "sqlite3";
const sqlite3 = sqlite.verbose();

// @ts-ignore
export async function database() {
  // @ts-ignore
  const db = new sqlite3.Database(
    "./database.db",
    sqlite3.OPEN_READWRITE,
    (err: any) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the SQLite database.");
    },
  );
  return db;
}
