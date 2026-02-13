import { useState, useCallback } from "react";
import FileUploadZone from "@/components/ui/file-upload-zone";
import { Button } from "@/components/ui/button";
import { PDFDocument } from "pdf-lib";
import { GripVertical, X } from "lucide-react";
import { toast } from "sonner";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  pages: number;
}

const MergeTool = () => {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    const entries: PdfFile[] = [];
    for (const f of newFiles) {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      entries.push({
        id: crypto.randomUUID(),
        file: f,
        name: f.name,
        pages: doc.getPageCount(),
      });
    }
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const removeFile = (id: string) =>
    setFiles((f) => f.filter((x) => x.id !== id));

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newFiles = [...files];
    const [dragged] = newFiles.splice(dragIdx, 1);
    newFiles.splice(idx, 0, dragged);
    setFiles(newFiles);
    setDragIdx(idx);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    const mergedDoc = await PDFDocument.create();
    for (const entry of files) {
      const srcDoc = await PDFDocument.load(await entry.file.arrayBuffer());
      const copiedPages = await mergedDoc.copyPages(
        srcDoc,
        srcDoc.getPageIndices(),
      );
      copiedPages.forEach((p) => mergedDoc.addPage(p));
    }
    const bytes = await mergedDoc.save();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Merged!, Combined ${files.length} PDFs.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">Merge PDFs</h2>
        <span className="text-sm text-muted-foreground">
          {files.length} file(s)
        </span>
        <Button
          size="sm"
          className="ml-auto"
          disabled={files.length < 2}
          onClick={mergePdfs}
        >
          Merge & Download
        </Button>
      </div>

      <FileUploadZone
        onFilesSelected={handleFiles}
        multiple
        label="Drop PDF files here to merge"
        className="py-6"
      />

      {files.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Drag to reorder:</p>
          {files.map((f, i) => (
            <div
              key={f.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={() => setDragIdx(null)}
              className={`flex items-center gap-3 rounded-lg border bg-card px-3 py-2 transition-colors ${dragIdx === i ? "border-primary bg-primary/5" : ""}`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <span className="flex-1 text-sm truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground">
                {f.pages} pages
              </span>
              <button
                onClick={() => removeFile(f.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MergeTool;
