import {MongoClient} from "mongodb"
import { NextResponse } from "next/server";
export async function POST(request) {
    let { action, slug, initialQuantity} = await request.json()
const uri = "mongodb+srv://aakash:FMTeGe40LV2l1nNP@cluster0.hio303d.mongodb.net/";
const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const filter = {slug: slug}

    let newQuantity = action =="add"? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) -1)
    const updateDoc = {
        $set: {
            quantity: newQuantity
        },
    };
    const result = await inventory.updateOne(filter, updateDoc, {});
    return NextResponse.json({success: true, message: `${result.matchedCount} document matched the filter, updated ${result.modifiedCount} document(s)`})
  }finally {
    await client.close();
  }
}