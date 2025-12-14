import { registerAtlasUser } from "@/lib/atlas-api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }
    
    const result = await registerAtlasUser(email);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to register Atlas user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to register Atlas user" },
      { status: 500 }
    );
  }
}