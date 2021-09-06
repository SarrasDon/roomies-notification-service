import { MongoClient } from "mongodb";
import { MONGODB_URI } from "./config";

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }
  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = client.db();
  return cachedDb;
}
