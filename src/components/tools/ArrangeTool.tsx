import { useState, useCallback } from "react";
import FileUploadZone from "@/components/ui/file-upload-zone";
import { Button } from "@/components/ui/button";
import {
  loadPdfDocument,
  getAllPageThumbnails,
  renderPageToCanvas,
} from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import {
  GripVertical,
  Trash2,
  Copy,
  Download,
  Eye,
  FileEdit,
} from "lucide-react";
import { toast } from "sonner";
import CustomTooltip from "../ui/custom-tooltip";
import PdfPageViewer from "../ui/pdf-viewer";
import { PDFDocumentProxy } from "pdfjs-dist";

const ArrangeTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewCanvas, setViewCanvas] = useState<HTMLCanvasElement | null>(null);
  const handleFile = useCallback(async (files: File[]) => {
    setLoading(true);
    const f = files[0];
    setFile(f);
    const pdf = await loadPdfDocument(f);
    setPdfDoc(pdf);
    const thumbs = await getAllPageThumbnails(pdf);
    setThumbnails(thumbs);
    setPageOrder(thumbs.map((_, i) => i));
    setLoading(false);
  }, []);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newOrder = [...pageOrder];
    const [dragged] = newOrder.splice(dragIdx, 1);
    newOrder.splice(idx, 0, dragged);
    setPageOrder(newOrder);
    setDragIdx(idx);
  };

  const deletePage = (idx: number) => {
    if (pageOrder.length <= 1) return;
    setPageOrder(pageOrder.filter((_, i) => i !== idx));
  };

  const duplicatePage = (idx: number) => {
    const newOrder = [...pageOrder];
    newOrder.splice(idx + 1, 0, pageOrder[idx]);
    setPageOrder(newOrder);
  };

  const viewPage = async (idx: number) => {
    if (!pdfDoc) return;
    const pageNum = pageOrder[idx] + 1;
    const canvas = await renderPageToCanvas(pdfDoc, pageNum, 2);
    setViewCanvas(canvas);
    setIsViewOpen(true);
  };

  const downloadPdf = async () => {
    if (!file) return;
    const srcDoc = await PDFDocument.load(await file.arrayBuffer());
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageOrder);
    copiedPages.forEach((p) => newDoc.addPage(p));
    const bytes = await newDoc.save();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arranged.pdf";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!, Your rearranged PDF has been saved.");
  };

  if (!file)
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Arrange Pages
        </h2>
        <FileUploadZone onFilesSelected={handleFile} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">Arrange Pages</h2>
        <span className="text-sm text-muted-foreground">
          {pageOrder.length} pages
        </span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={downloadPdf}>
            <Download className="size-4" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFile(null);
              setThumbnails([]);
            }}
          >
            <FileEdit className="size-4" />
            Change File
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Drag to reorder. Duplicate or delete pages easily.
      </p>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading pages...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {pageOrder.map((origIdx, i) => (
            <div
              key={`${i}-${origIdx}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={() => setDragIdx(null)}
              className={`group relative rounded-lg border-2 overflow-hidden transition-all ${dragIdx === i ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
            >
              <div className="absolute top-1 left-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-foreground bg-background/80 rounded" />
              </div>
              <img
                src={thumbnails[origIdx]}
                alt={`Page ${origIdx + 1}`}
                className="w-full"
              />
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-background/80 px-1.5 py-1">
                <span className="text-[10px] font-medium">{origIdx + 1}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CustomTooltip content="View Page">
                    <button
                      onClick={() => viewPage(origIdx)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Eye className="size-3" />
                    </button>
                  </CustomTooltip>
                  <CustomTooltip content="Duplicate">
                    <button
                      onClick={() => duplicatePage(i)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Copy className="size-3" />
                    </button>
                  </CustomTooltip>
                  <CustomTooltip content="Delete">
                    <button
                      onClick={() => deletePage(i)}
                      className="text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </CustomTooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <PdfPageViewer
        isOpen={isViewOpen}
        setIsOpen={setIsViewOpen}
        imageUrl={viewCanvas?.toDataURL() || ""}
      />
    </div>
  );
};

export default ArrangeTool;
