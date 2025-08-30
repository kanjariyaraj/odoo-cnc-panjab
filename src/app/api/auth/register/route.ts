import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Mechanic } from '@/models/Mechanic';
import { validateRole } from '@/lib/auth-middleware';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, name, phone, role = 'user', mechanicData } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (!validateRole(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const userData = {
      email: email.toLowerCase(),
      password,
      name,
      phone,
      role,
      isActive: true,
    };

    const user = new User(userData);
    await user.save();

    // If role is mechanic, create mechanic profile
    if (role === 'mechanic' && mechanicData) {
      const mechanic = new Mechanic({
        userId: user._id,
        ...mechanicData,
      });
      await mechanic.save();
    }

    // Return user without password
    const { password: _, ...userResponse } = user.toJSON();

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}