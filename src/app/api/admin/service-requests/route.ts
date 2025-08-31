import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { ServiceRequest } from '@/models/ServiceRequest';
import { User } from '@/models/User';
import mongoose from 'mongoose';

// Get service requests for admin (shop owner)
export const GET = requireUser(async (req: NextRequest) => {
  try {
    await connectDB();

    // Only admins can view admin service requests
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can view service requests' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = {
      $or: [
        { adminId: req.user!.id }, // Requests assigned to this admin
        { status: 'pending' }, // New requests waiting for assignment
      ]
    };

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await ServiceRequest.find(query)
      .populate('userId', 'name email phone')
      .populate('adminId', 'name shopName')
      .populate('mechanicId', 'name email phone profile.specialties')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out requests where userId population failed (user was deleted)
    const validRequests = requests.filter(request => request.userId != null);

    const total = await ServiceRequest.countDocuments(query);

    // Get admin's employees for assignment
    const employees = await User.find({
      role: 'mechanic',
      shopId: new mongoose.Types.ObjectId(req.user!.id),
      isActive: true
    }).select('name email profile.specialties');

    return NextResponse.json({
      requests: validRequests,
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get admin service requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Assign service request to admin's shop
export const POST = requireUser(async (req: NextRequest) => {
  try {
    await connectDB();

    // Only admins can assign requests
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can assign service requests' },
        { status: 403 }
      );
    }

    const { requestId, action } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const serviceRequest = await ServiceRequest.findById(requestId);
    
    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      );
    }

    if (action === 'claim') {
      // Admin claims the request for their shop
      if (serviceRequest.status !== 'pending') {
        return NextResponse.json(
          { error: 'Can only claim pending requests' },
          { status: 400 }
        );
      }

      serviceRequest.adminId = req.user!.id;
      serviceRequest.status = 'admin-review';
      serviceRequest.timeline.assigned = new Date();
      
      await serviceRequest.save();

      await serviceRequest.populate([
        { path: 'userId', select: 'name email phone' },
        { path: 'adminId', select: 'name shopName' }
      ]);

      return NextResponse.json({
        message: 'Service request claimed successfully',
        request: serviceRequest,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Assign service request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Assign request to specific employee
export const PUT = requireUser(async (req: NextRequest) => {
  try {
    await connectDB();

    // Only admins can assign to employees
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can assign to employees' },
        { status: 403 }
      );
    }

    const { requestId, mechanicId } = await req.json();

    if (!requestId || !mechanicId) {
      return NextResponse.json(
        { error: 'Request ID and mechanic ID are required' },
        { status: 400 }
      );
    }

    const serviceRequest = await ServiceRequest.findById(requestId);
    
    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      );
    }

    // Make sure the request belongs to this admin
    if (serviceRequest.adminId?.toString() !== req.user!.id) {
      return NextResponse.json(
        { error: 'Not authorized to assign this request' },
        { status: 403 }
      );
    }

    // Make sure the mechanic belongs to this admin's shop
    const mechanic = await User.findOne({
      _id: mechanicId,
      role: 'mechanic',
      shopId: new mongoose.Types.ObjectId(req.user!.id),
      isActive: true
    });

    if (!mechanic) {
      return NextResponse.json(
        { error: 'Mechanic not found or not authorized' },
        { status: 404 }
      );
    }

    // Assign the mechanic
    serviceRequest.mechanicId = mechanicId;
    serviceRequest.status = 'assigned';
    serviceRequest.timeline.assigned = new Date();
    
    await serviceRequest.save();

    await serviceRequest.populate([
      { path: 'userId', select: 'name email phone' },
      { path: 'adminId', select: 'name shopName' },
      { path: 'mechanicId', select: 'name email phone profile.specialties' }
    ]);

    return NextResponse.json({
      message: 'Service request assigned to employee successfully',
      request: serviceRequest,
    });
  } catch (error) {
    console.error('Assign to employee error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});