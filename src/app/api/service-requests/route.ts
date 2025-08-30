import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { ServiceRequest } from '@/models/ServiceRequest';
import { User } from '@/models/User';
import { Mechanic } from '@/models/Mechanic';

// Get service requests
export const GET = requireUser(async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = {};

    // Filter by user role
    if (req.user!.role === 'user') {
      query.userId = req.user!.id;
    } else if (req.user!.role === 'mechanic') {
      // Mechanics see: assigned to them, pending requests, or in-progress requests they're handling
      query.$or = [
        { mechanicId: req.user!.id }, // Tasks assigned to this mechanic
        { status: 'pending' }, // Available tasks
        { status: 'assigned', mechanicId: { $exists: false } }, // Unassigned tasks
      ];
      console.log('Mechanic query filter:', JSON.stringify(query, null, 2));
    }
    // Admin can see all requests (no additional filter)

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await ServiceRequest.find(query)
      .populate('userId', 'name email phone')
      .populate('mechanicId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ServiceRequest.countDocuments(query);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get service requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Create new service request
export const POST = requireUser(async (req) => {
  try {
    await connectDB();

    // Only users can create service requests
    if (req.user!.role !== 'user') {
      return NextResponse.json(
        { error: 'Only users can create service requests' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      service,
      vehicle,
      location,
      notes,
      images = [],
    } = body;

    // Validation
    if (!service?.type || !service?.description || !vehicle || !location) {
      return NextResponse.json(
        { error: 'Service type, description, vehicle, and location are required' },
        { status: 400 }
      );
    }

    // Calculate base pricing based on service type
    const baseFees: Record<string, number> = {
      battery: 45,
      tires: 85,
      towing: 120,
      lockout: 60,
      engine: 150,
      brakes: 200,
      electrical: 100,
      other: 75,
    };

    const baseFee = baseFees[service.type] || 75;
    const serviceFee = Math.round(baseFee * 0.1); // 10% service fee
    const total = baseFee + serviceFee;

    const serviceRequest = new ServiceRequest({
      userId: req.user!.id,
      service,
      vehicle,
      location,
      notes,
      images,
      pricing: {
        baseFee,
        serviceFee,
        additionalCharges: 0,
        total,
        currency: 'USD',
      },
    });

    await serviceRequest.save();

    // Populate user data
    await serviceRequest.populate('userId', 'name email phone');

    return NextResponse.json(
      {
        message: 'Service request created successfully',
        request: serviceRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});