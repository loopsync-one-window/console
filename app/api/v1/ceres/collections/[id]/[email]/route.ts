import { NextResponse } from "next/server"
import { getCeresCollectionDetail } from "@/lib/ceres-api"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; email: string }> }
) {
  const { id, email } = await context.params
  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 })
  }
  if (!email) {
    return NextResponse.json({ message: "email is required" }, { status: 400 })
  }
  try {
    const data = await getCeresCollectionDetail(id, email)
    return NextResponse.json(data, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch collection"
    return NextResponse.json({ message }, { status: 500 })
  }
}
