import { NextResponse } from "next/server";

import { getRenderModeSnapshot } from "../../../lib/renderModes";

const CACHE_TTL_MS = 10 * 1000;
const snapshotCache = new Map();

async function getCachedSnapshot(mode) {
  const now = Date.now();
  const cached = snapshotCache.get(mode);

  if (cached && cached.expiresAt > now) {
    return cached;
  }

  const data = await getRenderModeSnapshot(mode);
  const entry = {
    data,
    etag: `"${mode}-abcd"`,
    expiresAt: now + CACHE_TTL_MS
  };

  snapshotCache.set(mode, entry);
  return entry;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "CSR";
  const { data, etag, expiresAt } = await getCachedSnapshot(mode);
  const ifNoneMatch = request.headers.get("if-none-match");
  const maxAgeSeconds = Math.floor((expiresAt - Date.now()) / 1000);
  const headers = {
    ETag: etag,
    "Cache-Control": `max-age=10`,
  };

  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers
    });
  }

  return NextResponse.json(data, {
    headers
  });
}
