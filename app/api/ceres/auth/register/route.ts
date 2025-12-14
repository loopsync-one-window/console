import { registerCeresUser } from "@/lib/ceres-api";
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
    
    const result = await registerCeresUser(email);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to register Ceres user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to register Ceres user" },
      { status: 500 }
      );
  }
}