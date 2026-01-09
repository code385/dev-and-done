import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as ClientModel from '@/lib/mongodb/models/Client';
import bcrypt from 'bcryptjs';

/**
 * GET /api/admin/clients/[id]
 * Get a specific client (admin only)
 */
export async function GET(request, { params }) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const client = await ClientModel.getClientById(id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      client: {
        id: client._id.toString(),
        name: client.name,
        email: client.email,
        companyName: client.companyName,
        createdAt: client.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/clients/[id]
 * Update a client (admin only)
 */
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, companyName, password } = body;

    // Check if client exists
    const existingClient = await ClientModel.getClientById(id);
    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (companyName !== undefined) updateData.companyName = companyName;

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Check if email is being changed and if it conflicts
    if (email && email.toLowerCase() !== existingClient.email) {
      const emailClient = await ClientModel.getClientByEmail(email.toLowerCase());
      if (emailClient && emailClient._id.toString() !== id) {
        return NextResponse.json(
          { success: false, error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    // Update client
    const result = await ClientModel.updateClient(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update client' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/clients/[id]
 * Delete a client (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if client exists
    const client = await ClientModel.getClientById(id);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Delete client
    const result = await ClientModel.deleteClient(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete client' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

