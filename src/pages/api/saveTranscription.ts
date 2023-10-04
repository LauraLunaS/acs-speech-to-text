import { MongoClient, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).end(); 
    }

    const text = req.body.text;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' }); 
    }

    const url = process.env.NEXT_PUBLIC_MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db("search-db");
        const collection = db.collection("speech");

        const item = {
            _id: new ObjectId(),
            speechId: uuidv4(),
            text
        };

        await collection.insertOne(item);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}
