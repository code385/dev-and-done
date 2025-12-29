import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'project_estimates';

export async function createProjectEstimate(estimateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const estimate = {
      ...estimateData,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(estimate);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating project estimate:', error);
    throw error;
  }
}

export async function getProjectEstimates(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const estimates = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return estimates;
  } catch (error) {
    console.error('Error getting project estimates:', error);
    throw error;
  }
}

export async function updateEstimateStatus(id, status) {
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
    console.error('Error updating estimate:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ email: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ createdAt: -1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

