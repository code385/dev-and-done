import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'blogreviews';

export async function createBlogReview(reviewData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const review = {
      ...reviewData,
      blogId: new ObjectId(reviewData.blogId),
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

export async function getBlogReviews(filter = {}, options = {}) {
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

    if (filter.blogId) {
      const { ObjectId } = await import('mongodb');
      filter.blogId = new ObjectId(filter.blogId);
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

export async function checkExistingReview(blogId, userEmail) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const review = await collection.findOne({
      blogId: new ObjectId(blogId),
      userEmail: userEmail.toLowerCase(),
    });

    return review;
  } catch (error) {
    console.error('Error checking existing review:', error);
    throw error;
  }
}

export async function getAllApprovedReviews(blogId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const reviews = await collection
      .find({
        blogId: new ObjectId(blogId),
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
export async function createBlogReviewIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ blogId: 1, createdAt: -1 });
    await collection.createIndex({ userEmail: 1 });
    await collection.createIndex({ isApproved: 1, createdAt: -1 });
    await collection.createIndex({ blogId: 1, userEmail: 1 }, { unique: true });
  } catch (error) {
    console.error('Error creating review indexes:', error);
  }
}

