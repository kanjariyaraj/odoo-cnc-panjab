import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

// Seed database with sample users (development only)
export async function POST() {
  try {
    await connectDB();

    // Check if mechanics already exist
    const existingMechanic = await User.findOne({ role: 'mechanic' });
    if (existingMechanic) {
      return NextResponse.json({ message: 'Mechanics already exist' });
    }

    const saltRounds = 12;

    // Create sample mechanics
    const mechanics = [
      {
        name: 'John Martinez',
        email: 'john.martinez@roadguard.com',
        password: await bcrypt.hash('mechanic123', saltRounds),
        role: 'mechanic',
        phone: '+1-555-0101',
        profile: {
          specialties: ['battery', 'tires', 'lockout'],
          rating: 4.9,
          completedJobs: 247,
          yearsExperience: 8
        }
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@roadguard.com', 
        password: await bcrypt.hash('mechanic123', saltRounds),
        role: 'mechanic',
        phone: '+1-555-0102',
        profile: {
          specialties: ['towing', 'engine', 'electrical'],
          rating: 4.8,
          completedJobs: 312,
          yearsExperience: 6
        }
      },
      {
        name: 'Mike Thompson',
        email: 'mike.thompson@roadguard.com',
        password: await bcrypt.hash('mechanic123', saltRounds),
        role: 'mechanic', 
        phone: '+1-555-0103',
        profile: {
          specialties: ['brakes', 'tires', 'towing'],
          rating: 4.7,
          completedJobs: 189,
          yearsExperience: 5
        }
      }
    ];\n\n    // Create admin user\n    const adminExists = await User.findOne({ role: 'admin' });\n    if (!adminExists) {\n      const admin = new User({\n        name: 'Admin User',\n        email: 'admin@roadguard.com',\n        password: await bcrypt.hash('admin123', saltRounds),\n        role: 'admin',\n        phone: '+1-555-0001'\n      });\n      await admin.save();\n    }\n\n    // Save mechanics\n    for (const mechanicData of mechanics) {\n      const mechanic = new User(mechanicData);\n      await mechanic.save();\n    }\n\n    return NextResponse.json({ \n      message: 'Sample mechanics and admin created successfully',\n      mechanics: mechanics.map(m => ({ name: m.name, email: m.email, role: m.role })),\n      admin: { name: 'Admin User', email: 'admin@roadguard.com', role: 'admin' }\n    });\n  } catch (error) {\n    console.error('Seed error:', error);\n    return NextResponse.json(\n      { error: 'Failed to create sample users' },\n      { status: 500 }\n    );\n  }\n}