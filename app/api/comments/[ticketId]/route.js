import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Comment from '@/app/models/Comment';

export async function GET(request, { params }) {
  await connectMongoDB();
  const { ticketId } = params;

  try {
    const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 }).exec();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ message: 'Failed to fetch comments', error }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  await connectMongoDB();
  const { ticketId } = params;
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ message: 'Comment text is required' }, { status: 400 });
  }

  try {
    const newComment = new Comment({ ticketId, text });
    await newComment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Failed to add comment:', error);
    return NextResponse.json({ message: 'Failed to add comment', error }, { status: 500 });
  }
}
