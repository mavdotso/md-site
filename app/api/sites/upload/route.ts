import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/cloudflare';
import matter from 'gray-matter';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const siteName = formData.get('siteName') as string;

    if (!file || !siteName) {
      return NextResponse.json(
        { error: 'File and site name are required' },
        { status: 400 }
      );
    }

    // Validate site name
    if (!/^[a-z0-9-]+$/.test(siteName)) {
      return NextResponse.json(
        { error: 'Site name can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();
    
    // Parse frontmatter if present
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    // Upload to R2 with metadata
    const result = await uploadToR2(siteName, content, {
      title: frontmatter.title || siteName,
      description: frontmatter.description || '',
      originalFileName: file.name,
    });

    return NextResponse.json({
      success: true,
      siteName,
      url: result.url,
      message: 'Site published successfully!',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload site' },
      { status: 500 }
    );
  }
}