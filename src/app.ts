import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';
import { usersSeedData } from './db/seed/user.seed';
import { seedMultipleCollections } from './db/utils/seedMultipleCollections';
import {
  orderItemSeedData,
  orderSeedData,
  productCategoriesSeedData,
  productsSeedData,
  productTypeSeedData,
  reviewsSeedData,
  storeSeedData,
} from './db/seed';
import { attachAllIndices } from './db/utils/attachAllIndices';
import { indexingMapper } from './db/indexing/indexingMapper';
import { attachIndex } from './db/utils/attachIndex';

config();
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.w0gfkgp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db(process.env.DB_NAME);

export async function connectDb() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log('Connected');

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    //attachAllIndices(db, indexingMapper, attachIndex);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);
