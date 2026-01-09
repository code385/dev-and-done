import { NextResponse } from 'next/server';
import { requireClientAuth, getCurrentClient } from '@/lib/auth/client-auth';
import { verifyToken } from '@/lib/auth/verify';
import * as MilestoneModel from '@/lib/mongodb/models/Milestone';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import { ObjectId } from 'mongodb';

/**
 * GET /api/client/milestones?projectId=xxx
 * Get milestones for a specific project (client can only see their own projects)
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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Verify the project belongs to this client
    const project = await ProjectModel.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.clientId.toString() !== client._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get milestones for this project
    const milestones = await MilestoneModel.getMilestonesByProjectId(projectId);

    return NextResponse.json({
      success: true,
      milestones: milestones.map(milestone => ({
        id: milestone._id.toString(),
        projectId: milestone.projectId.toString(),
        title: milestone.title,
        description: milestone.description,
        dueDate: milestone.dueDate,
        status: milestone.status,
        createdAt: milestone.createdAt,
      })),
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/milestones
 * Create a new milestone (admin only)
 */
export async function POST(request) {
  try {
    // Verify admin authentication
    const adminPayload = await verifyToken();
    
    if (!adminPayload || (adminPayload.role !== 'admin' && adminPayload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { projectId, title, description, dueDate, status } = body;

    // Validate required fields
    if (!projectId || !title) {
      return NextResponse.json(
        { success: false, error: 'Project ID and title are required' },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await ProjectModel.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create milestone
    const result = await MilestoneModel.createMilestone({
      projectId,
      title,
      description,
      dueDate,
      status: status || 'pending',
    });

    return NextResponse.json({
      success: true,
      milestoneId: result.id.toString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create milestone' },
      { status: 500 }
    );
  }
}

