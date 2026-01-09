import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as MilestoneModel from '@/lib/mongodb/models/Milestone';

/**
 * PUT /api/admin/milestones/[id]
 * Update a milestone (admin only)
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
    const { title, description, dueDate, status } = body;

    // Verify milestone exists
    const existingMilestone = await MilestoneModel.getMilestoneById(id);
    if (!existingMilestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    // Update milestone
    const result = await MilestoneModel.updateMilestone(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update milestone' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone updated successfully',
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update milestone' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/milestones/[id]
 * Delete a milestone (admin only)
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

    // Verify milestone exists
    const milestone = await MilestoneModel.getMilestoneById(id);
    if (!milestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      );
    }

    // Delete milestone
    const result = await MilestoneModel.deleteMilestone(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete milestone' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete milestone' },
      { status: 500 }
    );
  }
}

