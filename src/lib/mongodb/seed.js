// Seed script for development database
// Run with: node src/lib/mongodb/seed.js

import { createIndexes as createContactIndexes } from './models/Contact.js';
import { createIndexes as createEstimateIndexes } from './models/ProjectEstimate.js';
import { createIndexes as createChatIndexes } from './models/ChatConversation.js';
import { createIndexes as createNewsletterIndexes } from './models/NewsletterSubscriber.js';
import { createIndexes as createTestimonialIndexes } from './models/Testimonial.js';
import { createIndexes as createFAQIndexes } from './models/FAQ.js';
import { createIndexes as createTagIndexes } from './models/Tag.js';
import { createIndexes as createCategoryIndexes } from './models/Category.js';

async function seed() {
  try {
    console.log('Creating database indexes...');
    
    await createContactIndexes();
    await createEstimateIndexes();
    await createChatIndexes();
    await createNewsletterIndexes();
    await createTestimonialIndexes();
    await createFAQIndexes();
    await createTagIndexes();
    await createCategoryIndexes();
    
    console.log('✅ Database indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

