import { ObjectId } from "mongoDb";
import { connectToDatabase } from "../dbConnection";
import { createNotification, pushNotifications } from "../webPushSend";

async function sendNotification(event, context) {
  const record = event.Records[0];
  const { payload } = JSON.parse(record.body);

  const { amount, person, reason } = payload;

  const db = await connectToDatabase();

  const user = await db.collection("users").findOne({
    _id: ObjectId(person),
  });

  const reasonObj = await db.collection("expensereasons").findOne({
    _id: ObjectId(reason),
  });

  const subs = await db
    .collection("notification-subs")
    .find({ userId: { $nin: [ObjectId(person)] } })
    .project({ createAt: 0, _id: 0 })
    .toArray();

  const name = user ? user.name : "";
  const reasonName = reasonObj ? reasonObj.reason : "";

  const notification = createNotification(name, amount, reasonName);
  await pushNotifications({ subs, notification });

  return payload;
}

export const handler = sendNotification;
