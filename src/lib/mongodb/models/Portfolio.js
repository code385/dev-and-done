import clientPromise from '../connect.js';
import { ObjectId } from 'mongodb';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'portfolio_projects';

// Helper to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Create a new portfolio project
 */
export async function createPortfolioProject(projectData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const slug = projectData.slug || generateSlug(projectData.title);
    
    // Check if slug exists
    const existing = await collection.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const newProject = {
      title: projectData.title,
      slug: finalSlug,
      description: projectData.description || '',
      problem: projectData.problem || '',
      solution: projectData.solution || '',
      result: projectData.result || '',
      category: projectData.category || 'Web Development',
      client: projectData.client || '',
      image: projectData.image || '',
      techStack: projectData.techStack || [],
      metrics: projectData.metrics || [],
      githubLink: projectData.githubLink || '',
      liveLink: projectData.liveLink || '',
      demoVideo: projectData.demoVideo || '',
      featured: projectData.featured || false,
      published: projectData.published !== undefined ? projectData.published : true,
      order: projectData.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newProject);
    return { success: true, id: result.insertedId, project: { ...newProject, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    throw error;
  }
}

/**
 * Get portfolio project by ID
 */
export async function getPortfolioProjectById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const project = await collection.findOne({ _id: new ObjectId(id) });
    return project;
  } catch (error) {
    console.error('Error getting portfolio project by ID:', error);
    throw error;
  }
}

/**
 * Get portfolio project by slug
 */
export async function getPortfolioProjectBySlug(slug) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const project = await collection.findOne({ slug, published: true });
    return project;
  } catch (error) {
    console.error('Error getting portfolio project by slug:', error);
    throw error;
  }
}

/**
 * Get all portfolio projects with optional filter
 */
export async function getPortfolioProjects(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      limit = 100,
      sort = { order: -1, createdAt: -1 },
      published = undefined, // undefined = all, true = published only, false = unpublished only
    } = options;

    // Build query
    const query = { ...filter };
    if (published !== undefined) {
      query.published = published;
    }

    const projects = await collection
      .find(query)
      .sort(sort)
      .limit(limit)
      .toArray();

    return projects;
  } catch (error) {
    console.error('Error getting portfolio projects:', error);
    throw error;
  }
}

/**
 * Get featured portfolio projects
 */
export async function getFeaturedPortfolioProjects(limit = 6) {
  try {
    return await getPortfolioProjects(
      { featured: true },
      { limit, published: true, sort: { order: -1, createdAt: -1 } }
    );
  } catch (error) {
    console.error('Error getting featured portfolio projects:', error);
    throw error;
  }
}

/**
 * Get portfolio projects by category
 */
export async function getPortfolioProjectsByCategory(category, limit = 20) {
  try {
    return await getPortfolioProjects(
      { category },
      { limit, published: true, sort: { order: -1, createdAt: -1 } }
    );
  } catch (error) {
    console.error('Error getting portfolio projects by category:', error);
    throw error;
  }
}

/**
 * Update portfolio project
 */
export async function updatePortfolioProject(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // If title is being updated, regenerate slug
    if (updateData.title) {
      const existing = await collection.findOne({ _id: new ObjectId(id) });
      if (existing && existing.title !== updateData.title) {
        const newSlug = generateSlug(updateData.title);
        const slugExists = await collection.findOne({ 
          slug: newSlug, 
          _id: { $ne: new ObjectId(id) } 
        });
        updateData.slug = slugExists ? `${newSlug}-${Date.now()}` : newSlug;
      }
    }

    const update = {
      updatedAt: new Date(),
    };

    // Add fields to update
    if (updateData.title !== undefined) update.title = updateData.title;
    if (updateData.slug !== undefined) update.slug = updateData.slug;
    if (updateData.description !== undefined) update.description = updateData.description;
    if (updateData.problem !== undefined) update.problem = updateData.problem;
    if (updateData.solution !== undefined) update.solution = updateData.solution;
    if (updateData.result !== undefined) update.result = updateData.result;
    if (updateData.category !== undefined) update.category = updateData.category;
    if (updateData.client !== undefined) update.client = updateData.client;
    if (updateData.image !== undefined) update.image = updateData.image;
    if (updateData.techStack !== undefined) update.techStack = updateData.techStack;
    if (updateData.metrics !== undefined) update.metrics = updateData.metrics;
    if (updateData.githubLink !== undefined) update.githubLink = updateData.githubLink;
    if (updateData.liveLink !== undefined) update.liveLink = updateData.liveLink;
    if (updateData.demoVideo !== undefined) update.demoVideo = updateData.demoVideo;
    if (updateData.featured !== undefined) update.featured = updateData.featured;
    if (updateData.published !== undefined) update.published = updateData.published;
    if (updateData.order !== undefined) update.order = updateData.order;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    throw error;
  }
}

/**
 * Delete portfolio project
 */
export async function deletePortfolioProject(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    throw error;
  }
}

/**
 * Create indexes for better query performance
 */
export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ featured: 1 });
    await collection.createIndex({ published: 1 });
    await collection.createIndex({ order: -1 });
    await collection.createIndex({ createdAt: -1 });
  } catch (error) {
    console.error('Error creating portfolio indexes:', error);
  }
}
