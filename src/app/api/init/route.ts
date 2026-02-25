import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if admin exists
    const existingAdmin = await db.user.findUnique({
      where: { username: 'admin' },
    });
    
    if (!existingAdmin) {
      // Create admin user
      await db.user.create({
        data: {
          username: 'admin',
          password: 'admin123',
        },
      });
    }
    
    // Check if projects exist
    const existingProjects = await db.project.count();
    
    if (existingProjects === 0) {
      // Seed default projects
      const defaultProjects = [
        // B端UI设计
        {
          title: '拜特资金管理B端系统',
          description: '拜特-T6资金管理SaaS系统旨在为企业提供一个综合的资金管理平台。专为企业设计的在线资金管理解决方案，帮助企业实现高效、透明、安全的资金管理。系统集成了多种功能模块，包括现金流管理、预算控制、资金调拨、支付管理和报表分析等。',
          category: 'ToB',
          coverImage: '/portfolio/page_04.png',
          images: JSON.stringify(['/portfolio/page_04.png', '/portfolio/page_05.png', '/portfolio/page_06.png', '/portfolio/page_07.png', '/portfolio/page_08.png', '/portfolio/page_09.png', '/portfolio/page_10.png']),
          order: 1,
        },
        {
          title: 'Dnspod域名管理系统',
          description: 'DNSPod是腾讯云子品牌，负责域名解析服务的核心平台。本次改版优化了系统导航框架、首页核心布局、用户帮助模块，提升了域名注册率和用户管理效率。',
          category: 'Web',
          coverImage: '/portfolio/page_21.png',
          images: JSON.stringify(['/portfolio/page_21.png', '/portfolio/page_22.png', '/portfolio/page_23.png', '/portfolio/page_24.png', '/portfolio/page_25.png', '/portfolio/page_26.png', '/portfolio/page_27.png', '/portfolio/page_28.png', '/portfolio/page_29.png', '/portfolio/page_30.png']),
          order: 2,
        },
        {
          title: 'OPPO财政管理系统',
          description: '负责OPPO企业内部的财资SaaS管理系统的UI全流程设计，并负责其官网视觉与交互的重构。',
          category: 'ToB',
          coverImage: '/portfolio/page_13.png',
          images: JSON.stringify(['/portfolio/page_13.png', '/portfolio/page_14.png', '/portfolio/page_15.png', '/portfolio/page_16.png', '/portfolio/page_17.png']),
          order: 3,
        },
        // C端APP设计
        {
          title: '拜特司库资金管理系统APP',
          description: '企业司库资金管理移动端应用，支持PC端、手机端、可视化大屏多端适配。',
          category: 'App',
          coverImage: '/portfolio/page_11.png',
          images: JSON.stringify(['/portfolio/page_11.png', '/portfolio/page_12.png']),
          order: 4,
        },
        {
          title: 'Dnspod域名管理移动端',
          description: 'DNSPod域名解析服务移动端应用，提供便捷的域名管理和DNS解析功能。',
          category: 'App',
          coverImage: '/portfolio/page_23.png',
          images: JSON.stringify(['/portfolio/page_23.png', '/portfolio/page_24.png']),
          order: 5,
        },
        {
          title: '企业大学APP',
          description: '企业内部培训学习平台移动端应用，提供在线课程、学习进度追踪等功能。',
          category: 'App',
          coverImage: '/portfolio/page_49.png',
          images: JSON.stringify(['/portfolio/page_49.png', '/portfolio/page_50.png']),
          order: 6,
        },
        // AI平面3D设计
        {
          title: '域名运营活动页设计',
          description: 'DNSPod与腾讯云品牌共同发起的折扣活动页面设计，包括乐享盛夏、新春大促、低价突袭季等活动，使用C4D效果设计，夜色炫光灯效果吸引用户视线。',
          category: 'GD',
          coverImage: '/portfolio/page_50.png',
          images: JSON.stringify(['/portfolio/page_50.png', '/portfolio/page_51.png', '/portfolio/page_52.png']),
          order: 7,
        },
        {
          title: 'C4D视觉设计',
          description: '使用Cinema 4D创作的三维视觉设计作品，展示科技感与艺术性的结合。',
          category: 'AI',
          coverImage: '/portfolio/page_53.png',
          images: JSON.stringify(['/portfolio/page_53.png', '/portfolio/page_54.png']),
          order: 8,
        },
        {
          title: '专题页设计',
          description: '各类专题页面设计，包括营销活动页、产品介绍页等，注重视觉冲击力和用户体验。',
          category: 'GD',
          coverImage: '/portfolio/page_55.png',
          images: JSON.stringify(['/portfolio/page_55.png', '/portfolio/page_56.png']),
          order: 9,
        },
      ];
      
      for (const project of defaultProjects) {
        await db.project.create({ data: project });
      }
    }

    // Check if work experiences exist
    const existingExperiences = await db.workExperience.count();
    
    if (existingExperiences === 0) {
      // Seed default work experiences
      const defaultExperiences = [
        {
          company: '深圳拜特科技信息有限公司',
          position: 'UI/UX设计师',
          period: '2023/03 - 2026/03',
          description: '作为核心设计师，全面负责公司品牌与产品体验。主导完成重庆农商行、华兴银行等司库系统UI设计及司库4.0产品线全流程设计。',
          highlights: JSON.stringify(['主导司库系统4.0产品设计', '完成多家银行资金管理系统设计', '建立设计规范与组件库']),
          order: 1,
        },
        {
          company: '佰均成科技-OPPO',
          position: 'UI设计师',
          period: '2022/06 - 2023/03',
          description: '负责OPPO企业内部的财资SaaS管理系统的UI全流程设计，并负责其官网视觉与交互的重构。',
          highlights: JSON.stringify(['财资SaaS系统全流程设计', '官网视觉与交互重构', '提升用户体验和操作效率']),
          order: 2,
        },
        {
          company: '软通动力-腾讯云',
          position: 'UI设计师',
          period: '2019/06 - 2022/06',
          description: '在公司负责腾讯云旗下产品视觉设计以及UI设计，主要工作内容有：B端DNSpod官网、域名管理系统等产品设计。',
          highlights: JSON.stringify(['DNSPod官网设计改版', '域名管理系统优化', '建立设计规范体系']),
          order: 3,
        },
      ];
      
      for (const experience of defaultExperiences) {
        await db.workExperience.create({ data: experience });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '初始化完成',
      adminCreated: !existingAdmin,
      projectsSeeded: existingProjects === 0,
      experiencesSeeded: existingExperiences === 0,
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: '初始化失败', details: String(error) },
      { status: 500 }
    );
  }
}
