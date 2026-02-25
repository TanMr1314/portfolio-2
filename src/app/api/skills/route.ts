import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all skills
export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: { order: 'asc' },
    });
    
    // 如果没有数据，返回默认技能
    if (skills.length === 0) {
      return NextResponse.json([
        { id: '1', name: 'Photoshop', level: 95, order: 0 },
        { id: '2', name: 'Figma', level: 90, order: 1 },
        { id: '3', name: 'Sketch', level: 85, order: 2 },
        { id: '4', name: 'Illustrator', level: 88, order: 3 },
        { id: '5', name: 'Cinema 4D', level: 75, order: 4 },
        { id: '6', name: 'AI/Midjourney', level: 80, order: 5 },
      ]);
    }
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create new skill
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, level, order } = data;

    if (!name) {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    const skill = await db.skill.create({
      data: {
        name,
        level: level || 80,
        order: order || 0,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

// PUT - Update skill
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, name, level, order } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing skill ID' }, { status: 400 });
    }

    const skill = await db.skill.update({
      where: { id },
      data: {
        name,
        level,
        order,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

// DELETE - Delete skill
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing skill ID' }, { status: 400 });
    }

    await db.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
