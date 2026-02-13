import { useState, useCallback } from "react";
import FileUploadZone from "@/components/ui/file-upload-zone";
import { Button } from "@/components/ui/button";
import { loadPdfDocument, getAllPageThumbnails } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";

const SplitTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (files: File[]) => {
    setLoading(true);
    const f = files[0];
    setFile(f);
    const pdf = await loadPdfDocument(f);
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
  const selectNone = () => setSelected(new Set());

  const splitPdf = async () => {
    if (!file || selected.size === 0) return;
    const srcDoc = await PDFDocument.load(await file.arrayBuffer());
    const newDoc = await PDFDocument.create();
    const indices = Array.from(selected).sort((a, b) => a - b);
    const copiedPages = await newDoc.copyPages(srcDoc, indices);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "split.pdf";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Split complete!, Extracted ${selected.size} page(s).`);
  };

  if (!file)
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Split PDF
        </h2>
        <FileUploadZone onFilesSelected={handleFile} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">Split PDF</h2>
        <span className="text-sm text-muted-foreground">
          {selected.size} of {thumbnails.length} selected
        </span>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={selectNone}>
            Deselect
          </Button>
          <Button size="sm" disabled={selected.size === 0} onClick={splitPdf}>
            Extract Selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFile(null);
              setThumbnails([]);
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

export default SplitTool;
