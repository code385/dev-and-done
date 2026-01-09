import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as MilestoneModel from '@/lib/mongodb/models/Milestone';
import * as ProjectModel from '@/lib/mongodb/models/Project';

/**
 * GET /api/admin/milestones?projectId=xxx
 * Get all milestones (admin only)
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
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Build filter - use getMilestonesByProjectId if projectId is provided
    let milestones;
    if (projectId) {
      milestones = await MilestoneModel.getMilestonesByProjectId(projectId);
    } else {
      milestones = await MilestoneModel.getMilestones({}, limit);
    }

    return NextResponse.json({
      success: true,
      milestones: milestones.map(milestone => ({
        id: milestone._id.toString(),
        projectId: milestone.projectId?.toString() || null,
        title: milestone.title,
        description: milestone.description || '',
        dueDate: milestone.dueDate ? milestone.dueDate.toISOString() : null,
        status: milestone.status,
        createdAt: milestone.createdAt ? milestone.createdAt.toISOString() : null,
        updatedAt: milestone.updatedAt ? milestone.updatedAt.toISOString() : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/milestones
 * Create a new milestone (admin only)
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
      description: description || '',
      dueDate: dueDate || null,
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

