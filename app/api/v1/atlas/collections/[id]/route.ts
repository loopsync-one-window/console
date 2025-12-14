import { NextResponse, NextRequest } from "next/server";
import { getAtlasCollectionDetail } from "@/lib/atlas-api";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  let id = (await context.params)?.id || "";
  if (!id) {
    const match = request.url.match(/\/api\/v1\/atlas\/collections\/([^?\/#]+)/);
    if (match && match[1]) id = match[1];
  }
  const { searchParams } = new URL(request.url);
  let email = searchParams.get("email") || "";
  if (!email) {
    const headerEmail = request.headers.get("email") || request.headers.get("x-email") || "";
    if (headerEmail) email = headerEmail;
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
  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 });
  }
  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json({ message: "ATLAS_API_KEY is not set" }, { status: 500 });
  }
  try {
    const data = await getAtlasCollectionDetail(id, email);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch collection";
    if (typeof message === "string" && message.toLowerCase().includes("not found")) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    if (typeof message === "string" && message.toLowerCase().includes("access")) {
      return NextResponse.json({ error: "You do not have access to this collection" }, { status: 403 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  let id = (await context.params)?.id || "";
  if (!id) {
    const match = request.url.match(/\/api\/v1\/atlas\/collections\/([^?\/#]+)/);
    if (match && match[1]) id = match[1];
  }
  if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });
  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json({ message: "ATLAS_API_KEY is not set" }, { status: 500 });
  }
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ message: "email is required" }, { status: 400 });
    const data = await getAtlasCollectionDetail(id, email);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch collection";
    if (typeof message === "string" && message.toLowerCase().includes("not found")) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    if (typeof message === "string" && message.toLowerCase().includes("access")) {
      return NextResponse.json({ error: "You do not have access to this collection" }, { status: 403 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
