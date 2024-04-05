import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const uri = "mongodb+srv://aakash:FMTeGe40LV2l1nNP@cluster0.hio303d.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Parse the ID string into an ObjectId
    const { id } = await request.json();
    const objectId = new ObjectId(id);

    // Delete the document by its ID
    const deletionResult = await inventory.deleteOne({ _id: objectId });

    // Check if the document was found and deleted
    if (deletionResult.deletedCount === 1) {
      return NextResponse.json({ success: true, message: 'Item deleted successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ success: false, message: 'An error occurred while deleting the item', deletionResult });
  } finally {
    await client.close();
  }
}