import { connectMongoDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(req) {
  try {
    const { username, email, password, department, role } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    await User.create({
      username,
      email,
      password: hashedPassword,
      department,
      role,
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user.", error },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const users = await User.find({}, { password: 0 }); // Exclude password field from the response
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching users.", error },
      { status: 500 }
    );
  }
}
