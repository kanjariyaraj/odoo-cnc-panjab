import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { validateRole } from '@/lib/auth-middleware';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, name, phone, role = 'user' } = body;

    // Only allow user and admin registration via public signup
    // Mechanics must be created by admins through employee management
    if (role === 'mechanic') {
      return NextResponse.json(
        { error: 'Mechanic accounts can only be created by shop owners. Please contact a shop owner to create your account.' },
        { status: 403 }
      );
    }

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
    const userData: any = {
      email: email.toLowerCase(),
      password,
      name,
      phone,
      role,
      isActive: true,
    };

    // For admin users, require shop name
    if (role === 'admin') {
      const { shopName } = body;
      if (!shopName || !shopName.trim()) {
        return NextResponse.json(
          { error: 'Shop name is required for admin accounts' },
          { status: 400 }
        );
      }
      userData.shopName = shopName.trim();
    }

    const user = new User(userData);
    await user.save();

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