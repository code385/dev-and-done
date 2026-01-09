import { NextResponse } from 'next/server';
import { requireClientAuth } from '@/lib/auth/client-auth';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    // Verify client authentication
    await requireClientAuth();

    const formData = await request.formData();
    const file = formData.get('file');
    const projectId = formData.get('projectId');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `client-files/${projectId}/${timestamp}_${sanitizedFileName}`;

    let publicUrl;

    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN in Vercel environment variables.',
          details: 'Visit https://vercel.com/docs/storage/vercel-blob to set up blob storage.'
        },
        { status: 500 }
      );
    }

    // Use Vercel Blob Storage (required for production)
    try {
      // Upload to Vercel Blob Storage with organized path
      const blob = await put(fileName, buffer, {
        access: 'public',
        contentType: file.type,
      });
      publicUrl = blob.url;
    } catch (blobError) {
      console.error('Vercel Blob upload error:', blobError);
      console.error('Error details:', {
        message: blobError.message,
        name: blobError.name,
        stack: blobError.stack,
      });
      
      // Return detailed error for debugging
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to upload to blob storage',
          details: process.env.NODE_ENV === 'development' 
            ? blobError.message 
            : 'Check Vercel Blob configuration and token permissions.',
          blobError: process.env.NODE_ENV === 'development' ? {
            message: blobError.message,
            name: blobError.name,
          } : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error uploading client file:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An unexpected error occurred. Check server logs for details.',
        errorType: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

