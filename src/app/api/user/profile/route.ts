import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Mechanic } from '@/models/Mechanic';

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

    // If user is a mechanic, include mechanic data
    let userData = user.toJSON();
    if (user.role === 'mechanic') {
      const mechanic = await Mechanic.findOne({ userId: user._id });
      if (mechanic) {
        userData = { ...userData, mechanicProfile: mechanic.toJSON() };
      }
    }

    return NextResponse.json({ user: userData });
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
    const { name, phone, profile, mechanicData } = body;

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

    // Update mechanic profile if provided and user is a mechanic
    if (user.role === 'mechanic' && mechanicData) {
      await Mechanic.findOneAndUpdate(
        { userId: user._id },
        mechanicData,
        { new: true, runValidators: true }
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