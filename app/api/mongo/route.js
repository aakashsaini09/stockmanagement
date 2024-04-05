import {MongoClient} from "mongodb"
import { NextResponse } from "next/server";
export async function GET(request) {
const uri = "mongodb+srv://mongodb:dGRDjWii0mYAJcP5@cluster0.gqdypnw.mongodb.net/";
const client = new MongoClient(uri);
  try {
    const database = client.db('itsdatabase');
    const movies = database.collection('itscollection');
    const query = {  };
    const movie = await movies.find(query);

    console.log(movie);
    return NextResponse.json({ "a" : 34})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}