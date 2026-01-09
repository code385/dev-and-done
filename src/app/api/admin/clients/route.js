import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as ClientModel from '@/lib/mongodb/models/Client';
import bcrypt from 'bcryptjs';

/**
 * GET /api/admin/clients
 * Get all clients (admin only)
 */
export async function GET(request) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;

    const clients = await ClientModel.getClients({}, limit);

    return NextResponse.json({
      success: true,
      clients: clients.map(client => ({
        id: client._id.toString(),
        name: client.name,
        email: client.email,
        companyName: client.companyName,
        createdAt: client.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/clients
 * Create a new client (admin only)
 */
export async function POST(request) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, companyName, password } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if client already exists
    const existingClient = await ClientModel.getClientByEmail(email.toLowerCase());
    if (existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client with this email already exists' },
        { status: 400 }
      );
    }

    // Create client data
    const clientData = {
      name,
      email: email.toLowerCase(),
      companyName: companyName || '',
    };

    // If password is provided, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      clientData.password = hashedPassword;
    }

    // Create client
    const result = await ClientModel.createClient(clientData);

    return NextResponse.json({
      success: true,
      clientId: result.id.toString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

