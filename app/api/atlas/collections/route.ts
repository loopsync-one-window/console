import { NextResponse } from "next/server";
import { getAtlasCollections } from "@/lib/atlas-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  if (!email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 });
  }
  // Removed ATLAS_API_KEY validation check
  try {
    const data = await getAtlasCollections(email);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch atlas collections";
    return NextResponse.json({ message }, { status: 500 });
  }
}