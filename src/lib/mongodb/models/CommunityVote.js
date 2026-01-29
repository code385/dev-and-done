import clientPromise from '../connect.js';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'community_votes';

export async function createVote(voteData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    const vote = {
      userId: voteData.userId || null,
      userEmail: voteData.userEmail ? voteData.userEmail.toLowerCase() : null,
      targetType: voteData.targetType, // 'post', 'question', 'answer', 'comment'
      targetId: new ObjectId(voteData.targetId),
      voteType: voteData.voteType, // 'upvote' or 'downvote'
      createdAt: new Date(),
    };

    // Check if vote already exists
    const existingFilter = {
      $or: [
        vote.userId ? { userId: new ObjectId(vote.userId) } : {},
        vote.userEmail ? { userEmail: vote.userEmail } : {},
      ].filter(obj => Object.keys(obj).length > 0),
      targetType: vote.targetType,
      targetId: vote.targetId,
    };

    const existing = await collection.findOne(existingFilter);

    if (existing) {
      // Update existing vote
      if (existing.voteType === vote.voteType) {
        // Same vote type - remove vote (toggle off)
        await collection.deleteOne({ _id: existing._id });
        return { success: true, action: 'removed', vote: null };
      } else {
        // Different vote type - update
        const result = await collection.updateOne(
          { _id: existing._id },
          { $set: { voteType: vote.voteType, createdAt: new Date() } }
        );
        return { success: true, action: 'updated', vote: { ...vote, _id: existing._id } };
      }
    }

    // Create new vote
    const result = await collection.insertOne(vote);
    return { success: true, action: 'created', vote: { ...vote, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
}

export async function getVoteCounts(targetType, targetId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    const [upvotes, downvotes] = await Promise.all([
      collection.countDocuments({
        targetType,
        targetId: new ObjectId(targetId),
        voteType: 'upvote',
      }),
      collection.countDocuments({
        targetType,
        targetId: new ObjectId(targetId),
        voteType: 'downvote',
      }),
    ]);

    return {
      upvoteCount: upvotes,
      downvoteCount: downvotes,
      totalVotes: upvotes - downvotes,
    };
  } catch (error) {
    console.error('Error getting vote counts:', error);
    throw error;
  }
}

export async function getUserVote(userId, userEmail, targetType, targetId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    const filter = {
      targetType,
      targetId: new ObjectId(targetId),
      $or: [
        userId ? { userId: new ObjectId(userId) } : {},
        userEmail ? { userEmail: userEmail.toLowerCase() } : {},
      ].filter(obj => Object.keys(obj).length > 0),
    };

    const vote = await collection.findOne(filter);
    return vote;
  } catch (error) {
    console.error('Error getting user vote:', error);
    throw error;
  }
}

export async function deleteVotesByTarget(targetType, targetId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    const result = await collection.deleteMany({
      targetType,
      targetId: new ObjectId(targetId),
    });

    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error('Error deleting votes by target:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Compound unique index to prevent duplicate votes
    await collection.createIndex(
      { userId: 1, targetType: 1, targetId: 1 },
      { unique: true, sparse: true }
    );
    await collection.createIndex(
      { userEmail: 1, targetType: 1, targetId: 1 },
      { unique: true, sparse: true }
    );
    await collection.createIndex({ targetType: 1, targetId: 1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

