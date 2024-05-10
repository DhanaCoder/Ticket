import Person from "@/app/models/User";
import { NextResponse } from "next/server";



export async function GET(request, { params }) {
    const { id } = params;
  
    const foundUser = await Person.findOne({ _id: id });
    return NextResponse.json({ foundUser }, { status: 200 });
  }