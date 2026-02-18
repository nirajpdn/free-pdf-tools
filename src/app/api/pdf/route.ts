import { NextRequest } from "next/server";

function isPrivateHostname(hostname: string) {
  const lower = hostname.toLowerCase();
  return (
    lower === "localhost" ||
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower.endsWith(".local")
  );
}

function isLocalDevHostname(hostname: string) {
  const lower = hostname.toLowerCase();
  return lower === "localhost" || lower === "127.0.0.1" || lower === "::1";
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");
  if (!target) {
    return new Response("Missing url query parameter.", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("Invalid URL.", { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new Response("Only http(s) URLs are allowed.", { status: 400 });
  }

  const isDev = process.env.NODE_ENV !== "production";
  const allowLocalDev = isDev && isLocalDevHostname(parsed.hostname);

  if (isPrivateHostname(parsed.hostname) && !allowLocalDev) {
    return new Response("Blocked hostname.", { status: 400 });
  }

  const browserLikeHeaders = {
    Accept: "application/pdf,application/octet-stream;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  };

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      headers: browserLikeHeaders,
      redirect: "follow",
    });
  } catch {
    return new Response("Failed to fetch target URL.", { status: 502 });
  }

  // Retry once with minimal headers for hosts that reject custom UA/Accept.
  if (!upstream.ok) {
    try {
      upstream = await fetch(parsed.toString(), {
        redirect: "follow",
      });
    } catch {
      return new Response(`Upstream request failed (${upstream.status}).`, {
        status: upstream.status || 502,
      });
    }
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(`Upstream request failed (${upstream.status}).`, {
      status: upstream.status || 502,
    });
  }

  const filename = parsed.pathname.split("/").pop() || "document.pdf";

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") || "application/pdf",
  );
  headers.set("Content-Disposition", `inline; filename="${filename}"`);
  headers.set("Cache-Control", "no-store");

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
