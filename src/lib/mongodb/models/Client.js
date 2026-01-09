import clientPromise from '../connect';
import { ObjectId } from 'mongodb';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'clients';

/**
 * Create a new client
 */
export async function createClient(clientData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const newClient = {
      name: clientData.name,
      email: clientData.email,
      companyName: clientData.companyName || '',
      userId: clientData.userId ? new ObjectId(clientData.userId) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newClient);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

/**
 * Get client by ID
 */
export async function getClientById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const clientDoc = await collection.findOne({ _id: new ObjectId(id) });
    return clientDoc;
  } catch (error) {
    console.error('Error getting client by ID:', error);
    throw error;
  }
}

/**
 * Get client by email
 */
export async function getClientByEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const clientDoc = await collection.findOne({ email });
    return clientDoc;
  } catch (error) {
    console.error('Error getting client by email:', error);
    throw error;
  }
}

/**
 * Get client by userId
 */
export async function getClientByUserId(userId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const clientDoc = await collection.findOne({ userId: new ObjectId(userId) });
    return clientDoc;
  } catch (error) {
    console.error('Error getting client by userId:', error);
    throw error;
  }
}

/**
 * Get all clients with optional filter
 */
export async function getClients(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const clients = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return clients;
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
}

/**
 * Update client
 */
export async function updateClient(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        } 
      }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

/**
 * Delete client
 */
export async function deleteClient(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

/**
 * Create indexes for better query performance
 */
export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ userId: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ companyName: 1 });
  } catch (error) {
    console.error('Error creating client indexes:', error);
  }
}

