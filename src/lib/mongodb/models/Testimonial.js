import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'testimonials';

export async function createTestimonial(testimonialData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const testimonial = {
      name: testimonialData.name,
      role: testimonialData.role || '',
      company: testimonialData.company || '',
      testimonial: testimonialData.testimonial,
      rating: testimonialData.rating || 5,
      serviceType: testimonialData.serviceType || 'general',
      image: testimonialData.image || null,
      videoUrl: testimonialData.videoUrl || null,
      isApproved: testimonialData.isApproved !== undefined ? testimonialData.isApproved : false,
      featured: testimonialData.featured !== undefined ? testimonialData.featured : false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(testimonial);
    return { success: true, id: result.insertedId, testimonial: { ...testimonial, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
}

export async function getTestimonials(filter = {}, options = {}) {
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

    // Only return approved testimonials for public access
    if (!filter.isApproved && !filter.includeUnapproved) {
      filter.isApproved = true;
    }

    const [testimonials, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting testimonials:', error);
    throw error;
  }
}

export async function getTestimonialById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const testimonial = await collection.findOne({ _id: new ObjectId(id) });

    return testimonial;
  } catch (error) {
    console.error('Error getting testimonial by ID:', error);
    throw error;
  }
}

export async function updateTestimonial(id, updateData) {
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
      return { success: false, error: 'Testimonial not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
}

export async function deleteTestimonial(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Testimonial not found' };
    }

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}

// Create indexes for better query performance
export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ serviceType: 1 });
    await collection.createIndex({ isApproved: 1 });
    await collection.createIndex({ featured: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ rating: -1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

