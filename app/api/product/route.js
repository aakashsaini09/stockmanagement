import {MongoClient} from "mongodb"
import { NextResponse } from "next/server";
export async function GET(request) {
const uri = "mongodb+srv://aakash:FMTeGe40LV2l1nNP@cluster0.hio303d.mongodb.net/";
const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const query = {  };
    const products = await inventory.find(query).toArray();
    return NextResponse.json({success: true, products})
  } finally {
    await client.close();
  }
}
export async function POST(request) {
    let body = await request.json()
const uri = "mongodb+srv://aakash:FMTeGe40LV2l1nNP@cluster0.hio303d.mongodb.net/";
const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const product = await inventory.insertOne(body);
    // console.log(product);
    return NextResponse.json({product, ok: true})
  } finally {
    await client.close();
  }
}
