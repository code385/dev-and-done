import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'books';

export async function createBook(bookData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const book = {
      ...bookData,
      views: 0,
      averageRating: 0,
      reviewCount: 0,
      publishedAt: bookData.publishedAt || new Date(),
      isPublished: bookData.isPublished !== undefined ? bookData.isPublished : true,
      createdBy: bookData.createdBy || null, // Founder ID who created the book
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(book);
    return { success: true, id: result.insertedId, book: { ...book, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
}

export async function getBooks(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 12,
      sort = { publishedAt: -1 },
      projection = {},
    } = options;

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      collection
        .find(filter, { projection })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
}

export async function getBookById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const book = await collection.findOne({ _id: new ObjectId(id) });

    return book;
  } catch (error) {
    console.error('Error getting book:', error);
    throw error;
  }
}

export async function updateBook(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
}

export async function deleteBook(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}

export async function incrementBookViews(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function updateBookRating(id, averageRating, reviewCount) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount,
          updatedAt: new Date(),
        },
      }
    );
  } catch (error) {
    console.error('Error updating book rating:', error);
  }
}

// Create indexes
export async function createBookIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ title: 'text', description: 'text', author: 'text' });
    await collection.createIndex({ publishedAt: -1 });
    await collection.createIndex({ isPublished: 1 });
    await collection.createIndex({ featured: 1, publishedAt: -1 });
  } catch (error) {
    console.error('Error creating book indexes:', error);
  }
}

