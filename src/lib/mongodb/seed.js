// Seed script for development database
// Run with: node src/lib/mongodb/seed.js

import { createIndexes as createContactIndexes } from './models/Contact.js';
import { createIndexes as createEstimateIndexes } from './models/ProjectEstimate.js';
import { createIndexes as createChatIndexes } from './models/ChatConversation.js';
import { createIndexes as createNewsletterIndexes } from './models/NewsletterSubscriber.js';

async function seed() {
  try {
    console.log('Creating database indexes...');
    
    await createContactIndexes();
    await createEstimateIndexes();
    await createChatIndexes();
    await createNewsletterIndexes();
    
    console.log('✅ Database indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

