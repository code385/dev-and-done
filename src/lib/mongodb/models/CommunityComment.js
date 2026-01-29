import clientPromise from '../connect.js';
import * as PostModel from './CommunityPost';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'community_comments';

export async function createComment(commentData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    const comment = {
      postId: commentData.postId ? new ObjectId(commentData.postId) : null,
      questionId: commentData.questionId ? new ObjectId(commentData.questionId) : null,
      answerId: commentData.answerId ? new ObjectId(commentData.answerId) : null,
      parentCommentId: commentData.parentCommentId ? new ObjectId(commentData.parentCommentId) : null,
      content: commentData.content,
      authorId: commentData.authorId || null,
      authorName: commentData.authorName || 'Anonymous',
      authorEmail: commentData.authorEmail || '',
      isDeleted: false,
      deletedAt: null,
      upvoteCount: 0,
      downvoteCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(comment);

    // Increment comment count on post if applicable
    if (comment.postId) {
      await PostModel.incrementCommentCount(comment.postId.toString());
    }

    return { success: true, id: result.insertedId, comment: { ...comment, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function getComments(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 100,
      sort = { createdAt: 1 }, // Oldest first for comments
    } = options;

    const skip = (page - 1) * limit;

    const query = { ...filter, isDeleted: false };

    const [comments, total] = await Promise.all([
      collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}

export async function getCommentsByPost(postId) {
  return getComments({ postId: new (await import('mongodb')).ObjectId(postId) });
}

export async function getCommentsByQuestion(questionId) {
  return getComments({ questionId: new (await import('mongodb')).ObjectId(questionId) });
}

export async function getCommentsByAnswer(answerId) {
  return getComments({ answerId: new (await import('mongodb')).ObjectId(answerId) });
}

export async function getCommentById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const comment = await collection.findOne({ _id: new ObjectId(id) });
    return comment;
  } catch (error) {
    console.error('Error getting comment by ID:', error);
    throw error;
  }
}

export async function updateComment(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    
    const update = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Remove undefined fields
    Object.keys(update).forEach(key => {
      if (update[key] === undefined) {
        delete update[key];
      }
    });

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Comment not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

export async function deleteComment(id, softDelete = true) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    if (softDelete) {
      // Soft delete
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isDeleted: true, 
            deletedAt: new Date(),
            content: '[deleted]',
            updatedAt: new Date()
          } 
        }
      );

      if (result.matchedCount === 0) {
        return { success: false, error: 'Comment not found' };
      }
    } else {
      // Hard delete
      const comment = await collection.findOne({ _id: new ObjectId(id) });
      
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return { success: false, error: 'Comment not found' };
      }

      // Decrement comment count on post if applicable
      if (comment && comment.postId) {
        await collection.updateOne(
          { _id: comment.postId },
          { $inc: { commentCount: -1 } }
        );
      }
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ postId: 1, createdAt: 1 });
    await collection.createIndex({ questionId: 1, createdAt: 1 });
    await collection.createIndex({ answerId: 1, createdAt: 1 });
    await collection.createIndex({ parentCommentId: 1 });
    await collection.createIndex({ authorId: 1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

