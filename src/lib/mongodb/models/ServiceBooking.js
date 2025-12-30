import clientPromise from '../connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'servicebookings';

export async function createServiceBooking(bookingData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const booking = {
      ...bookingData,
      clientEmail: bookingData.clientEmail.toLowerCase(),
      status: bookingData.status || 'pending',
      reminderSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(booking);
    return { success: true, id: result.insertedId, booking: { ...booking, _id: result.insertedId } };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function getServiceBookings(filter = {}, options = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const {
      page = 1,
      limit = 20,
      sort = { bookingDate: 1 },
    } = options;

    const skip = (page - 1) * limit;

    // Handle email filter (normalize to lowercase)
    if (filter.clientEmail && typeof filter.clientEmail === 'string') {
      filter.clientEmail = filter.clientEmail.toLowerCase();
    }
    
    // Handle $or search queries (preserve as-is)
    // filter.$or is already in the correct format from the API route

    const [bookings, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw error;
  }
}

export async function getServiceBookingById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const booking = await collection.findOne({ _id: new ObjectId(id) });

    return booking;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
}

export async function updateServiceBooking(id, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

export async function checkConflictingBooking(bookingDate, preferredTime) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Normalize booking date to start of day for comparison
    const bookingDateObj = new Date(bookingDate);
    const startOfDay = new Date(bookingDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const conflicting = await collection.findOne({
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      preferredTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    return conflicting;
  } catch (error) {
    console.error('Error checking conflicting booking:', error);
    throw error;
  }
}

// Create indexes
export async function createServiceBookingIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex({ clientEmail: 1, createdAt: -1 });
    await collection.createIndex({ bookingDate: 1, status: 1 });
    await collection.createIndex({ status: 1, bookingDate: 1 });
    await collection.createIndex({ serviceId: 1 });
  } catch (error) {
    console.error('Error creating booking indexes:', error);
  }
}

