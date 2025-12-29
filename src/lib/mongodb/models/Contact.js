import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'contacts';

export async function createContact(contactData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const contact = {
      ...contactData,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(contact);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

export async function getContacts(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const contacts = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return contacts;
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
}

export async function updateContactStatus(id, status) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.updateOne(
      { _id: id },
      { $set: { status, updatedAt: new Date() } }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}

// Create indexes for better query performance
export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ email: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ source: 1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

