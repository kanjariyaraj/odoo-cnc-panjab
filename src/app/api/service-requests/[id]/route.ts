import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { ServiceRequest } from '@/models/ServiceRequest';

// Update service request status (for mechanics)
export const PUT = requireUser(async (req: NextRequest) => {
  try {
    await connectDB();

    // Only mechanics can update service request status
    if (req.user!.role !== 'mechanic') {
      return NextResponse.json(
        { error: 'Only mechanics can update service requests' },
        { status: 403 }
      );
    }

    // Extract ID from URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, notes, additionalCharges } = body;

    const serviceRequest = await ServiceRequest.findById(id);
    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      );
    }

    // Only assigned mechanic or admin can update
    if (req.user!.role === 'mechanic' && serviceRequest.mechanicId?.toString() !== req.user!.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this request' },
        { status: 403 }
      );
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      updateData[`timeline.${getTimelineField(status)}`] = new Date();
      
      // If completing the request, update pricing if additional charges
      if (status === 'completed' && additionalCharges) {
        updateData['pricing.additionalCharges'] = additionalCharges;
        updateData['pricing.total'] = serviceRequest.pricing.baseFee + 
          serviceRequest.pricing.serviceFee + additionalCharges;
      }
    }

    if (notes) {
      updateData.notes = notes;
    }

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone')
     .populate('mechanicId', 'name email phone');

    return NextResponse.json({
      message: 'Service request updated successfully',
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Update service request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Handle service request actions (for mechanics)
export const PATCH = requireUser(async (req: NextRequest) => {
  try {
    await connectDB();

    // Only mechanics can perform these actions
    if (req.user!.role !== 'mechanic') {
      return NextResponse.json(
        { error: 'Only mechanics can update service requests' },
        { status: 403 }
      );
    }

    // Extract ID from URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const { action } = await req.json();

    console.log('Processing action:', action, 'for request:', id);

    const serviceRequest = await ServiceRequest.findById(id);
    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      );
    }

    console.log('Current request status:', serviceRequest.status);

    // Update based on action
    switch (action) {
      case 'accept':
        if (serviceRequest.status !== 'pending') {
          return NextResponse.json(
            { error: `Can only accept pending requests. Current status: ${serviceRequest.status}` },
            { status: 400 }
          );
        }
        serviceRequest.status = 'assigned';
        serviceRequest.mechanicId = req.user!.id;
        serviceRequest.timeline.assigned = new Date();
        break;

      case 'start':
        if (serviceRequest.status !== 'assigned' || serviceRequest.mechanicId?.toString() !== req.user!.id) {
          return NextResponse.json(
            { error: `Can only start assigned requests. Current status: ${serviceRequest.status}` },
            { status: 400 }
          );
        }
        serviceRequest.status = 'in-progress';
        serviceRequest.timeline.started = new Date();
        break;

      case 'complete':
        if (serviceRequest.status !== 'in-progress' || serviceRequest.mechanicId?.toString() !== req.user!.id) {
          return NextResponse.json(
            { error: `Can only complete in-progress requests. Current status: ${serviceRequest.status}` },
            { status: 400 }
          );
        }
        serviceRequest.status = 'completed';
        serviceRequest.timeline.completed = new Date();
        break;

      case 'assign':
        // Legacy action support
        if (serviceRequest.status !== 'pending') {
          return NextResponse.json(
            { error: 'Can only assign pending requests' },
            { status: 400 }
          );
        }
        serviceRequest.mechanicId = req.user!.id;
        serviceRequest.status = 'assigned';
        serviceRequest.timeline.assigned = new Date();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await serviceRequest.save();
    console.log('Request updated successfully:', serviceRequest.status);

    // Populate user and mechanic data
    await serviceRequest.populate([
      { path: 'userId', select: 'name email phone' },
      { path: 'mechanicId', select: 'name email phone' }
    ]);

    return NextResponse.json({
      message: `Service request ${action}ed successfully`,
      request: serviceRequest,
    });
  } catch (error) {
    console.error('Update service request action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

function getTimelineField(status: string): string {
  switch (status) {
    case 'assigned': return 'assigned';
    case 'in-progress': return 'started';
    case 'completed': return 'completed';
    case 'cancelled': return 'cancelled';
    default: return 'requested';
  }
}