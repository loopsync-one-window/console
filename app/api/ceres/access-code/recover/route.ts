import { NextResponse } from "next/server"
import { recoverCeresAccessCode } from "@/lib/ceres-api"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ message: "email is required" }, { status: 400 })
    }
    const data = await recoverCeresAccessCode(email)
    return NextResponse.json(data, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to recover access code"
    return NextResponse.json({ message }, { status: 500 })
  }
}

