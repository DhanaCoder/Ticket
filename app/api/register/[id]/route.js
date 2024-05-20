import User from "@/app/models/User";
import { NextResponse } from "next/server";



export async function GET(request, { params }) {
  const { email } = params; // Extract the email parameter

  try {
      // Assuming your User model is imported and available
      const foundUser = await User.findOne({ email }); // Find user by email
      if (!foundUser) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ foundUser }, { status: 200 });
  } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

  