import clientPromise from '../connect.js';
import * as TagModel from './Tag';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'community_questions';

// Helper to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to resolve tags
async function resolveTags(tagsInput) {
  if (!tagsInput || !Array.isArray(tagsInput) || tagsInput.length === 0) {
    return { tagIds: [], tagNames: [] };
  }
  
  const { ObjectId } = await import('mongodb');
  const tagIds = [];
  const tagNames = [];
  
  for (const tagInput of tagsInput) {
    if (typeof tagInput !== 'string') continue;
    
    const tagName = tagInput.toLowerCase().trim();
    if (!tagName) continue;
    
    let tag = await TagModel.getTagBySlug(tagName.replace(/\s+/g, '-'));
    if (!tag) {
      const tags = await TagModel.getTags({ name: tagName }, { limit: 1 });
      if (tags.tags.length > 0) {
        tag = tags.tags[0];
      }
    }
    
    if (tag) {
      tagIds.push(tag._id);
      tagNames.push(tag.name);
    } else {
      const newTag = await TagModel.createTag({
        name: tagName,
        slug: tagName.replace(/\s+/g, '-'),
      });
      if (newTag.success && newTag.tag) {
        tagIds.push(newTag.tag._id);
        tagNames.push(newTag.tag.name);
      }
    }
  }
  
  return { tagIds, tagNames };
}

export async function createQuestion(questionData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const slug = questionData.slug || generateSlug(questionData.title);
    
    // Check if slug exists
    const existing = await collection.findOne({ slug });
    if (existing) {
      questionData.slug = `${slug}-${Date.now()}`;
    } else {
      questionData.slug = slug;
    }

    // Resolve tags
    const { tagIds, tagNames } = await resolveTags(questionData.tags || []);

    const question = {
      title: questionData.title,
      slug: questionData.slug,
      content: questionData.content,
      authorId: questionData.authorId || null,
      authorName: questionData.authorName || 'Anonymous',
      authorEmail: questionData.authorEmail || '',
      tags: tagNames,
      tagIds,
      status: questionData.status || 'open',
      isPinned: questionData.isPinned || false,
      isLocked: questionData.isLocked || false,
      acceptedAnswerId: null,
      viewCount: 0,
      upvoteCount: 0,
      downvoteCount: 0,
      answerCount: 0,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(question);
    return { success: true, question: { ...question, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, error: error.message };
  }
}

export async function getQuestions(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const mongoFilter = {};
    if (filter.status) mongoFilter.status = filter.status;
    if (filter.authorId) mongoFilter.authorId = new ObjectId(filter.authorId);
    if (filter.tags) {
      if (Array.isArray(filter.tags)) {
        mongoFilter.tags = { $in: filter.tags };
      } else {
        mongoFilter.tags = filter.tags;
      }
    }
    if (filter.isPinned !== undefined) mongoFilter.isPinned = filter.isPinned;
    if (filter.$text) mongoFilter.$text = filter.$text;

    // Sort
    const sort = options.sort || { isPinned: -1, createdAt: -1 };

    const [questions, total] = await Promise.all([
      collection.find(mongoFilter).sort(sort).skip(skip).limit(limit).toArray(),
      collection.countDocuments(mongoFilter),
    ]);

    return {
      success: true,
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { success: false, error: error.message, questions: [], pagination: null };
  }
}

export async function getQuestionById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const question = await collection.findOne({ _id: new ObjectId(id) });
    return question;
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return null;
  }
}

export async function getQuestionBySlug(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const question = await collection.findOne({ slug });
    return question;
  } catch (error) {
    console.error('Error fetching question by slug:', error);
    return null;
  }
}

export async function updateQuestion(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    // Resolve tags if provided
    if (updateData.tags) {
      const { tagIds, tagNames } = await resolveTags(updateData.tags);
      updateData.tags = tagNames;
      updateData.tagIds = tagIds;
    }

    updateData.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Question not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteQuestion(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Question not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, error: error.message };
  }
}

export async function incrementViewCount(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { viewCount: 1 } }
    );
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

export async function incrementAnswerCount(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { answerCount: 1 },
        $set: { lastActivityAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error incrementing answer count:', error);
  }
}

export async function acceptAnswer(questionId, answerId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(questionId) },
      { 
        $set: { 
          acceptedAnswerId: new ObjectId(answerId),
          status: 'answered',
          lastActivityAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error accepting answer:', error);
    return { success: false, error: error.message };
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ authorId: 1, createdAt: -1 });
    await collection.createIndex({ status: 1, createdAt: -1 });
    await collection.createIndex({ acceptedAnswerId: 1 });
    await collection.createIndex({ tags: 1 });
    await collection.createIndex({ isPinned: -1, createdAt: -1 });
    await collection.createIndex({ title: 'text', content: 'text' });

    console.log('✅ Community questions indexes created');
  } catch (error) {
    console.error('Error creating question indexes:', error);
  }
}

