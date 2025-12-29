import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyToken } from '@/lib/auth/verify';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    // Verify authentication
    const payload = await verifyToken();
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed (JPEG, PNG, WebP)' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `books/cover-images/${timestamp}_${sanitizedFileName}`;

    let publicUrl;

    // Use Vercel Blob if token is available (production/preview), otherwise use filesystem (local dev)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // Upload to Vercel Blob Storage with organized path
        const blob = await put(fileName, buffer, {
          access: 'public',
          contentType: file.type,
        });
        publicUrl = blob.url;
      } catch (blobError) {
        console.error('Vercel Blob upload error:', blobError);
        // Fallback to filesystem if Blob fails
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'books', 'cover-images');
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }
        const filePath = join(uploadsDir, `${timestamp}_${sanitizedFileName}`);
        await writeFile(filePath, buffer);
        publicUrl = `/uploads/books/cover-images/${timestamp}_${sanitizedFileName}`;
      }
    } else {
      // Development: Use filesystem (local dev without Blob token)
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'books', 'cover-images');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      const filePath = join(uploadsDir, `${timestamp}_${sanitizedFileName}`);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/books/cover-images/${timestamp}_${sanitizedFileName}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
