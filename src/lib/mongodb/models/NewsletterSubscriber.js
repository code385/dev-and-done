import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'newsletter_subscribers';

export async function createNewsletterSubscriber(subscriberData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Check if email already exists
    const existing = await collection.findOne({ email: subscriberData.email });
    if (existing) {
      return { success: false, error: 'Email already subscribed' };
    }

    const subscriber = {
      ...subscriberData,
      status: 'subscribed',
      subscribedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(subscriber);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error creating newsletter subscriber:', error);
    throw error;
  }
}

export async function getNewsletterSubscribers(filter = {}, limit = 100) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const subscribers = await collection
      .find(filter)
      .sort({ subscribedAt: -1 })
      .limit(limit)
      .toArray();

    return subscribers;
  } catch (error) {
    console.error('Error getting newsletter subscribers:', error);
    throw error;
  }
}

export async function unsubscribeEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.updateOne(
      { email },
      { $set: { status: 'unsubscribed', updatedAt: new Date() } }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error unsubscribing email:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ subscribedAt: -1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

