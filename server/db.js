import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://cfearless485_db_user:cgtxpFX0jQtFZb1j@cluster0.btaeqbx.mongodb.net/?retryWrites=true&w=majority";
const dbName = process.env.MONGODB_DB_NAME || "chemtech_db";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect().catch((err) => {
    global._mongoClientPromise = null;
    throw err;
  });
}
clientPromise = global._mongoClientPromise;

export async function getClient() {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = null;
      throw err;
    });
  }
  return global._mongoClientPromise;
}

export async function getDb() {
  const c = await getClient();
  return c.db(dbName);
}

