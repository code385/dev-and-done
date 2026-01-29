import clientPromise from '../connect';
import * as TagModel from './Tag';
import * as CategoryModel from './Category';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'blogs';

// Helper function to convert category slug/name to ObjectId
async function resolveCategory(categoryInput) {
  if (!categoryInput) return null;
  
  const { ObjectId } = await import('mongodb');
  
  // If it's already an ObjectId, return it
  if (ObjectId.isValid(categoryInput) && categoryInput.toString().length === 24) {
    return new ObjectId(categoryInput);
  }
  
  // Try to find by slug
  const category = await CategoryModel.getCategoryBySlug(categoryInput);
  if (category) {
    return category._id;
  }
  
  // Try to find by name
  const categories = await CategoryModel.getCategories({ name: new RegExp(`^${categoryInput}$`, 'i') }, { limit: 1 });
  if (categories.categories.length > 0) {
    return categories.categories[0]._id;
  }
  
  return null;
}

// Helper function to resolve tag slugs/names to ObjectIds
async function resolveTags(tagsInput) {
  if (!tagsInput || !Array.isArray(tagsInput) || tagsInput.length === 0) {
    return [];
  }
  
  const { ObjectId } = await import('mongodb');
  const tagIds = [];
  
  for (const tagInput of tagsInput) {
    // If it's already an ObjectId, use it
    if (ObjectId.isValid(tagInput) && tagInput.toString().length === 24) {
      tagIds.push(new ObjectId(tagInput));
      continue;
    }
    
    // Try to find by slug
    let tag = await TagModel.getTagBySlug(tagInput);
    if (tag) {
      tagIds.push(tag._id);
      continue;
    }
    
    // Try to find by name
    const tags = await TagModel.getTags({ name: tagInput.toLowerCase().trim() }, { limit: 1 });
    if (tags.tags.length > 0) {
      tagIds.push(tags.tags[0]._id);
    }
  }
  
  return tagIds;
}

export async function createBlog(blogData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Resolve category and tags to ObjectIds
    const categoryId = await resolveCategory(blogData.category);
    const tagIds = await resolveTags(blogData.tags);

    const blog = {
      ...blogData,
      category: categoryId,
      tags: tagIds,
      views: 0,
      averageRating: 0,
      reviewCount: 0,
      isPublished: blogData.isPublished !== undefined ? blogData.isPublished : true,
      featured: blogData.featured || false,
      createdBy: blogData.createdBy || null, // Founder ID who created the blog
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(blog);
    
    // Update tag and category counts
    if (categoryId) {
      await CategoryModel.incrementCategoryCount(blogData.category);
    }
    for (const tagId of tagIds) {
      const tag = await TagModel.getTags({ _id: tagId }, { limit: 1 });
      if (tag.tags.length > 0) {
        await TagModel.incrementTagCount(tag.tags[0].name);
      }
    }
    
    return { success: true, id: result.insertedId, blog: { ...blog, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

// Helper function to populate category and tags
async function populateBlogData(blog) {
  if (!blog) return blog;
  
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const categoriesCollection = db.collection('categories');
  const tagsCollection = db.collection('tags');
  const { ObjectId } = await import('mongodb');
  
  const populated = { ...blog };
  
  // Populate category - handle both ObjectId and legacy string formats
  if (blog.category) {
    try {
      let categoryId = blog.category;
      let shouldPopulate = false;
      
      // If it's already an ObjectId, use it directly
      if (categoryId instanceof ObjectId) {
        shouldPopulate = true;
      }
      // If it's a valid ObjectId string, convert it
      else if (typeof categoryId === 'string') {
        // Check if it's a valid 24-character hex string (ObjectId format)
        const isValidObjectIdString = /^[0-9a-fA-F]{24}$/.test(categoryId) && ObjectId.isValid(categoryId);
        
        if (isValidObjectIdString) {
          categoryId = new ObjectId(categoryId);
          shouldPopulate = true;
        }
        // Otherwise, it's a legacy string category name (like "Web Development")
        // Skip population for legacy format
      }
      // If it's not a string or ObjectId, skip it
      
      if (shouldPopulate && categoryId) {
        const category = await categoriesCollection.findOne({ _id: categoryId });
        if (category) {
          populated.categoryData = category;
        }
      }
    } catch (error) {
      // Silently handle errors for legacy data - don't break the app
      // The category might be in an old format
    }
  }
  
  // Populate tags - handle both ObjectId arrays and legacy formats
  if (blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0) {
    try {
      const validTagIds = [];
      
      for (const tagItem of blog.tags) {
        try {
          // If it's already an ObjectId, use it
          if (tagItem instanceof ObjectId) {
            validTagIds.push(tagItem);
            continue;
          }
          
          // If it's a string, check if it's a valid ObjectId
          if (typeof tagItem === 'string') {
            // Check if it's a valid 24-character hex string (ObjectId format)
            const isValidObjectIdString = /^[0-9a-fA-F]{24}$/.test(tagItem) && ObjectId.isValid(tagItem);
            
            if (isValidObjectIdString) {
              validTagIds.push(new ObjectId(tagItem));
            }
            // Otherwise, it's a legacy string tag name - skip it
            continue;
          }
          
          // If it's an object with _id, extract it
          if (tagItem && typeof tagItem === 'object' && tagItem._id) {
            if (tagItem._id instanceof ObjectId) {
              validTagIds.push(tagItem._id);
            } else if (typeof tagItem._id === 'string') {
              const isValidObjectIdString = /^[0-9a-fA-F]{24}$/.test(tagItem._id) && ObjectId.isValid(tagItem._id);
              if (isValidObjectIdString) {
                validTagIds.push(new ObjectId(tagItem._id));
              }
            }
          }
        } catch (error) {
          // Skip invalid tag items
          continue;
        }
      }
      
      if (validTagIds.length > 0) {
        const tags = await tagsCollection.find({ _id: { $in: validTagIds } }).toArray();
        populated.tagsData = tags;
      }
    } catch (error) {
      // Silently handle errors for legacy data
      // console.error('Error populating tags:', error);
    }
  }
  
  return populated;
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
      populate = true,
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

    // Populate category and tags if requested
    let populatedBlogs = blogs;
    if (populate) {
      populatedBlogs = await Promise.all(blogs.map(blog => populateBlogData(blog)));
    }

    return {
      blogs: populatedBlogs,
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
    
    if (blog) {
      return await populateBlogData(blog);
    }
    
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
    
    if (blog) {
      return await populateBlogData(blog);
    }
    
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
    
    // Get existing blog to handle tag/category count updates
    const existingBlog = await collection.findOne({ _id: new ObjectId(id) });
    
    // Resolve category and tags if provided
    const updateFields = { ...updateData, updatedAt: new Date() };
    
    if (updateData.category !== undefined) {
      const categoryId = await resolveCategory(updateData.category);
      updateFields.category = categoryId;
      
      // Update category counts
      if (existingBlog && existingBlog.category) {
        const oldCategory = await db.collection('categories').findOne({ _id: existingBlog.category });
        if (oldCategory) {
          await CategoryModel.decrementCategoryCount(oldCategory.slug);
        }
      }
      if (categoryId) {
        const newCategory = await db.collection('categories').findOne({ _id: categoryId });
        if (newCategory) {
          await CategoryModel.incrementCategoryCount(newCategory.slug);
        }
      }
    }
    
    if (updateData.tags !== undefined) {
      const tagIds = await resolveTags(updateData.tags);
      updateFields.tags = tagIds;
      
      // Update tag counts
      if (existingBlog && existingBlog.tags) {
        const oldTags = await db.collection('tags').find({ _id: { $in: existingBlog.tags } }).toArray();
        for (const tag of oldTags) {
          await TagModel.decrementTagCount(tag.name);
        }
      }
      for (const tagId of tagIds) {
        const tag = await db.collection('tags').findOne({ _id: tagId });
        if (tag) {
          await TagModel.incrementTagCount(tag.name);
        }
      }
    }
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
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

export async function updateBlogRating(id, averageRating, reviewCount) {
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
        },
      }
    );
  } catch (error) {
    console.error('Error updating blog rating:', error);
  }
}

// Helper functions for tag/category count management
export async function incrementTagCounts(tagIds) {
  try {
    if (!tagIds || tagIds.length === 0) return;
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const tagsCollection = db.collection('tags');
    const { ObjectId } = await import('mongodb');
    
    const objectIds = tagIds.map(id => new ObjectId(id));
    const tags = await tagsCollection.find({ _id: { $in: objectIds } }).toArray();
    
    for (const tag of tags) {
      await TagModel.incrementTagCount(tag.name);
    }
  } catch (error) {
    console.error('Error incrementing tag counts:', error);
  }
}

export async function decrementTagCounts(tagIds) {
  try {
    if (!tagIds || tagIds.length === 0) return;
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const tagsCollection = db.collection('tags');
    const { ObjectId } = await import('mongodb');
    
    const objectIds = tagIds.map(id => new ObjectId(id));
    const tags = await tagsCollection.find({ _id: { $in: objectIds } }).toArray();
    
    for (const tag of tags) {
      await TagModel.decrementTagCount(tag.name);
    }
  } catch (error) {
    console.error('Error decrementing tag counts:', error);
  }
}

export async function updateCategoryCount(categoryId, increment = true) {
  try {
    if (!categoryId) return;
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const categoriesCollection = db.collection('categories');
    const { ObjectId } = await import('mongodb');
    
    const category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId) });
    if (category) {
      if (increment) {
        await CategoryModel.incrementCategoryCount(category.slug);
      } else {
        await CategoryModel.decrementCategoryCount(category.slug);
      }
    }
  } catch (error) {
    console.error('Error updating category count:', error);
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
    await collection.createIndex({ tags: 1 });
    await collection.createIndex({ category: 1, tags: 1 });
  } catch (error) {
    console.error('Error creating blog indexes:', error);
  }
}

