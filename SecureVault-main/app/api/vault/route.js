import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vault from '@/models/Vault';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = { userId: user.userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const vaults = await Vault.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ vaults });
  } catch (error) {
    console.error('Get vaults error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, username, password, url, notes } = await request.json();

    if (!title || !password) {
      return NextResponse.json(
        { error: 'Title and password are required' },
        { status: 400 }
      );
    }

    const vault = await Vault.create({
      userId: user.userId,
      title,
      username: username || '',
      password,
      url: url || '',
      notes: notes || '',
    });

    return NextResponse.json(
      { message: 'Vault entry created', vault },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create vault error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
