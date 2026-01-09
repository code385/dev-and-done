import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import * as ClientModel from '@/lib/mongodb/models/Client';

/**
 * GET /api/admin/projects/[id]
 * Get a specific project (admin only)
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
    const project = await ProjectModel.getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Populate client information
    let client = null;
    if (project.clientId) {
      try {
        client = await ClientModel.getClientById(project.clientId.toString());
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        clientId: project.clientId?.toString() || null,
        clientName: client?.name || 'Unknown Client',
        clientCompany: client?.companyName || '',
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/projects/[id]
 * Update a project (admin only)
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
    const { title, description, clientId, status, startDate, endDate } = body;

    // Verify project exists
    const existingProject = await ProjectModel.getProjectById(id);
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // If clientId is being updated, verify client exists
    if (clientId && clientId !== existingProject.clientId?.toString()) {
      const client = await ClientModel.getClientById(clientId);
      if (!client) {
        return NextResponse.json(
          { success: false, error: 'Client not found' },
          { status: 404 }
        );
      }
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (clientId !== undefined) updateData.clientId = clientId;
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    // Update project
    const result = await ProjectModel.updateProject(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete a project (admin only)
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

    // Verify project exists
    const project = await ProjectModel.getProjectById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete project
    const result = await ProjectModel.deleteProject(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

