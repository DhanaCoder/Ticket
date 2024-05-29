import Ticket from "@/app/models/Ticket";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tickets = await Ticket.find();

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const ticketData = body.formData;

    // Check if the ticket status is "done"
    if (ticketData.status === "done") {
      // Populate the "doneBy" field with the user's email
      ticketData.doneBy = ticketData.email; 
    } else {
      // If status is not "done", set "doneBy" to null or an empty string as per your schema
      ticketData.doneBy = null; 
    }

    // Create the ticket with the updated data
    await Ticket.create(ticketData);

    return NextResponse.json({ message: "Ticket Created" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
