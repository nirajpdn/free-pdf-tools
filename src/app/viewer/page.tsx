"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loadPdfDocumentFromUrl } from "@/lib/pdf-utils";
import { useRef } from "react";

export const dynamic = "force-dynamic";
const ViewerContent = () => {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderedPages, setRenderedPages] = useState(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const pdfUrl = useMemo(() => {
    if (!rawUrl) return null;

    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }, [rawUrl]);

  const proxiedPdfUrl = useMemo(() => {
    if (!pdfUrl) return null;
    return `/api/pdf?url=${encodeURIComponent(pdfUrl)}`;
  }, [pdfUrl]);

  useEffect(() => {
    if (!proxiedPdfUrl) return;

    let isMounted = true;
    const renderPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setRenderedPages(0);
        if (canvasContainerRef.current) {
          canvasContainerRef.current.innerHTML = "";
        }

        const pdf = await loadPdfDocumentFromUrl(proxiedPdfUrl);
        let pagesCount = 0;
        const dpr =
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        const dprBoost = Math.min(dpr, 2.5);

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const baseViewport = page.getViewport({ scale: 1 });
          const containerWidth =
            canvasContainerRef.current?.clientWidth ?? baseViewport.width;
          const fitScale = containerWidth / baseViewport.width;
          const renderScale = Math.max(1, fitScale) * dprBoost;
          const viewport = page.getViewport({ scale: renderScale });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          canvas.className = "h-auto w-full rounded-md border bg-white";

          if (isMounted && canvasContainerRef.current) {
            canvasContainerRef.current.appendChild(canvas);
            pagesCount += 1;
          }
        }
        if (isMounted) setRenderedPages(pagesCount);
      } catch {
        if (isMounted) {
          setError(
            "Unable to load this PDF URL. Make sure the link is public and reachable.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    renderPdf();

    return () => {
      isMounted = false;
    };
  }, [proxiedPdfUrl]);

  if (!rawUrl) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="max-w-lg rounded-xl border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">PDF Viewer</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Missing PDF URL. Open this page like:
            <br />
            <code className="text-xs break-all">
              /viewer?url=https://pub-69efd47650a0420f8446677d9eef8f8f.r2.dev/portfolio/Niraj_Pradhan_Resume.pdf
            </code>
          </p>
          <Link href="/" className="mt-4 inline-block text-sm underline">
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  if (!pdfUrl) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="max-w-lg rounded-xl border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Invalid URL</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The `url` query param must be a valid `http` or `https` URL.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm underline">
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="max-w-lg rounded-xl border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Could Not Render PDF</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Link href="/" className="mt-4 inline-block text-sm underline">
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Rendering PDF pages...
          </p>
        )}
        {!isLoading && !error && renderedPages === 0 && (
          <p className="text-sm text-muted-foreground">No pages to display.</p>
        )}
        <div ref={canvasContainerRef} className="mt-4 space-y-4" />
      </div>
    </main>
  );
};

const ViewerPage = () => {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center p-6">
          <p className="text-sm text-muted-foreground">Loading viewer...</p>
        </main>
      }
    >
      <ViewerContent />
    </Suspense>
  );
};

export default ViewerPage;
