import clientPromise from '../connect.js';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'community_reports';

export async function createReport(reportData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    const report = {
      reporterId: reportData.reporterId ? new ObjectId(reportData.reporterId) : null,
      reporterEmail: reportData.reporterEmail || '',
      targetType: reportData.targetType, // 'post', 'question', 'answer', 'comment', 'user'
      targetId: new ObjectId(reportData.targetId),
      reason: reportData.reason, // 'spam', 'harassment', 'inappropriate', 'off-topic', 'other'
      description: reportData.description || '',
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(report);
    return { success: true, report: { ...report, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating report:', error);
    return { success: false, error: error.message };
  }
}

export async function getReports(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const sort = options.sort || { createdAt: -1 };

    const [reports, total] = await Promise.all([
      collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      success: true,
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { success: false, error: error.message, reports: [], pagination: null };
  }
}

export async function updateReport(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');

    if (updateData.status && updateData.status !== 'pending') {
      updateData.reviewedAt = new Date();
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Report not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating report:', error);
    return { success: false, error: error.message };
  }
}

export async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ status: 1, createdAt: -1 });
    await collection.createIndex({ targetType: 1, targetId: 1 });
    await collection.createIndex({ reporterId: 1 });

    console.log('✅ Community reports indexes created');
  } catch (error) {
    console.error('Error creating report indexes:', error);
  }
}

