import { db } from "~/middleware";

const userId = crypto.randomUUID();
await db.insertInto("user").values({
  id: userId,
  name: "slickback",
  email: "named@slickback.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  emailVerified: false,
})
.execute();
