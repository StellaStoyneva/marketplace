import { MongoClient, ServerApiVersion } from 'mongodb';

const {
  // MONGO_DB = 'test',
  MONGO_HOST = 'localhost',
  MONGO_PORT = '27017',
  MONGO_USER = 'contrast',
  MONGO_PASSWORD = 'password',
} = process.env;

const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function connectMongoDB(uri: string) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log('Connected');

    // Send a ping to confirm a successful connection
    await client.db().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    return (dbName: string) => client.db(dbName)
  } catch (e) {
    console.log('ERROR connecting DB', e);
    await client.close();
    process.exit(1);
  }
}

