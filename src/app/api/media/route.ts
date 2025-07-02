import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get all media records from database
    const mediaRecords = await Media.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Also check for files in uploads directory that might not be in database
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    let filesInDirectory: string[] = [];
    
    if (existsSync(uploadsDir)) {
      filesInDirectory = await readdir(uploadsDir);
    }

    // Filter for image files only
    const imageExtensions = ['png', 'jpg', 'jpeg'];
    const imageFiles = filesInDirectory.filter(file => {
      const extension = file.split('.').pop()?.toLowerCase();
      return extension && imageExtensions.includes(extension);
    });

    // Create records for files that exist in directory but not in database
    const orphanedFiles = imageFiles.filter(file => {
      return !mediaRecords.some(record => record.filename === file);
    });

    // Add orphaned files to database
    const orphanedRecords = [];
    for (const file of orphanedFiles) {
      try {
        const stats = await import('fs').then(fs => fs.promises.stat(join(uploadsDir, file)));
        const extension = file.split('.').pop()?.toLowerCase();
        const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
        
        const orphanedRecord = new Media({
          filename: file,
          originalName: file,
          mimeType,
          size: stats.size,
          url: `/uploads/${file}`,
          alt: '',
          caption: '',
          uploadedBy: 'system',
          createdAt: stats.birthtime || new Date(),
          updatedAt: stats.mtime || new Date()
        });

        await orphanedRecord.save();
        orphanedRecords.push(orphanedRecord.toObject());
      } catch (error) {
        console.error(`Error processing orphaned file ${file}:`, error);
      }
    }

    // Combine all records
    const allMedia = [...mediaRecords, ...orphanedRecords]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: allMedia,
      count: allMedia.length
    });

  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Media ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const mediaRecord = await Media.findById(id);
    if (!mediaRecord) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const filePath = join(process.cwd(), 'public', 'uploads', mediaRecord.filename);
    if (existsSync(filePath)) {
      await import('fs').then(fs => fs.promises.unlink(filePath));
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Media ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { alt, caption } = body;

    await dbConnect();
    
    const mediaRecord = await Media.findByIdAndUpdate(
      id,
      { alt, caption },
      { new: true }
    );

    if (!mediaRecord) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mediaRecord
    });

  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update media' },
      { status: 500 }
    );
  }
}