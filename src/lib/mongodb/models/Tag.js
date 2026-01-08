import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'tags';

export async function createTag(tagData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const tag = {
      name: tagData.name.toLowerCase().trim(),
      slug: tagData.slug || tagData.name.toLowerCase().trim().replace(/\s+/g, '-'),
      description: tagData.description || '',
      count: 0, // Number of items using this tag
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if tag already exists
    const existing = await collection.findOne({ name: tag.name });
    if (existing) {
      return { success: false, error: 'Tag already exists', tag: existing };
    }

    const result = await collection.insertOne(tag);
    return { success: true, id: result.insertedId, tag: { ...tag, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
}

export async function getTags(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 100,
      sort = { count: -1, name: 1 },
    } = options;

    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      tags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting tags:', error);
    throw error;
  }
}

export async function getTagBySlug(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const tag = await collection.findOne({ slug });
    return tag;
  } catch (error) {
    console.error('Error getting tag by slug:', error);
    throw error;
  }
}

export async function incrementTagCount(tagName) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.updateOne(
      { name: tagName.toLowerCase() },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } }
    );
  } catch (error) {
    console.error('Error incrementing tag count:', error);
  }
}

export async function decrementTagCount(tagName) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.updateOne(
      { name: tagName.toLowerCase() },
      { $inc: { count: -1 }, $set: { updatedAt: new Date() } }
    );
  } catch (error) {
    console.error('Error decrementing tag count:', error);
  }
}

export async function deleteTag(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Tag not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ name: 1 }, { unique: true });
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ count: -1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

