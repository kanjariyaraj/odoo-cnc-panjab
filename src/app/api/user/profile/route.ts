import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

// Get current user profile
export const GET = requireUser(async (req) => {
  try {
    await connectDB();

    const user = await User.findById(req.user!.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (mechanic profile is now part of User model)
    return NextResponse.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Update user profile
export const PUT = requireUser(async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, profile } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profile) updateData.profile = { ...updateData.profile, ...profile };

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});