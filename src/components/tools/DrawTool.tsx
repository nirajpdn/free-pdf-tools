import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { loadPdfDocument, renderPageToCanvas } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import FileUploadZone from "../ui/file-upload-zone";
import { toast } from "sonner";
import { PDFDocumentProxy } from "pdfjs-dist";
import { Download } from "lucide-react";

const COLORS = [
  "#000000",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
];

const DrawTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingsRef = useRef<Map<number, string>>(new Map());

  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current || !drawCanvasRef.current) return;
      const pdfCanvas = await renderPageToCanvas(pdfDoc, pageNum, 1.5);
      const canvas = canvasRef.current;
      canvas.width = pdfCanvas.width;
      canvas.height = pdfCanvas.height;
      canvas.getContext("2d")!.drawImage(pdfCanvas, 0, 0);

      const drawCanvas = drawCanvasRef.current;
      drawCanvas.width = pdfCanvas.width;
      drawCanvas.height = pdfCanvas.height;
      const savedDrawing = drawingsRef.current.get(pageNum);
      if (savedDrawing) {
        const img = new window.Image();
        img.onload = () => drawCanvas.getContext("2d")!.drawImage(img, 0, 0);
        img.src = savedDrawing;
      }
    },
    [pdfDoc],
  );

  const handleFile = useCallback(async (files: File[]) => {
    const f = files[0];
    setFile(f);
    const pdf = await loadPdfDocument(f);
    setPdfDoc(pdf);
    setNumPages(pdf.numPages);
    setCurrentPage(1);
    drawingsRef.current.clear();
  }, []);

  useEffect(() => {
    if (pdfDoc) renderPage(currentPage);
  }, [currentPage, pdfDoc, renderPage]);

  const saveCurrentDrawing = () => {
    if (drawCanvasRef.current) {
      drawingsRef.current.set(currentPage, drawCanvasRef.current.toDataURL());
    }
  };

  const getPos = (e: React.MouseEvent) => {
    const rect = drawCanvasRef.current!.getBoundingClientRect();
    const scaleX = drawCanvasRef.current!.width / rect.width;
    const scaleY = drawCanvasRef.current!.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const ctx = drawCanvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = drawCanvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
    saveCurrentDrawing();
  };

  const clearDrawing = () => {
    const ctx = drawCanvasRef.current?.getContext("2d");
    if (ctx && drawCanvasRef.current) {
      ctx.clearRect(
        0,
        0,
        drawCanvasRef.current.width,
        drawCanvasRef.current.height,
      );
      drawingsRef.current.delete(currentPage);
    }
  };

  const downloadPdf = async () => {
    if (!file) return;
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    const pages = pdfDoc.getPages();

    for (const [pageNum, dataUrl] of drawingsRef.current.entries()) {
      const page = pages[pageNum - 1];
      const pngBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(new Uint8Array(pngBytes));
      const { width, height } = page.getSize();
      page.drawImage(pngImage, { x: 0, y: 0, width, height });
    }

    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotated.pdf";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!, Your annotated PDF has been saved.");
  };

  if (!file)
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Draw on PDF
        </h2>
        <FileUploadZone onFilesSelected={handleFile} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">Draw on PDF</h2>
        <div className="flex items-center gap-1 ml-auto">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full border-2 transition-transform ${color === c ? "scale-110 border-foreground" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 w-32">
          <span className="text-xs text-muted-foreground">Size</span>
          <Slider
            defaultValue={[brushSize]}
            value={[brushSize]}
            onValueChange={([v]) => setBrushSize(v)}
            min={1}
            max={20}
            step={1}
          />
        </div>
        <Button variant="outline" size="sm" onClick={clearDrawing}>
          Clear
        </Button>
        <Button size="sm" onClick={downloadPdf}>
          <Download className="size-4" />
          Download
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => {
            saveCurrentDrawing();
            setCurrentPage((p) => p - 1);
          }}
        >
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} / {numPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= numPages}
          onClick={() => {
            saveCurrentDrawing();
            setCurrentPage((p) => p + 1);
          }}
        >
          Next
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setFile(null);
            setPdfDoc(null);
          }}
        >
          Change File
        </Button>
      </div>

      <div
        ref={containerRef}
        className="relative inline-flex rounded-lg border bg-muted/90 overflow-auto h-[86vh] justify-center"
      >
        <div className="relative w-fit">
          <canvas ref={canvasRef} className="block w-auto h-fit min-w-[60vw]" />
          <canvas
            ref={drawCanvasRef}
            className="absolute inset-0 cursor-crosshair"
            style={{ width: "100%", height: "100%" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawTool;
