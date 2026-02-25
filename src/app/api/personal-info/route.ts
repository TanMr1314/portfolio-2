import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch personal info
export async function GET() {
  try {
    let personalInfo = await db.personalInfo.findFirst();
    
    // If no record exists, create default one
    if (!personalInfo) {
      personalInfo = await db.personalInfo.create({
        data: {
          bio: '5年设计经验，参与百万级产品设计工作以及产品交互逻辑设计，专注于UI设计、交互设计，精通Sketch、PS、AI、C4D等设计视觉软件。\n\n根据需求输出交互原型、UI视觉设计、动效设计、组件化规范制定、汇报及调整设计方案，并往前往后参与到前期调研、需求分析、设计落地跟进、设计走查、数据埋点与分析验证。\n\n此外能够协助进行IP设计、品牌设计、海报设计。',
          email: '13430974149@163.com',
          wechat: 'im-ahjun',
        },
      });
    }
    
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    return NextResponse.json({ error: 'Failed to fetch personal info' }, { status: 500 });
  }
}

// PUT - Update personal info
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { bio, email, wechat } = data;

    let personalInfo = await db.personalInfo.findFirst();
    
    if (personalInfo) {
      // Update existing record
      personalInfo = await db.personalInfo.update({
        where: { id: personalInfo.id },
        data: {
          bio: bio || '',
          email: email || '',
          wechat: wechat || '',
        },
      });
    } else {
      // Create new record
      personalInfo = await db.personalInfo.create({
        data: {
          bio: bio || '',
          email: email || '',
          wechat: wechat || '',
        },
      });
    }

    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Error updating personal info:', error);
    return NextResponse.json({ error: 'Failed to update personal info' }, { status: 500 });
  }
}
