import { NextResponse, NextRequest } from "next/server";
import { getPromptModeStatus } from "@/lib/atlas-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let email = searchParams.get("email") || "";
  if (!email) {
    email = request.headers.get("email") || request.headers.get("x-email") || "";
  }
  if (!email) {
    try {
      const raw = await request.text();
      if (raw) {
        const body = JSON.parse(raw);
        if (body && typeof body.email === "string") email = body.email;
      }
    } catch {}
  }
  if (!email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 });
  }
  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json({ message: "ATLAS_API_KEY is not set" }, { status: 500 });
  }
  try {
    const data = await getPromptModeStatus(email);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch prompt mode status";
    return NextResponse.json({ message }, { status: 500 });
  }
}
