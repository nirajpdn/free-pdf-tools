import { useState, useCallback, useRef } from "react";
import FileUploadZone from "@/components/ui/file-upload-zone";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  loadPdfDocument,
  renderPageToCanvas,
  getAllPageThumbnails,
} from "@/lib/pdf-utils";
import JSZip from "jszip";
import { PDFDocumentProxy } from "pdfjs-dist";
import { toast } from "sonner";

type ImageFormat = "png" | "jpeg" | "webp";

const PdfToImageTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<ImageFormat>("png");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  const handleFile = useCallback(async (files: File[]) => {
    setLoading(true);
    const f = files[0];
    setFile(f);
    const pdf = await loadPdfDocument(f);
    setPdfDoc(pdf);
    const thumbs = await getAllPageThumbnails(pdf);
    setThumbnails(thumbs);
    setSelected(new Set());
    setLoading(false);
  }, []);

  const togglePage = (idx: number) => {
    const s = new Set(selected);
    s.has(idx) ? s.delete(idx) : s.add(idx);
    setSelected(s);
  };

  const selectAll = () => setSelected(new Set(thumbnails.map((_, i) => i)));

  const exportImages = async () => {
    if (!pdfDoc || selected.size === 0) return;
    setExporting(true);
    const mimeType = `image/${format}`;
    const ext = format === "jpeg" ? "jpg" : format;

    if (selected.size === 1) {
      const pageNum = Array.from(selected)[0] + 1;
      const canvas = await renderPageToCanvas(pdfDoc, pageNum, 2);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `page-${pageNum}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
          setExporting(false);
          toast(`Exported!, Page ${pageNum} saved as ${ext.toUpperCase()}.`);
        },
        mimeType,
        0.95,
      );
    } else {
      const zip = new JSZip();
      for (const idx of Array.from(selected).sort((a, b) => a - b)) {
        const canvas = await renderPageToCanvas(pdfDoc, idx + 1, 2);
        const dataUrl = canvas.toDataURL(mimeType, 0.95);
        const base64 = dataUrl.split(",")[1];
        zip.file(`page-${idx + 1}.${ext}`, base64, { base64: true });
      }
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdf-images.zip";
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      toast.success(`Exported!, ${selected.size} pages saved as ZIP.`);
    }
  };

  if (!file)
    return (
      <div className="mx-auto max-w-lg pt-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          PDF to Image
        </h2>
        <FileUploadZone onFilesSelected={handleFile} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">PDF to Image</h2>
        <span className="text-sm text-muted-foreground">
          {selected.size} of {thumbnails.length} selected
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={format}
            onValueChange={(v) => setFormat(v as ImageFormat)}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPG</SelectItem>
              <SelectItem value="webp">WEBP</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button
            size="sm"
            disabled={selected.size === 0 || exporting}
            onClick={exportImages}
          >
            {exporting ? "Exporting..." : "Export"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFile(null);
              setThumbnails([]);
              setPdfDoc(null);
            }}
          >
            Change File
          </Button>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading pages...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {thumbnails.map((thumb, i) => (
            <button
              key={i}
              onClick={() => togglePage(i)}
              className={`relative rounded-lg border-2 overflow-hidden transition-all ${selected.has(i) ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"}`}
            >
              <img src={thumb} alt={`Page ${i + 1}`} className="w-full" />
              <span className="absolute bottom-1 right-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfToImageTool;
