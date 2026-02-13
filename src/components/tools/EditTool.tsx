import { useState, useRef, useEffect, useCallback } from "react";
import FileUploadZone from "@/components/ui/file-upload-zone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadPdfDocument, renderPageToCanvas } from "@/lib/pdf-utils";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { PDFDocumentProxy } from "pdfjs-dist";
import { toast } from "sonner";
import { Download } from "lucide-react";

interface TextBlock {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

const EditTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [textBlocks, setTextBlocks] = useState<Map<number, TextBlock[]>>(
    new Map(),
  );
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current) return;
      const pdfCanvas = await renderPageToCanvas(pdfDoc, pageNum, 1.5);
      const canvas = canvasRef.current;
      canvas.width = pdfCanvas.width;
      canvas.height = pdfCanvas.height;
      canvas.getContext("2d")!.drawImage(pdfCanvas, 0, 0);
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
    setTextBlocks(new Map());
  }, []);

  useEffect(() => {
    if (pdfDoc) renderPage(currentPage);
  }, [currentPage, pdfDoc, renderPage]);

  const addTextBlock = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".text-block")) return;
    const rect = overlayRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const block: TextBlock = {
      id: crypto.randomUUID(),
      x,
      y,
      text: "Type here",
      fontSize,
      color: textColor,
    };
    const pageBlocks = new Map(textBlocks);
    const existing = pageBlocks.get(currentPage) || [];
    pageBlocks.set(currentPage, [...existing, block]);
    setTextBlocks(pageBlocks);
    setSelectedBlock(block.id);
  };

  const updateBlock = (id: string, updates: Partial<TextBlock>) => {
    const pageBlocks = new Map(textBlocks);
    const blocks = (pageBlocks.get(currentPage) || []).map((b) =>
      b.id === id ? { ...b, ...updates } : b,
    );
    pageBlocks.set(currentPage, blocks);
    setTextBlocks(pageBlocks);
  };

  const deleteBlock = (id: string) => {
    const pageBlocks = new Map(textBlocks);
    const blocks = (pageBlocks.get(currentPage) || []).filter(
      (b) => b.id !== id,
    );
    pageBlocks.set(currentPage, blocks);
    setTextBlocks(pageBlocks);
    setSelectedBlock(null);
  };

  const currentBlocks = textBlocks.get(currentPage) || [];

  const downloadPdf = async () => {
    if (!file) return;
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (const [pageNum, blocks] of textBlocks.entries()) {
      const page = pages[pageNum - 1];
      const { height } = page.getSize();
      const canvas = canvasRef.current!;
      const scaleX = page.getWidth() / canvas.getBoundingClientRect().width;
      const scaleY = page.getHeight() / canvas.getBoundingClientRect().height;

      for (const block of blocks) {
        const hex = block.color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        page.drawText(block.text, {
          x: block.x * scaleX,
          y: height - block.y * scaleY - block.fontSize * scaleY,
          size: block.fontSize * scaleX,
          font,
          color: rgb(r, g, b),
        });
      }
    }

    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!, Your edited PDF has been saved.");
  };

  if (!file)
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Edit PDF</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Click anywhere on the PDF to add text blocks.
        </p>
        <FileUploadZone onFilesSelected={handleFile} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">Edit PDF</h2>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Size</label>
          <Input
            type="number"
            value={fontSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFontSize(Number(e.target.value))
            }
            className="w-16 h-8"
            min={8}
            max={72}
          />
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="h-8 w-8 rounded border cursor-pointer"
          />
          <Button size="sm" onClick={downloadPdf}>
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => p - 1)}
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
          onClick={() => setCurrentPage((p) => p + 1)}
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

      <p className="text-xs text-muted-foreground">
        Click on the PDF to add text. Click a text block to select & edit it.
      </p>

      <div
        className="relative inline-block rounded-lg border bg-muted/30 overflow-auto max-h-[70vh]"
        ref={overlayRef}
        onClick={addTextBlock}
      >
        <canvas ref={canvasRef} className="block max-w-full" />
        {currentBlocks.map((block) => (
          <div
            key={block.id}
            className={`text-block absolute cursor-move ${selectedBlock === block.id ? "ring-2 ring-primary" : ""}`}
            style={{ left: block.x, top: block.y }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBlock(block.id);
            }}
          >
            <input
              value={block.text}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
              style={{
                fontSize: block.fontSize,
                color: block.color,
                background: "transparent",
                border: "none",
                outline: "none",
                minWidth: 40,
              }}
              className="focus:bg-background/80 rounded px-0.5"
            />
            {selectedBlock === block.id && (
              <button
                onClick={() => deleteBlock(block.id)}
                className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground w-4 h-4 text-[10px] flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditTool;
