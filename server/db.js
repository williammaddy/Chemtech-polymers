import dns from 'node:dns';
import tls from 'node:tls';
import { MongoClient } from 'mongodb';

dns.setDefaultResultOrder('ipv4first');

const uri = process.env.MONGODB_URI || "mongodb+srv://cfearless485_db_user:cgtxpFX0jQtFZb1j@cluster0.btaeqbx.mongodb.net/?retryWrites=true&w=majority";
const dbName = process.env.MONGODB_DB_NAME || "chemtech_db";

const options = {
  maxPoolSize: 5,
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  family: 4,
  tls: true,
  secureContext: tls.createSecureContext({
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.2',
  }),
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableMongoError(err) {
  if (!err) return false;
  const labels = err.errorLabelSet;
  if (labels && (labels.has('RetryableError') || labels.has('SystemOverloadedError') || labels.has('ResetPool'))) {
    return true;
  }
  const name = err.name || '';
  const message = `${err.message || ''} ${err.cause?.message || ''} ${err.cause?.code || ''}`;
  return (
    name === 'MongoServerSelectionError' ||
    name === 'MongoNetworkError' ||
    name === 'MongoTopologyClosedError' ||
    /tlsv1 alert internal error/i.test(message) ||
    /ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR/i.test(message) ||
    /SystemOverloadedError/i.test(message) ||
    /ReplicaSetNoPrimary/i.test(message)
  );
}

async function resetClient() {
  const existing = global._mongoClient;
  global._mongoClient = null;
  global._mongoClientPromise = null;
  if (existing) {
    try {
      await existing.close(true);
    } catch {
      // ignore close errors from a dead pool
    }
  }
}

function connectClient() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClient = client;
    global._mongoClientPromise = client.connect().catch(async (err) => {
      await resetClient();
      throw err;
    });
  }
  return global._mongoClientPromise;
}

async function getHealthyClient() {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const client = await connectClient();
      await client.db('admin').command({ ping: 1 });
      return client;
    } catch (err) {
      lastErr = err;
      await resetClient();
      if (!isRetryableMongoError(err) || attempt === 3) break;
      await sleep(600 * 2 ** attempt);
    }
  }

  const reason = lastErr?.message || 'unknown connection error';
  const wrapped = new Error(
    `MongoDB Atlas connection failed after retries (${reason}). The cluster may be overloaded — wait a few seconds and try again.`
  );
  wrapped.cause = lastErr;
  throw wrapped;
}

export async function getClient() {
  return getHealthyClient();
}

export async function getDb() {
  const c = await getHealthyClient();
  return c.db(dbName);
}

export async function withDb(fn) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const db = await getDb();
      return await fn(db);
    } catch (err) {
      lastErr = err;
      if (!isRetryableMongoError(err) || attempt === 2) throw err;
      await resetClient();
      await sleep(600 * 2 ** attempt);
    }
  }
  throw lastErr;
}
