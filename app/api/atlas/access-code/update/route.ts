import { NextResponse } from "next/server";
import { updateAtlasAccessCode } from "@/lib/atlas-api";

export async function POST(request: Request) {
  // Removed ATLAS_API_KEY validation check
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: "email is required" }, { status: 400 });
    }
    const data = await updateAtlasAccessCode(email);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update access code";
    return NextResponse.json({ message }, { status: 500 });
  }
}