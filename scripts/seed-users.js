import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const DATA_DIR = "/vercel/share/v0-project/data";
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function seed() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const adminPassword = await bcrypt.hash("admin1234", 10);

  const users = [
    {
      id: "user_1",
      username: "demoUser",
      password: demoPassword,
      role: "user",
      leagueId: "league_1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_admin",
      username: "admin",
      password: adminPassword,
      role: "admin",
      leagueId: "league_1",
      createdAt: new Date().toISOString(),
    },
  ];

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log("Seeded users:", users.map((u) => u.username).join(", "));
}

seed().catch(console.error);
