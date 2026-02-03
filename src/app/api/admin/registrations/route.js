import connectDB from "@/lib/db";
import User from "@/Models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }); 
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch data" }, { status: 500 });
  }
}