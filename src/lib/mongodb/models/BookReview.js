import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'bookreviews';

export async function createBookReview(reviewData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const review = {
      ...reviewData,
      bookId: new ObjectId(reviewData.bookId),
      helpful: 0,
      isApproved: reviewData.isApproved !== undefined ? reviewData.isApproved : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(review);
    return { success: true, id: result.insertedId, review: { ...review, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

export async function getBookReviews(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 20,
      sort = { createdAt: -1 },
    } = options;

    const skip = (page - 1) * limit;

    if (filter.bookId) {
      const { ObjectId } = await import('mongodb');
      filter.bookId = new ObjectId(filter.bookId);
    }

    const [reviews, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
}

export async function checkExistingReview(bookId, userEmail) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const review = await collection.findOne({
      bookId: new ObjectId(bookId),
      userEmail: userEmail.toLowerCase(),
    });

    return review;
  } catch (error) {
    console.error('Error checking existing review:', error);
    throw error;
  }
}

export async function getAllApprovedReviews(bookId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const reviews = await collection
      .find({
        bookId: new ObjectId(bookId),
        isApproved: true,
      })
      .toArray();

    return reviews;
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw error;
  }
}

// Create indexes
export async function createBookReviewIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ bookId: 1, createdAt: -1 });
    await collection.createIndex({ userEmail: 1 });
    await collection.createIndex({ isApproved: 1, createdAt: -1 });
    await collection.createIndex({ bookId: 1, userEmail: 1 }, { unique: true });
  } catch (error) {
    console.error('Error creating review indexes:', error);
  }
}

