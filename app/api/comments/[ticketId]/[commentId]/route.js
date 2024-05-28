import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Comment from '@/app/models/Comment';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  await connectMongoDB();
  const { commentId } = params;

  try {
    await Comment.deleteOne({ _id: new ObjectId(commentId) });
    return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json({ message: 'Failed to delete comment', error }, { status: 500 });
  }
}
