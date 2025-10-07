import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vault from '@/models/Vault';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { title, username, password, url, notes } = await request.json();

    const vault = await Vault.findOne({ _id: id, userId: user.userId });

    if (!vault) {
      return NextResponse.json(
        { error: 'Vault entry not found' },
        { status: 404 }
      );
    }

    if (title) vault.title = title;
    if (username !== undefined) vault.username = username;
    if (password) vault.password = password;
    if (url !== undefined) vault.url = url;
    if (notes !== undefined) vault.notes = notes;

    await vault.save();

    return NextResponse.json({ message: 'Vault entry updated', vault });
  } catch (error) {
    console.error('Update vault error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const vault = await Vault.findOneAndDelete({ _id: id, userId: user.userId });

    if (!vault) {
      return NextResponse.json(
        { error: 'Vault entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Vault entry deleted' });
  } catch (error) {
    console.error('Delete vault error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
