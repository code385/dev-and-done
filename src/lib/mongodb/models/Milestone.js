import clientPromise from '../connect';
import { ObjectId } from 'mongodb';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'milestones';

/**
 * Create a new milestone
 */
export async function createMilestone(milestoneData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const newMilestone = {
      projectId: new ObjectId(milestoneData.projectId),
      title: milestoneData.title,
      description: milestoneData.description || '',
      dueDate: milestoneData.dueDate ? new Date(milestoneData.dueDate) : null,
      status: milestoneData.status || 'pending', // pending, in-progress, completed
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newMilestone);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
}

/**
 * Get milestone by ID
 */
export async function getMilestoneById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const milestone = await collection.findOne({ _id: new ObjectId(id) });
    return milestone;
  } catch (error) {
    console.error('Error getting milestone by ID:', error);
    throw error;
  }
}

/**
 * Get milestones by project ID
 */
export async function getMilestonesByProjectId(projectId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const milestones = await collection
      .find({ projectId: new ObjectId(projectId) })
      .sort({ dueDate: 1, createdAt: 1 })
      .toArray();

    return milestones;
  } catch (error) {
    console.error('Error getting milestones by project ID:', error);
    throw error;
  }
}

/**
 * Get all milestones with optional filter
 */
export async function getMilestones(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const milestones = await collection
      .find(filter)
      .sort({ dueDate: 1, createdAt: 1 })
      .limit(limit)
      .toArray();

    return milestones;
  } catch (error) {
    console.error('Error getting milestones:', error);
    throw error;
  }
}

/**
 * Update milestone
 */
export async function updateMilestone(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Prepare update data with proper type conversions
    const update = {
      updatedAt: new Date(),
    };

    if (updateData.title !== undefined) update.title = updateData.title;
    if (updateData.description !== undefined) update.description = updateData.description;
    if (updateData.status !== undefined) update.status = updateData.status;
    
    // Convert dueDate if provided
    if (updateData.dueDate !== undefined) {
      update.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
}

/**
 * Delete milestone
 */
export async function deleteMilestone(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting milestone:', error);
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

    await collection.createIndex({ projectId: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ dueDate: 1 });
    await collection.createIndex({ createdAt: -1 });
  } catch (error) {
    console.error('Error creating milestone indexes:', error);
  }
}

