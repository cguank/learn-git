import { NextResponse } from "next/server";

import { getRenderModeSnapshot } from "../../../lib/renderModes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "CSR";
  const data = await getRenderModeSnapshot(mode);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
