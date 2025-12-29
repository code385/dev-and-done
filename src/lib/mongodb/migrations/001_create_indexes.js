// Migration: Create database indexes
// Run this once to set up indexes for optimal query performance

import clientPromise from '../connect.js';
import { createIndexes as createContactIndexes } from '../models/Contact.js';
import { createIndexes as createEstimateIndexes } from '../models/ProjectEstimate.js';
import { createIndexes as createChatIndexes } from '../models/ChatConversation.js';
import { createIndexes as createNewsletterIndexes } from '../models/NewsletterSubscriber.js';

async function runMigration() {
  try {
    console.log('Running migration: Create indexes...');
    
    await createContactIndexes();
    await createEstimateIndexes();
    await createChatIndexes();
    await createNewsletterIndexes();
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

