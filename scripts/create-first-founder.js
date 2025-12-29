/**
 * Script to create the first founder account
 * Run with: node scripts/create-first-founder.js
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'founders';

async function createFirstFounder() {
  let client;
  
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI not found in .env.local');
      console.error('Please add MONGODB_URI to your .env.local file');
      process.exit(1);
    }

    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB\n');

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    console.log('Creating first founder account...\n');

    const name = await question('Enter founder name: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password (min 6 characters): ');

    if (password.length < 6) {
      console.error('Error: Password must be at least 6 characters');
      rl.close();
      await client.close();
      process.exit(1);
    }

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Check if founder already exists
    const existing = await collection.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.error('Error: Founder with this email already exists');
      rl.close();
      await client.close();
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create founder
    const founder = {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role: 'founder',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(founder);

    console.log('\n✅ Founder created successfully!');
    console.log(`ID: ${result.insertedId}`);
    console.log(`Name: ${founder.name}`);
    console.log(`Email: ${founder.email}`);
    console.log('\nYou can now login at /admin/login');

    rl.close();
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating founder:', error);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

createFirstFounder();

