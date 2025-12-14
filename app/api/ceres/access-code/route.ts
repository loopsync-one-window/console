import { NextResponse, NextRequest } from "next/server"
import { getCeresAccessCode } from "@/lib/ceres-api"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let email = searchParams.get("email") || ""
  if (!email) {
    email = request.headers.get("email") || request.headers.get("x-email") || ""
  }
  if (!email) {
    try {
      const raw = await request.text()
      if (raw) {
        const body = JSON.parse(raw)
        if (body && typeof body.email === "string") email = body.email
      }
    } catch {}
  }
  if (!email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 })
  }
  try {
    const data = await getCeresAccessCode(email)
    return NextResponse.json(data, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch access code"
    return NextResponse.json({ message }, { status: 500 })
  }
}
