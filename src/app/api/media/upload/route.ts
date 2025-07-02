import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const caption = formData.get('caption') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (only PNG and JPG)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'File must be a PNG or JPG image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for website performance)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB for optimal website performance' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}.${extension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Write file
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${filename}`;

    // Connect to database and save media record
    await dbConnect();

    const mediaRecord = new Media({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: publicUrl,
      alt: alt || '',
      caption: caption || '',
      uploadedBy: 'admin' // For now, we'll use 'admin' as default
    });

    await mediaRecord.save();

    return NextResponse.json({
      success: true,
      data: {
        _id: mediaRecord._id,
        filename: mediaRecord.filename,
        originalName: mediaRecord.originalName,
        mimeType: mediaRecord.mimeType,
        size: mediaRecord.size,
        url: mediaRecord.url,
        alt: mediaRecord.alt,
        caption: mediaRecord.caption,
        uploadedBy: mediaRecord.uploadedBy,
        createdAt: mediaRecord.createdAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}