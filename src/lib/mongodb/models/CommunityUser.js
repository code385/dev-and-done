import clientPromise from '../connect.js';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'community_users';

export async function createCommunityUser(userData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Generate username from email if not provided
    const username = userData.username || 
      userData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    const user = {
      userId: userData.userId || null, // Reference to founders collection if admin
      email: userData.email.toLowerCase(),
      username: username.toLowerCase(),
      displayName: userData.displayName || userData.name || username,
      bio: userData.bio || '',
      avatar: userData.avatar || '',
      reputation: 0,
      postCount: 0,
      questionCount: 0,
      answerCount: 0,
      acceptedAnswerCount: 0,
      upvotesReceived: 0,
      isBanned: false,
      isMuted: false,
      mutedUntil: null,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if user already exists
    const existing = await collection.findOne({ 
      $or: [
        { email: user.email },
        { username: user.username }
      ]
    });

    if (existing) {
      return { success: false, error: 'User already exists', user: existing };
    }

    const result = await collection.insertOne(user);
    return { success: true, id: result.insertedId, user: { ...user, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating community user:', error);
    throw error;
  }
}

export async function getCommunityUser(filter) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const user = await collection.findOne(filter);
    return user;
  } catch (error) {
    console.error('Error getting community user:', error);
    throw error;
  }
}

export async function getCommunityUserByEmail(email) {
  return getCommunityUser({ email: email.toLowerCase() });
}

export async function getCommunityUserByUsername(username) {
  return getCommunityUser({ username: username.toLowerCase() });
}

export async function updateCommunityUser(id, updateData) {
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
      return { success: false, error: 'User not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error updating community user:', error);
    throw error;
  }
}

export async function incrementReputation(userId, points) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { reputation: points, upvotesReceived: points > 0 ? 1 : 0 },
        $set: { lastActiveAt: new Date(), updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error incrementing reputation:', error);
  }
}

export async function incrementPostCount(userId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { postCount: 1 },
        $set: { lastActiveAt: new Date(), updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error incrementing post count:', error);
  }
}

export async function incrementQuestionCount(userId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { questionCount: 1 },
        $set: { lastActiveAt: new Date(), updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error incrementing question count:', error);
  }
}

export async function incrementAnswerCount(userId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { answerCount: 1 },
        $set: { lastActiveAt: new Date(), updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error incrementing answer count:', error);
  }
}

export async function incrementAcceptedAnswerCount(userId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { acceptedAnswerCount: 1 },
        $set: { lastActiveAt: new Date(), updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error incrementing accepted answer count:', error);
  }
}

export async function getCommunityUsers(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 50,
      sort = { reputation: -1, joinedAt: -1 },
    } = options;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting community users:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ username: 1 }, { unique: true });
    await collection.createIndex({ reputation: -1 });
    await collection.createIndex({ userId: 1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

