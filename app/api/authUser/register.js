// pages/api/register.js

import { hash } from 'bcryptjs';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await hash(password, 10);

    const uri = "mongodb+srv://aakash:FMTeGe40LV2l1nNP@cluster0.hio303d.mongodb.net/";
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const database = client.db('stock');
      const users = database.collection('users');

      // Insert the new user into the database
      await users.insertOne({ email, password: hashedPassword });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
