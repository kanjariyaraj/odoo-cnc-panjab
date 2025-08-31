import { NextResponse } from 'next/server';
import { requireUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import mongoose from 'mongoose';

// Debug endpoint to test employee data
export const GET = requireUser(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    console.log('Debug Employee Data - Admin ID:', req.user!.id);

    // Only admins can debug
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can access debug endpoint' },
        { status: 403 }
      );
    }

    // Get all users to debug the data structure
    const allUsers = await User.find({ role: 'mechanic', isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get employees specifically for this admin with string ID
    const employeesStringId = await User.find({
      role: 'mechanic',
      shopId: req.user!.id, // String version
      isActive: true
    }).select('-password').sort({ createdAt: -1 });

    // Get employees specifically for this admin with ObjectId
    const employeesObjectId = await User.find({
      role: 'mechanic',
      shopId: new mongoose.Types.ObjectId(req.user!.id), // ObjectId version
      isActive: true
    }).select('-password').sort({ createdAt: -1 });

    // Debug admin user
    const adminUser = await User.findById(req.user!.id).select('-password');

    return NextResponse.json({
      debug: {
        adminId: req.user!.id,
        adminIdType: typeof req.user!.id,
        adminUser: adminUser,
        allMechanics: allUsers.length,
        employeesStringId: employeesStringId.length,
        employeesObjectId: employeesObjectId.length,
        mechanicsData: allUsers.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          shopId: user.shopId,
          shopIdType: typeof user.shopId,
          shopIdString: user.shopId?.toString()
        }))
      },
      employees: employeesObjectId,
      totalEmployees: employeesObjectId.length
    });
  } catch (error) {
    console.error('Debug employees error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
});