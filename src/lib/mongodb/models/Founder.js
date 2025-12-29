import clientPromise from '../connect.js';
import bcrypt from 'bcryptjs';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'founders';

export async function createFounder(founderData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Hash password
    const hashedPassword = await bcrypt.hash(founderData.password, 10);

    const founder = {
      email: founderData.email.toLowerCase(),
      name: founderData.name,
      password: hashedPassword,
      role: 'founder',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(founder);
    return { success: true, id: result.insertedId, founder: { ...founder, _id: result.insertedId, password: undefined } };
  } catch (error) {
    console.error('Error creating founder:', error);
    throw error;
  }
}

export async function findFounderByEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const founder = await collection.findOne({ email: email.toLowerCase() });
    return founder;
  } catch (error) {
    console.error('Error finding founder:', error);
    throw error;
  }
}

export async function verifyFounderPassword(founder, password) {
  try {
    return await bcrypt.compare(password, founder.password);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

export async function updateFounder(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    
    // If updating password, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating founder:', error);
    throw error;
  }
}

export async function getAllFounders() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const founders = await collection
      .find({})
      .project({ password: 0 }) // Don't return passwords
      .toArray();

    return founders;
  } catch (error) {
    console.error('Error getting founders:', error);
    throw error;
  }
}

// Create indexes
export async function createFounderIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ isActive: 1 });
  } catch (error) {
    console.error('Error creating founder indexes:', error);
  }
}

