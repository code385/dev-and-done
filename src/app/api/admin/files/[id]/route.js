import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as ProjectFileModel from '@/lib/mongodb/models/ProjectFile';

/**
 * DELETE /api/admin/files/[id]
 * Delete a file (admin only)
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

    // Verify file exists
    const file = await ProjectFileModel.getFileById(id);
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete file
    const result = await ProjectFileModel.deleteFile(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

