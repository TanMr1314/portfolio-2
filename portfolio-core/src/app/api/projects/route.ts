import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

// Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const projects = await db.project.findMany({
      where: category ? { category } : undefined,
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: '获取作品失败' },
      { status: 500 }
    );
  }
}

// Create project (requires auth)
export async function POST(request: NextRequest) {
  try {
    // Check auth
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    const project = await db.project.create({
      data: {
        title: data.title,
        description: data.description || '',
        category: data.category,
        coverImage: data.coverImage,
        images: JSON.stringify(data.images || []),
        order: data.order || 0,
      },
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: '创建作品失败' },
      { status: 500 }
    );
  }
}

// Update project (requires auth)
export async function PUT(request: NextRequest) {
  try {
    // Check auth
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    const project = await db.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        coverImage: data.coverImage,
        images: JSON.stringify(data.images || []),
        order: data.order,
      },
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: '更新作品失败' },
      { status: 500 }
    );
  }
}

// Delete project (requires auth)
export async function DELETE(request: NextRequest) {
  try {
    // Check auth
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少作品ID' },
        { status: 400 }
      );
    }
    
    await db.project.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: '删除作品失败' },
      { status: 500 }
    );
  }
}
