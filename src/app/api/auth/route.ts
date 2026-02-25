import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

// Login
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const user = await db.user.findFirst({
      where: { username, password },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username } 
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}

// Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '登出失败' },
      { status: 500 }
    );
  }
}

// Check auth status
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }
    
    const user = await db.user.findUnique({
      where: { id: token.value },
    });
    
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }
    
    return NextResponse.json({ 
      authenticated: true, 
      user: { id: user.id, username: user.username } 
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
