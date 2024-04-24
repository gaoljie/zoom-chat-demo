import { database } from "@/app/db";

export async function POST(request: Request) {
  const reqjson = await request.json();
  console.log(JSON.stringify(reqjson));
  type User = {
    id: number;
    username: string;
    email: string;
  };
  var res: User[] = [];

  const sql = `INSERT INTO users (username, email) VALUES (?, ?)`;
  // Execute the SQL query with parameters
  var db = await database();
  db.run(sql, [reqjson.username, reqjson.email], function (err: Error) {
    if (err) {
      return console.error("Error inserting data:", err.message);
    }
    console.log(`Rows inserted ...`);
  });
  var result = [];
  let resp = await db.all(
    "SELECT * FROM users",
    [],
    (err: Error, rows: User[]) => {
      if (err) {
        throw err;
      }

      return rows;
    },
  );
  console.log("response", resp);

  await db.close();

  return Response.json(resp);
}
