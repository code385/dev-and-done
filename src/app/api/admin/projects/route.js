import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/auth/verify';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import * as ClientModel from '@/lib/mongodb/models/Client';

/**
 * GET /api/admin/projects
 * Get all projects (admin only)
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
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Build filter
    const filter = {};
    if (clientId) {
      filter.clientId = new ObjectId(clientId);
    }
    if (status) {
      filter.status = status;
    }

    const projects = await ProjectModel.getProjects(filter, limit);

    // Populate client information
    const projectsWithClients = await Promise.all(
      projects.map(async (project) => {
        let client = null;
        if (project.clientId) {
          try {
            client = await ClientModel.getClientById(project.clientId.toString());
          } catch (error) {
            console.error('Error fetching client:', error);
          }
        }

        return {
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
        };
      })
    );

    return NextResponse.json({
      success: true,
      projects: projectsWithClients,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects
 * Create a new project (admin only)
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
    const { title, description, clientId, status, startDate, endDate } = body;

    // Validate required fields
    if (!title || !clientId) {
      return NextResponse.json(
        { success: false, error: 'Title and client ID are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await ClientModel.getClientById(clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create project data
    const projectData = {
      title,
      description: description || '',
      clientId,
      status: status || 'active',
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || null,
    };

    // Create project
    const result = await ProjectModel.createProject(projectData);

    return NextResponse.json({
      success: true,
      projectId: result.id.toString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

