import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch bio
export async function GET() {
  try {
    let bio = await db.bio.findFirst();
    
    // 如果没有数据，返回默认值
    if (!bio) {
      bio = {
        id: '',
        intro: '5年设计经验，参与百万级产品设计工作以及产品交互逻辑设计，专注于UI设计、交互设计，精通Sketch、PS、AI、C4D等设计视觉软件。\n根据需求输出交互原型、UI视觉设计、动效设计、组件化规范制定、汇报及调整设计方案，并往前往后参与到前期调研、需求分析、设计落地跟进、设计走查、数据埋点与分析验证。\n此外能够协助进行IP设计、品牌设计、海报设计。',
        email: '13430974149@163.com',
        wechat: 'im-ahjun',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    return NextResponse.json(bio);
  } catch (error) {
    console.error('Error fetching bio:', error);
    return NextResponse.json({ intro: '', email: '', wechat: '' }, { status: 200 });
  }
}

// PUT - Update bio
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { intro, email, wechat } = data;

    // 查找现有记录
    let bio = await db.bio.findFirst();

    if (bio) {
      // 更新现有记录
      bio = await db.bio.update({
        where: { id: bio.id },
        data: {
          intro: intro || '',
          email: email || '',
          wechat: wechat || '',
        },
      });
    } else {
      // 创建新记录
      bio = await db.bio.create({
        data: {
          intro: intro || '',
          email: email || '',
          wechat: wechat || '',
        },
      });
    }

    return NextResponse.json(bio);
  } catch (error) {
    console.error('Error updating bio:', error);
    return NextResponse.json({ error: 'Failed to update bio' }, { status: 500 });
  }
}
