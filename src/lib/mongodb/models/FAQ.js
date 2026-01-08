import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'faqs';

export async function createFAQ(faqData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const faq = {
      question: faqData.question,
      answer: faqData.answer,
      category: faqData.category || 'general',
      order: faqData.order || 0,
      isPublished: faqData.isPublished !== undefined ? faqData.isPublished : false,
      views: 0,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(faq);
    return { success: true, id: result.insertedId, faq: { ...faq, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating FAQ:', error);
    throw error;
  }
}

export async function getFAQs(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 50,
      sort = { order: 1, createdAt: -1 },
    } = options;

    const skip = (page - 1) * limit;

    // Only return published FAQs for public access
    if (!filter.isPublished && !filter.includeUnpublished) {
      filter.isPublished = true;
    }

    const [faqs, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      faqs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting FAQs:', error);
    throw error;
  }
}

export async function getFAQById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const faq = await collection.findOne({ _id: new ObjectId(id) });

    return faq;
  } catch (error) {
    console.error('Error getting FAQ by ID:', error);
    throw error;
  }
}

export async function searchFAQs(query, filter = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const searchFilter = {
      ...filter,
      isPublished: true,
      $or: [
        { question: { $regex: query, $options: 'i' } },
        { answer: { $regex: query, $options: 'i' } },
      ],
    };

    const faqs = await collection
      .find(searchFilter)
      .sort({ order: 1, createdAt: -1 })
      .limit(20)
      .toArray();

    return faqs;
  } catch (error) {
    console.error('Error searching FAQs:', error);
    throw error;
  }
}

export async function updateFAQ(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const update = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'FAQ not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
}

export async function incrementFAQViews(id) {
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
    console.error('Error incrementing FAQ views:', error);
  }
}

export async function markFAQHelpful(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { helpful: 1 } }
    );
  } catch (error) {
    console.error('Error marking FAQ as helpful:', error);
  }
}

export async function deleteFAQ(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'FAQ not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    throw error;
  }
}

// Create indexes for better query performance
export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ category: 1 });
    await collection.createIndex({ isPublished: 1 });
    await collection.createIndex({ order: 1 });
    await collection.createIndex({ views: -1 });
    await collection.createIndex({ question: 'text', answer: 'text' }); // Text index for search
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}
