import { NextResponse } from 'next/server';
import { requireClientAuth, getCurrentClient } from '@/lib/auth/client-auth';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import * as ClientModel from '@/lib/mongodb/models/Client';

/**
 * GET /api/client/projects
 * Get all projects for the authenticated client
 */
export async function GET(request) {
  try {
    // Verify client authentication
    const payload = await requireClientAuth();
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get projects for this client only
    const projects = await ProjectModel.getProjectsByClientId(client._id.toString());

    return NextResponse.json({
      success: true,
      projects: projects.map(project => ({
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
      })),
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error fetching client projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

