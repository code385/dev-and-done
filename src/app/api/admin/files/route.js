import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as ProjectFileModel from '@/lib/mongodb/models/ProjectFile';
import * as ProjectModel from '@/lib/mongodb/models/Project';

/**
 * GET /api/admin/files?projectId=xxx
 * Get all files (admin only)
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

    let files;
    if (projectId) {
      // Get files for specific project
      files = await ProjectFileModel.getFilesByProjectId(projectId);
    } else {
      // Get all files (you might want to add a getAllFiles method to the model)
      // For now, we'll require projectId
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      files: files.map(file => ({
        id: file._id.toString(),
        projectId: file.projectId?.toString() || null,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileType: file.fileType || 'other',
        fileSize: file.fileSize || 0,
        uploadedBy: file.uploadedBy || 'admin',
        uploadedById: file.uploadedById?.toString() || null,
        createdAt: file.createdAt ? file.createdAt.toISOString() : null,
        updatedAt: file.updatedAt ? file.updatedAt.toISOString() : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/files
 * Upload a file (admin only)
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

    const contentType = request.headers.get('content-type') || '';
    
    let projectId, fileName, fileUrl, fileType, fileSize;

    // Handle both JSON and FormData
    if (contentType.includes('application/json')) {
      const body = await request.json();
      projectId = body.projectId;
      fileName = body.fileName;
      fileUrl = body.fileUrl;
      fileType = body.fileType || 'other';
      fileSize = body.fileSize || 0;
    } else {
      const formData = await request.formData();
      projectId = formData.get('projectId');
      fileName = formData.get('fileName');
      fileUrl = formData.get('fileUrl');
      fileType = formData.get('fileType') || 'other';
      fileSize = formData.get('fileSize') || 0;
    }

    if (!projectId || !fileName || !fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Project ID, file name, and file URL are required' },
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

    // Create file record
    const result = await ProjectFileModel.createProjectFile({
      projectId,
      fileName,
      fileUrl,
      fileType,
      fileSize: parseInt(fileSize),
      uploadedBy: 'admin',
      uploadedById: payload.id,
    });

    return NextResponse.json({
      success: true,
      fileId: result.id.toString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

