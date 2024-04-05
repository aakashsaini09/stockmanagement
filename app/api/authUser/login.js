// pages/api/login.js

import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const uri = "mongodb+srv://aakash:FMTeGe40LV2l1nNP@cluster0.hio303d.mongodb.net/";
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const database = client.db('stock');
      const users = database.collection('users');

      // Find the user by email
      const user = await users.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT for the authenticated user
      const token = sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
