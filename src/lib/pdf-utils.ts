let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;

  // Dynamically import pdf.js only when needed (client-side)
  pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

  return pdfjsLib;
}

export async function loadPdfDocument(file: File) {
  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  return pdf;
}

export async function renderPageToCanvas(
  pdf: import("pdfjs-dist").PDFDocumentProxy,
  pageNum: number,
  scale: number = 1.5,
): Promise<HTMLCanvasElement> {
  await getPdfJs(); // Ensure pdf.js is loaded
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return canvas;
}

export async function renderPageThumbnail(
  pdf: import("pdfjs-dist").PDFDocumentProxy,
  pageNum: number,
): Promise<string> {
  const canvas = await renderPageToCanvas(pdf, pageNum, 0.5);
  return canvas.toDataURL("image/png");
}

export async function getAllPageThumbnails(
  pdf: import("pdfjs-dist").PDFDocumentProxy,
): Promise<string[]> {
  const thumbnails: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const thumb = await renderPageThumbnail(pdf, i);
    thumbnails.push(thumb);
  }
  return thumbnails;
}
