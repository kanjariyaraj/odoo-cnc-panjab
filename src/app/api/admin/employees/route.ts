import { NextResponse } from 'next/server';
import { requireUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Get employees for admin (shop owner)
export const GET = requireUser(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    console.log('GET employees - Admin ID:', req.user!.id, 'Role:', req.user!.role);

    // Only admins can manage employees
    if (req.user!.role !== 'admin') {
      console.log('Access denied - not admin');
      return NextResponse.json(
        { error: 'Only admins can view employees' },
        { status: 403 }
      );
    }

    // Get all mechanics that belong to this admin's shop
    console.log('Querying employees with shopId:', req.user!.id);
    const employees = await User.find({
      role: 'mechanic',
      shopId: new mongoose.Types.ObjectId(req.user!.id),
      isActive: true
    }).select('-password').sort({ createdAt: -1 });

    console.log('Found employees:', employees.length);
    employees.forEach(emp => {
      console.log('Employee:', { 
        name: emp.name, 
        email: emp.email, 
        shopId: emp.shopId?.toString(),
        isActive: emp.isActive 
      });
    });

    return NextResponse.json({
      employees,
      totalEmployees: employees.length
    });
  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Add new employee (mechanic) to shop
export const POST = requireUser(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Only admins can add employees
    if (req.user!.role !== 'admin') {
      console.log('Access denied - user role:', req.user!.role);
      return NextResponse.json(
        { error: 'Only admins can add employees' },
        { status: 403 }
      );
    }

    console.log('Admin user authenticated:', req.user!.id, req.user!.role);

    const {
      name,
      email,
      phone,
      password,
      specialties,
      yearsExperience
    } = await req.json();

    console.log('Request payload:', { name, email, phone, specialties, yearsExperience, hasPassword: !!password });

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create new mechanic employee
    const employee = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || undefined,
      password,
      role: 'mechanic',
      shopId: new mongoose.Types.ObjectId(req.user!.id), // Convert string to ObjectId
      isActive: true,
      profile: {
        specialties: Array.isArray(specialties) ? specialties.filter(s => s && s.trim()) : [],
        yearsExperience: parseInt(yearsExperience) || 0,
        rating: 0,
        completedJobs: 0
      }
    });

    try {
      await employee.save();
      console.log('Employee saved successfully:', employee._id);
    } catch (saveError: any) {
      console.error('Employee save error:', saveError);
      if (saveError.code === 11000) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { error: `Validation error: ${validationErrors.join(', ')}` },
          { status: 400 }
        );
      }
      throw saveError;
    }

    // Return employee without password
    const employeeData = await User.findById(employee._id).select('-password');

    return NextResponse.json({
      message: 'Employee added successfully',
      employee: employeeData
    }, { status: 201 });
  } catch (error: any) {
    console.error('Add employee error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
      return NextResponse.json(
        { error: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists` },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
});

// Update employee
export const PUT = requireUser(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    // Only admins can update employees
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can update employees' },
        { status: 403 }
      );
    }

    const { employeeId, ...updateData } = await req.json();

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Make sure the employee belongs to this admin's shop
    const employee = await User.findOne({
      _id: employeeId,
      role: 'mechanic',
      shopId: new mongoose.Types.ObjectId(req.user!.id)
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found or not authorized' },
        { status: 404 }
      );
    }

    // Update employee
    const updatedEmployee = await User.findByIdAndUpdate(
      employeeId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Delete (deactivate) employee
export const DELETE = requireUser(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    // Only admins can delete employees
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can delete employees' },
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

    // Make sure the employee belongs to this admin's shop
    const employee = await User.findOne({
      _id: employeeId,
      role: 'mechanic',
      shopId: new mongoose.Types.ObjectId(req.user!.id)
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found or not authorized' },
        { status: 404 }
      );
    }

    // Deactivate instead of deleting
    await User.findByIdAndUpdate(employeeId, { isActive: false });

    return NextResponse.json({
      message: 'Employee deactivated successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});