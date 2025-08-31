import { NextResponse } from 'next/server';
import { requireUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { ServiceRequest } from '@/models/ServiceRequest';
import { User } from '@/models/User';

// Get employee performance statistics
export const GET = requireUser(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    // Only admins can view employee statistics
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can view employee statistics' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Verify the employee belongs to this admin's shop
    const employee = await User.findOne({
      _id: employeeId,
      role: 'mechanic',
      shopId: req.user!.id
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found or not authorized' },
        { status: 404 }
      );
    }

    // Get employee statistics
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const [
      totalCompletedJobs,
      monthlyCompletedJobs,
      weeklyCompletedJobs,
      averageRating,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      // Total completed jobs
      ServiceRequest.countDocuments({
        mechanicId: employeeId,
        status: 'completed'
      }),

      // Monthly completed jobs
      ServiceRequest.countDocuments({
        mechanicId: employeeId,
        status: 'completed',
        'timeline.completed': { $gte: startOfMonth }
      }),

      // Weekly completed jobs
      ServiceRequest.countDocuments({
        mechanicId: employeeId,
        status: 'completed',
        'timeline.completed': { $gte: startOfWeek }
      }),

      // Average rating (placeholder - would need a rating system)
      Promise.resolve(employee.profile.rating || 0),

      // Total revenue generated
      ServiceRequest.aggregate([
        { $match: { mechanicId: employeeId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]).then(result => result[0]?.total || 0),

      // Monthly revenue
      ServiceRequest.aggregate([
        { 
          $match: { 
            mechanicId: employeeId, 
            status: 'completed',
            'timeline.completed': { $gte: startOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    // Recent completed jobs
    const recentJobs = await ServiceRequest.find({
      mechanicId: employeeId,
      status: 'completed'
    })
    .populate('userId', 'name email')
    .sort({ 'timeline.completed': -1 })
    .limit(5)
    .select('service vehicle pricing timeline userId');

    return NextResponse.json({
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        profile: employee.profile
      },
      statistics: {
        totalCompletedJobs,
        monthlyCompletedJobs,
        weeklyCompletedJobs,
        averageRating,
        totalRevenue,
        monthlyRevenue
      },
      recentJobs
    });
  } catch (error) {
    console.error('Get employee statistics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});