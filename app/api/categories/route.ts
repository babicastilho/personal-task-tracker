// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { createCategory } from '@/models/Category';
import { ObjectId } from 'mongodb';

export async function GET() {
  const db = await dbConnect();
  const categories = await db.collection('categories').find().toArray();
  return NextResponse.json({ success: true, categories }, { status: 200 });
}

export async function POST(req: Request) {
  const db = await dbConnect();
  const { name, description } = await req.json();

  if (!name) {
    return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
  }

  const newCategory = createCategory({ name, description });
  await db.collection('categories').insertOne(newCategory);

  return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const db = await dbConnect();
  const { id } = params;
  const { name, description } = await req.json();

  const updatedCategory = await db.collection('categories').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name, description } },
    { returnDocument: 'after' }
  );

  if (!updatedCategory || !updatedCategory.value) {
    // If updatedCategory is null or updatedCategory.value is null, return a 404 error
    return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, category: updatedCategory.value }, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const db = await dbConnect();
  const { id } = params;

  const deleteResult = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });

  if (deleteResult.deletedCount === 0) {
    return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Category deleted successfully' }, { status: 200 });
}
