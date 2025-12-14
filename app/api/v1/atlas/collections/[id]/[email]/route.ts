import { NextResponse } from "next/server";
import { getAtlasCollectionDetail } from "@/lib/atlas-api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; email: string }> }
) {
  const { id, email } = await context.params; // ✅ await params

  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 });
  }

  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json(
      { message: "ATLAS_API_KEY is not set" },
      { status: 500 }
    );
  }

  try {
    const data = await getAtlasCollectionDetail(id, email);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch collection";

    const msg = message.toLowerCase();

    if (msg.includes("not found")) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    if (msg.includes("access")) {
      return NextResponse.json(
        { error: "You do not have access to this collection" },
        { status: 403 }
      );
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
