import clientPromise from '../connect';
import { ObjectId } from 'mongodb';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'projects';

/**
 * Create a new project
 */
export async function createProject(projectData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const newProject = {
      title: projectData.title,
      description: projectData.description || '',
      clientId: new ObjectId(projectData.clientId),
      status: projectData.status || 'active', // active, completed, on-hold
      startDate: projectData.startDate ? new Date(projectData.startDate) : new Date(),
      endDate: projectData.endDate ? new Date(projectData.endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newProject);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Get project by ID
 */
export async function getProjectById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const project = await collection.findOne({ _id: new ObjectId(id) });
    return project;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    throw error;
  }
}

/**
 * Get projects by client ID
 */
export async function getProjectsByClientId(clientId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const projects = await collection
      .find({ clientId: new ObjectId(clientId) })
      .sort({ createdAt: -1 })
      .toArray();

    return projects;
  } catch (error) {
    console.error('Error getting projects by client ID:', error);
    throw error;
  }
}

/**
 * Get all projects with optional filter
 */
export async function getProjects(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const projects = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
}

/**
 * Update project
 */
export async function updateProject(id, updateData) {
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
    
    // Convert clientId to ObjectId if provided
    if (updateData.clientId !== undefined) {
      update.clientId = new ObjectId(updateData.clientId);
    }
    
    // Convert dates if provided
    if (updateData.startDate !== undefined) {
      update.startDate = updateData.startDate ? new Date(updateData.startDate) : null;
    }
    if (updateData.endDate !== undefined) {
      update.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * Delete project
 */
export async function deleteProject(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting project:', error);
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

    await collection.createIndex({ clientId: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ startDate: -1 });
  } catch (error) {
    console.error('Error creating project indexes:', error);
  }
}

