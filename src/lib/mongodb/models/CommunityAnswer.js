import clientPromise from '../connect.js';
import * as QuestionModel from './CommunityQuestion';
import * as UserModel from './CommunityUser';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'community_answers';

export async function createAnswer(answerData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    const answer = {
      questionId: new ObjectId(answerData.questionId),
      content: answerData.content,
      authorId: answerData.authorId || null,
      authorName: answerData.authorName || 'Anonymous',
      authorEmail: answerData.authorEmail || '',
      isAccepted: false,
      upvoteCount: 0,
      downvoteCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(answer);

    // Increment answer count on question
    await QuestionModel.incrementAnswerCount(answerData.questionId);

    // Increment user answer count
    if (answerData.authorId) {
      await UserModel.incrementAnswerCount(answerData.authorId);
    }

    return { success: true, answer: { ...answer, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating answer:', error);
    return { success: false, error: error.message };
  }
}

export async function getAnswers(questionId, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const sort = options.sort || { isAccepted: -1, upvoteCount: -1, createdAt: -1 };

    const answers = await collection
      .find({ questionId: new ObjectId(questionId) })
      .sort(sort)
      .toArray();

    return { success: true, answers };
  } catch (error) {
    console.error('Error fetching answers:', error);
    return { success: false, error: error.message, answers: [] };
  }
}

export async function getAnswerById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const answer = await collection.findOne({ _id: new ObjectId(id) });
    return answer;
  } catch (error) {
    console.error('Error fetching answer by ID:', error);
    return null;
  }
}

export async function updateAnswer(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    updateData.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Answer not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating answer:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAnswer(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Answer not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting answer:', error);
    return { success: false, error: error.message };
  }
}

export async function acceptAnswer(answerId) {
  try {
    const answer = await getAnswerById(answerId);
    if (!answer) {
      return { success: false, error: 'Answer not found' };
    }

    // Unaccept any previously accepted answer for this question
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    
    await collection.updateMany(
      { questionId: answer.questionId, isAccepted: true },
      { $set: { isAccepted: false } }
    );

    // Accept this answer
    await collection.updateOne(
      { _id: new ObjectId(answerId) },
      { $set: { isAccepted: true, updatedAt: new Date() } }
    );

    // Update question
    await QuestionModel.acceptAnswer(answer.questionId.toString(), answerId);

    // Add reputation to answer author
    if (answer.authorId) {
      await UserModel.incrementReputation(answer.authorId, 15);
      await UserModel.incrementAcceptedAnswerCount(answer.authorId);
    }

    return { success: true };
  } catch (error) {
    console.error('Error accepting answer:', error);
    return { success: false, error: error.message };
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ questionId: 1, createdAt: -1 });
    await collection.createIndex({ authorId: 1 });
    await collection.createIndex({ isAccepted: 1 });

    console.log('✅ Community answers indexes created');
  } catch (error) {
    console.error('Error creating answer indexes:', error);
  }
}

