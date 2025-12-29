import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'blogs';

export async function createBlog(blogData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const blog = {
      ...blogData,
      views: 0,
      isPublished: blogData.isPublished !== undefined ? blogData.isPublished : true,
      featured: blogData.featured || false,
      createdBy: blogData.createdBy || null, // Founder ID who created the blog
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(blog);
    return { success: true, id: result.insertedId, blog: { ...blog, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

export async function getBlogs(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 12,
      sort = { createdAt: -1 },
      projection = {},
    } = options;

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      collection
        .find(filter, { projection })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw error;
  }
}

export async function getBlogBySlug(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const blog = await collection.findOne({ slug });

    return blog;
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    throw error;
  }
}

export async function getBlogById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const blog = await collection.findOne({ _id: new ObjectId(id) });

    return blog;
  } catch (error) {
    console.error('Error getting blog by id:', error);
    throw error;
  }
}

export async function updateBlog(id, updateData) {
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
    console.error('Error updating blog:', error);
    throw error;
  }
}

export async function deleteBlog(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}

export async function incrementBlogViews(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.updateOne(
      { slug },
      { $inc: { views: 1 } }
    );
  } catch (error) {
    console.error('Error incrementing blog views:', error);
  }
}

// Create indexes
export async function createBlogIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ title: 'text', excerpt: 'text', content: 'text' });
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ isPublished: 1, createdAt: -1 });
    await collection.createIndex({ featured: 1, isPublished: 1, createdAt: -1 });
    await collection.createIndex({ category: 1 });
  } catch (error) {
    console.error('Error creating blog indexes:', error);
  }
}

