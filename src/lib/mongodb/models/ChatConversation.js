import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'chat_conversations';

export async function createChatConversation(conversationData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const conversation = {
      ...conversationData,
      status: 'active',
      leadStatus: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(conversation);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating chat conversation:', error);
    throw error;
  }
}

export async function updateChatConversation(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.updateOne(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating chat conversation:', error);
    throw error;
  }
}

export async function getChatConversations(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const conversations = await collection
      .find(filter)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray();

    return conversations;
  } catch (error) {
    console.error('Error getting chat conversations:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ sessionId: 1 });
    await collection.createIndex({ leadStatus: 1 });
    await collection.createIndex({ updatedAt: -1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

