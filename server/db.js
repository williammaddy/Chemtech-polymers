import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://cfearless485_db_user:cgtxpFX0jQtFZb1j@cluster0.btaeqbx.mongodb.net/?retryWrites=true&w=majority";
const dbName = process.env.MONGODB_DB_NAME || "chemtech_db";

let client = null;
let clientPromise = null;

export async function getClient() {
  if (!clientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    clientPromise = client.connect().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }
  return clientPromise;
}

export async function getDb() {
  const c = await getClient();
  return c.db(dbName);
}
