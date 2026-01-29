import clientPromise from '../connect.js';
import * as TagModel from './Tag';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'community_posts';

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
    return [];
  }
  
  const { ObjectId } = await import('mongodb');
  const tagIds = [];
  const tagNames = [];
  
  for (const tagInput of tagsInput) {
    if (typeof tagInput !== 'string') continue;
    
    const tagName = tagInput.toLowerCase().trim();
    if (!tagName) continue;
    
    // Try to find existing tag
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
      // Create new tag if it doesn't exist
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

export async function createPost(postData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const slug = postData.slug || generateSlug(postData.title);
    
    // Check if slug exists
    const existing = await collection.findOne({ slug });
    if (existing) {
      const uniqueSlug = `${slug}-${Date.now()}`;
      postData.slug = uniqueSlug;
    } else {
      postData.slug = slug;
    }

    // Resolve tags
    const { tagIds, tagNames } = await resolveTags(postData.tags || []);

    // Generate excerpt from content if not provided
    const excerpt = postData.excerpt || 
      (postData.content ? postData.content.substring(0, 200).replace(/[#*`]/g, '') + '...' : '');

    const post = {
      title: postData.title,
      slug: postData.slug,
      content: postData.content,
      excerpt,
      authorId: postData.authorId || null,
      authorName: postData.authorName || 'Anonymous',
      authorEmail: postData.authorEmail || '',
      category: postData.category || 'general',
      tags: tagNames, // Store tag names for easy querying
      tagIds, // Store ObjectIds for relationships
      status: postData.status || 'published',
      isPinned: postData.isPinned || false,
      isLocked: postData.isLocked || false,
      viewCount: 0,
      upvoteCount: 0,
      downvoteCount: 0,
      commentCount: 0,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(post);
    
    // Update tag counts
    for (const tagName of tagNames) {
      await TagModel.incrementTagCount(tagName);
    }

    return { success: true, id: result.insertedId, post: { ...post, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating community post:', error);
    throw error;
  }
}

export async function getPosts(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 20,
      sort = { isPinned: -1, createdAt: -1 },
    } = options;

    const skip = (page - 1) * limit;

    // Build filter
    const query = { ...filter };
    if (query.status === undefined) {
      query.status = 'published'; // Default to published only
    }

    const [posts, total] = await Promise.all([
      collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting community posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug, options = {}) {
  try {
    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug provided to getPostBySlug:', slug);
      return null;
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Normalize slug (lowercase, trim)
    const normalizedSlug = slug.toLowerCase().trim();

    // If slug is empty after normalization, return null
    if (!normalizedSlug) {
      console.error('Slug is empty after normalization:', slug);
      return null;
    }

    // Build query - allow filtering by status if needed
    // Try exact match first, then case-insensitive
    let query = { slug: normalizedSlug };
    if (options.status) {
      query.status = options.status;
    }

    let post = await collection.findOne(query);
    
    // If not found with normalized slug, try with original slug (case-sensitive)
    if (!post && slug !== normalizedSlug) {
      query = { slug: slug };
      if (options.status) {
        query.status = options.status;
      }
      post = await collection.findOne(query);
    }
    
    // If still not found, try case-insensitive regex search
    if (!post && normalizedSlug) {
      // Escape special regex characters
      const escapedSlug = normalizedSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query = { slug: { $regex: new RegExp(`^${escapedSlug}$`, 'i') } };
      if (options.status) {
        query.status = options.status;
      }
      post = await collection.findOne(query);
    }
    
    if (post && (!options.skipViewIncrement)) {
      // Increment view count only for published posts or if explicitly allowed
      if (post.status === 'published' || options.incrementViews) {
        await collection.updateOne(
          { _id: post._id },
          { $inc: { viewCount: 1 } }
        );
        post.viewCount = (post.viewCount || 0) + 1;
      }
    }
    
    return post;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw error;
  }
}

export async function getPostById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const post = await collection.findOne({ _id: new ObjectId(id) });
    return post;
  } catch (error) {
    console.error('Error getting post by ID:', error);
    throw error;
  }
}

export async function updatePost(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    
    // Resolve tags if provided
    let tagUpdate = {};
    if (updateData.tags) {
      const { tagIds, tagNames } = await resolveTags(updateData.tags);
      tagUpdate = { tags: tagNames, tagIds };
    }

    const update = {
      ...updateData,
      ...tagUpdate,
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
      return { success: false, error: 'Post not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function deletePost(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    
    // Get post to get tags for decrementing
    const post = await collection.findOne({ _id: new ObjectId(id) });
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Post not found' };
    }

    // Decrement tag counts
    if (post && post.tags) {
      for (const tagName of post.tags) {
        await TagModel.decrementTagCount(tagName);
      }
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function incrementViewCount(postId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $inc: { viewCount: 1 } }
    );
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

export async function incrementCommentCount(postId) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { 
        $inc: { commentCount: 1 },
        $set: { lastActivityAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error incrementing comment count:', error);
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ authorId: 1, createdAt: -1 });
    await collection.createIndex({ category: 1, createdAt: -1 });
    await collection.createIndex({ status: 1, createdAt: -1 });
    await collection.createIndex({ isPinned: -1, createdAt: -1 });
    await collection.createIndex({ tags: 1 });
    await collection.createIndex({ title: 'text', content: 'text' });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

