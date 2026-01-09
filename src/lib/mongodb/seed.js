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
import { createIndexes as createClientIndexes } from './models/Client.js';
import { createIndexes as createProjectIndexes } from './models/Project.js';
import { createIndexes as createMilestoneIndexes } from './models/Milestone.js';
import { createIndexes as createProjectFileIndexes } from './models/ProjectFile.js';

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
    await createClientIndexes();
    await createProjectIndexes();
    await createMilestoneIndexes();
    await createProjectFileIndexes();
    
    console.log('✅ Database indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

