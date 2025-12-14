import { NextResponse } from "next/server";
import { updatePromptMode, UpdatePromptModePayload, deletePromptMode } from "@/lib/atlas-api";

export async function POST(request: Request) {
  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json({ message: "ATLAS_API_KEY is not set" }, { status: 500 });
  }
  try {
    const body = (await request.json()) as UpdatePromptModePayload;
    const { email, mode, prompt, provider, scope } = body || ({} as UpdatePromptModePayload);
    if (!email || !mode || !prompt || !provider || !scope) {
      return NextResponse.json({ message: "email, mode, prompt, provider, and scope are required" }, { status: 400 });
    }
    const data = await updatePromptMode({ email, mode, prompt, provider, scope });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update prompt mode";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json({ message: "ATLAS_API_KEY is not set" }, { status: 500 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") || "";
    const { email } = await request.json();
    if (!provider || !email) {
      return NextResponse.json({ message: "provider query and email body are required" }, { status: 400 });
    }
    const data = await deletePromptMode(provider, email);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete prompt mode";
    return NextResponse.json({ message }, { status: 500 });
  }
}
