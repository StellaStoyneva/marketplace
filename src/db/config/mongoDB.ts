import { MongoClient, ServerApiVersion } from 'mongodb';
import { CollectionEnum } from '../enum/collection.enum';
import { indexingMapper } from '../indexing/indexingMapper';
import { attachIndex } from '../utils/attachIndex';

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.w0gfkgp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const mongoDB = client.db(process.env.DB_NAME);

export async function connectMongoDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log('Connected');

    // Send a ping to confirm a successful connection
    await mongoDB.command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    //attachAllIndices(mongoDB, indexingMapper, attachIndex);
    // await seedCollection(mongoDB, CollectionEnum.Products, productsSeedData);
    //attachIndex(mongoDB, CollectionEnum.Products, indexingMapper);
    // console.log(
    //   await mongoDB.collection(CollectionEnum.Products).countDocuments()
    // );

    // console.log(
    //   await mongoDB
    //     .collection(CollectionEnum.Products)
    //     .countDocuments({ ratingAverage: 2.41 })
    // );
    //await client.close();
  } catch (e) {
    console.log('ERROR connecting DB', JSON.stringify(e));
    await client.close();
    process.exit(1);
  }
}
