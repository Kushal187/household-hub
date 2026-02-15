import 'dotenv/config';
import { MongoClient } from 'mongodb';

export function myMongoDB({
dbName = 'household-hub',
COLLECTION_NAME = 'test',
} = {}) {
    const me = {};
    const uri = process.env.MONGODB_URI;

    const connect = () => {
    const client = new MongoClient(uri);
    const test = client.db(dbName).collection(COLLECTION_NAME);

    return { client, test };

    }

    me.getData = async () => {
    const { client, test } = connect();
    try {
        await client.connect();
        const data = await test.find({}).toArray();
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
    }
    
    
    return me;
}