import clientPromise from '../connect';
import { ObjectId } from 'mongodb';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'project_files';

/**
 * Create a new project file
 */
export async function createProjectFile(fileData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const newFile = {
      projectId: new ObjectId(fileData.projectId),
      uploadedBy: fileData.uploadedBy, // 'admin' or 'client'
      uploadedById: fileData.uploadedById ? new ObjectId(fileData.uploadedById) : null,
      fileName: fileData.fileName,
      fileUrl: fileData.fileUrl,
      fileType: fileData.fileType || 'other',
      fileSize: fileData.fileSize || 0,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newFile);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating project file:', error);
    throw error;
  }
}

/**
 * Get file by ID
 */
export async function getFileById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const file = await collection.findOne({ _id: new ObjectId(id) });
    return file;
  } catch (error) {
    console.error('Error getting file by ID:', error);
    throw error;
  }
}

/**
 * Get files by project ID
 */
export async function getFilesByProjectId(projectId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const files = await collection
      .find({ projectId: new ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .toArray();

    return files;
  } catch (error) {
    console.error('Error getting files by project ID:', error);
    throw error;
  }
}

/**
 * Get all files with optional filter
 */
export async function getFiles(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const files = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return files;
  } catch (error) {
    console.error('Error getting files:', error);
    throw error;
  }
}

/**
 * Delete file
 */
export async function deleteFile(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting file:', error);
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
    await collection.createIndex({ uploadedBy: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ fileType: 1 });
  } catch (error) {
    console.error('Error creating project file indexes:', error);
  }
}

