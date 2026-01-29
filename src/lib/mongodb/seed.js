// Seed script for development database
// Run with: node src/lib/mongodb/seed.js

import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../../.env.local') });

const DB_NAME = 'devanddone';

async function seed() {
  let client;
  
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI not found in .env.local');
      console.error('Please add MONGODB_URI to your .env.local file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    console.log('Creating database indexes...\n');

    // Contacts indexes
    console.log('Creating contacts indexes...');
    await db.collection('contacts').createIndex({ email: 1 });
    await db.collection('contacts').createIndex({ status: 1 });
    await db.collection('contacts').createIndex({ createdAt: -1 });
    await db.collection('contacts').createIndex({ source: 1 });

    // Project Estimates indexes
    console.log('Creating project_estimates indexes...');
    await db.collection('project_estimates').createIndex({ email: 1 });
    await db.collection('project_estimates').createIndex({ status: 1 });
    await db.collection('project_estimates').createIndex({ createdAt: -1 });

    // Chat Conversations indexes
    console.log('Creating chat_conversations indexes...');
    await db.collection('chat_conversations').createIndex({ sessionId: 1 });
    await db.collection('chat_conversations').createIndex({ leadStatus: 1 });
    await db.collection('chat_conversations').createIndex({ updatedAt: -1 });

    // Newsletter Subscribers indexes
    console.log('Creating newsletter_subscribers indexes...');
    await db.collection('newsletter_subscribers').createIndex({ email: 1 }, { unique: true });
    await db.collection('newsletter_subscribers').createIndex({ status: 1 });
    await db.collection('newsletter_subscribers').createIndex({ subscribedAt: -1 });

    // Testimonials indexes
    console.log('Creating testimonials indexes...');
    await db.collection('testimonials').createIndex({ isApproved: 1 });
    await db.collection('testimonials').createIndex({ createdAt: -1 });

    // FAQs indexes
    console.log('Creating faqs indexes...');
    await db.collection('faqs').createIndex({ isPublished: 1 });
    await db.collection('faqs').createIndex({ createdAt: -1 });
    await db.collection('faqs').createIndex({ question: 'text', answer: 'text' });

    // Tags indexes
    console.log('Creating tags indexes...');
    await db.collection('tags').createIndex({ name: 1 }, { unique: true });
    await db.collection('tags').createIndex({ slug: 1 }, { unique: true });
    await db.collection('tags').createIndex({ count: -1 });

    // Categories indexes
    console.log('Creating categories indexes...');
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    await db.collection('categories').createIndex({ count: -1 });

    // Clients indexes
    console.log('Creating clients indexes...');
    await db.collection('clients').createIndex({ email: 1 }, { unique: true });
    await db.collection('clients').createIndex({ createdAt: -1 });

    // Projects indexes
    console.log('Creating projects indexes...');
    await db.collection('projects').createIndex({ clientId: 1 });
    await db.collection('projects').createIndex({ status: 1 });
    await db.collection('projects').createIndex({ createdAt: -1 });

    // Milestones indexes
    console.log('Creating milestones indexes...');
    await db.collection('milestones').createIndex({ projectId: 1 });
    await db.collection('milestones').createIndex({ status: 1 });
    await db.collection('milestones').createIndex({ dueDate: 1 });

    // Project Files indexes
    console.log('Creating project_files indexes...');
    await db.collection('project_files').createIndex({ projectId: 1 });
    await db.collection('project_files').createIndex({ createdAt: -1 });

    // Community Posts indexes
    console.log('Creating community_posts indexes...');
    await db.collection('community_posts').createIndex({ slug: 1 }, { unique: true });
    await db.collection('community_posts').createIndex({ authorId: 1, createdAt: -1 });
    await db.collection('community_posts').createIndex({ category: 1, createdAt: -1 });
    await db.collection('community_posts').createIndex({ status: 1, createdAt: -1 });
    await db.collection('community_posts').createIndex({ isPinned: -1, createdAt: -1 });
    await db.collection('community_posts').createIndex({ tags: 1 });
    await db.collection('community_posts').createIndex({ title: 'text', content: 'text' });

    // Community Users indexes
    console.log('Creating community_users indexes...');
    await db.collection('community_users').createIndex({ email: 1 }, { unique: true });
    await db.collection('community_users').createIndex({ username: 1 }, { unique: true });
    await db.collection('community_users').createIndex({ reputation: -1 });
    await db.collection('community_users').createIndex({ userId: 1 });

    // Community Votes indexes
    console.log('Creating community_votes indexes...');
    await db.collection('community_votes').createIndex(
      { userId: 1, targetType: 1, targetId: 1 },
      { unique: true, sparse: true }
    );
    await db.collection('community_votes').createIndex(
      { userEmail: 1, targetType: 1, targetId: 1 },
      { unique: true, sparse: true }
    );
    await db.collection('community_votes').createIndex({ targetType: 1, targetId: 1 });

    // Community Comments indexes
    console.log('Creating community_comments indexes...');
    await db.collection('community_comments').createIndex({ postId: 1, createdAt: 1 });
    await db.collection('community_comments').createIndex({ questionId: 1, createdAt: 1 });
    await db.collection('community_comments').createIndex({ answerId: 1, createdAt: 1 });
    await db.collection('community_comments').createIndex({ parentCommentId: 1 });
    await db.collection('community_comments').createIndex({ authorId: 1 });

    // Community Questions indexes
    console.log('Creating community_questions indexes...');
    await db.collection('community_questions').createIndex({ slug: 1 }, { unique: true });
    await db.collection('community_questions').createIndex({ authorId: 1, createdAt: -1 });
    await db.collection('community_questions').createIndex({ status: 1, createdAt: -1 });
    await db.collection('community_questions').createIndex({ acceptedAnswerId: 1 });
    await db.collection('community_questions').createIndex({ tags: 1 });
    await db.collection('community_questions').createIndex({ isPinned: -1, createdAt: -1 });
    await db.collection('community_questions').createIndex({ title: 'text', content: 'text' });

    // Community Answers indexes
    console.log('Creating community_answers indexes...');
    await db.collection('community_answers').createIndex({ questionId: 1, createdAt: -1 });
    await db.collection('community_answers').createIndex({ authorId: 1 });
    await db.collection('community_answers').createIndex({ isAccepted: 1 });

    // Community Reports indexes
    console.log('Creating community_reports indexes...');
    await db.collection('community_reports').createIndex({ status: 1, createdAt: -1 });
    await db.collection('community_reports').createIndex({ targetType: 1, targetId: 1 });
    await db.collection('community_reports').createIndex({ reporterId: 1 });

    // Portfolio Projects indexes
    console.log('Creating portfolio_projects indexes...');
    await db.collection('portfolio_projects').createIndex({ slug: 1 }, { unique: true });
    await db.collection('portfolio_projects').createIndex({ category: 1 });
    await db.collection('portfolio_projects').createIndex({ featured: 1 });
    await db.collection('portfolio_projects').createIndex({ published: 1 });
    await db.collection('portfolio_projects').createIndex({ order: -1 });
    await db.collection('portfolio_projects').createIndex({ createdAt: -1 });

    console.log('\n✅ All database indexes created successfully!');
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

seed();

