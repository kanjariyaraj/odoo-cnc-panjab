import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { ServiceRequest } from '@/models/ServiceRequest';

// Get admin analytics
export const GET = requireAdmin(async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month'; // week, month, year

    // Get date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get analytics data
    const [
      totalUsers,
      totalMechanics,
      totalRequests,
      activeRequests,
      completedRequests,
      revenueData,
      requestsByType,
      recentRequests
    ] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({ role: 'mechanic', isActive: true }),
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: { $in: ['pending', 'assigned', 'in-progress'] } }),
      ServiceRequest.countDocuments({ 
        status: 'completed',
        'timeline.completed': { $gte: startDate }
      }),
      ServiceRequest.aggregate([
        {
          $match: {
            status: 'completed',
            'timeline.completed': { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.total' },
            avgPrice: { $avg: '$pricing.total' }
          }
        }
      ]),
      ServiceRequest.aggregate([
        {
          $group: {
            _id: '$service.type',
            count: { $sum: 1 },
            revenue: { $sum: '$pricing.total' }
          }
        },
        { $sort: { count: -1 } }
      ]),
      ServiceRequest.find()
        .populate('userId', 'name email')
        .populate('mechanicId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Calculate average response time
    const responseTimeData = await ServiceRequest.aggregate([
      {
        $match: {
          status: { $in: ['assigned', 'in-progress', 'completed'] },
          'timeline.assigned': { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $subtract: ['$timeline.assigned', '$timeline.requested']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    const avgResponseTimeMs = responseTimeData[0]?.avgResponseTime || 0;
    const avgResponseTimeMinutes = Math.round(avgResponseTimeMs / (1000 * 60));

    // Calculate customer satisfaction
    const satisfactionData = await ServiceRequest.aggregate([
      {
        $match: {
          'rating.score': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating.score' }
        }
      }
    ]);

    const customerSatisfaction = satisfactionData[0]?.avgRating || 0;
    const revenue = revenueData[0]?.totalRevenue || 0;

    return NextResponse.json({
      overview: {
        totalUsers,
        totalMechanics,
        totalRequests,
        activeRequests,
        completedRequests: completedRequests,
        revenue: revenue,
        avgResponseTime: `${avgResponseTimeMinutes} min`,
        customerSatisfaction: parseFloat(customerSatisfaction.toFixed(1)),
      },
      requestsByType,
      recentRequests,
      period,
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});