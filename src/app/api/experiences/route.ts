import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all work experiences
export async function GET() {
  try {
    const experiences = await db.workExperience.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create new work experience
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { company, position, period, description, highlights, order } = data;

    if (!company || !position || !period) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const experience = await db.workExperience.create({
      data: {
        company,
        position,
        period,
        description: description || '',
        highlights: JSON.stringify(highlights || []),
        order: order || 0,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

// PUT - Update work experience
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, company, position, period, description, highlights, order } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing experience ID' }, { status: 400 });
    }

    const experience = await db.workExperience.update({
      where: { id },
      data: {
        company,
        position,
        period,
        description,
        highlights: JSON.stringify(highlights || []),
        order,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

// DELETE - Delete work experience
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing experience ID' }, { status: 400 });
    }

    await db.workExperience.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
