import { NextResponse } from 'next/server';
import { requireClientAuth, getCurrentClient } from '@/lib/auth/client-auth';
import { verifyToken } from '@/lib/auth/verify';
import * as ProjectFileModel from '@/lib/mongodb/models/ProjectFile';
import * as ProjectModel from '@/lib/mongodb/models/Project';
import { ObjectId } from 'mongodb';

/**
 * GET /api/client/files?projectId=xxx
 * Get files for a specific project (client can only see their own projects)
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

    // Get files for this project
    const files = await ProjectFileModel.getFilesByProjectId(projectId);

    return NextResponse.json({
      success: true,
      files: files.map(file => ({
        id: file._id.toString(),
        projectId: file.projectId.toString(),
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileType: file.fileType,
        fileSize: file.fileSize,
        uploadedBy: file.uploadedBy,
        createdAt: file.createdAt,
      })),
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error fetching files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/files
 * Upload a file (client or admin)
 * Accepts both JSON and FormData
 */
export async function POST(request) {
  try {
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
      // Handle FormData
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

    let uploadedBy = 'admin';
    let uploadedById = null;

    // Check if client or admin
    try {
      const clientPayload = await requireClientAuth();
      const client = await getCurrentClient();
      
      // Verify client owns this project
      if (project.clientId.toString() !== client._id.toString()) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }
      
      uploadedBy = 'client';
      uploadedById = client._id.toString();
    } catch (clientError) {
      // Not a client, check if admin
      const adminPayload = await verifyToken();
      if (!adminPayload || (adminPayload.role !== 'admin' && adminPayload.role !== 'founder')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
      uploadedById = adminPayload.id;
    }

    // Create file record
    const result = await ProjectFileModel.createProjectFile({
      projectId,
      fileName,
      fileUrl,
      fileType,
      fileSize: parseInt(fileSize),
      uploadedBy,
      uploadedById,
    });

    return NextResponse.json({
      success: true,
      fileId: result.id.toString(),
    }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

