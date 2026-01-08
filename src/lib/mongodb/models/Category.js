import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'categories';

export async function createCategory(categoryData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const category = {
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().trim().replace(/\s+/g, '-'),
      description: categoryData.description || '',
      color: categoryData.color || '#604dc3',
      count: 0, // Number of items in this category
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if category already exists
    const existing = await collection.findOne({ slug: category.slug });
    if (existing) {
      return { success: false, error: 'Category already exists', category: existing };
    }

    const result = await collection.insertOne(category);
    return { success: true, id: result.insertedId, category: { ...category, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function getCategories(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 100,
      sort = { name: 1 },
    } = options;

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const category = await collection.findOne({ slug });
    return category;
  } catch (error) {
    console.error('Error getting category by slug:', error);
    throw error;
  }
}

export async function incrementCategoryCount(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.updateOne(
      { slug },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } }
    );
  } catch (error) {
    console.error('Error incrementing category count:', error);
  }
}

export async function decrementCategoryCount(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.updateOne(
      { slug },
      { $inc: { count: -1 }, $set: { updatedAt: new Date() } }
    );
  } catch (error) {
    console.error('Error decrementing category count:', error);
  }
}

export async function deleteCategory(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Category not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ name: 1 });
    await collection.createIndex({ count: -1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

