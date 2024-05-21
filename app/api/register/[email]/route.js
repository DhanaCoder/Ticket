import { NextResponse } from 'next/server';
import User from '@/app/models/User';// Adjust the path according to your project structure

export async function GET(request, { params }) {
  const { email } = params; // Extract the email parameter

  try {
    const foundUser = await User.findOne({ email }); // Find user by email
    if (!foundUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ department: foundUser.department }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
