import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

const PdfPageViewer: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  imageUrl: string;
  title?: string;
}> = ({ isOpen, setIsOpen, imageUrl, title = "Preview" }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <div className="flex justify-center">
            <div className="max-h-[80vh] overflow-auto rounded-lg border">
              <img src={imageUrl} alt="Page preview" className="w-full" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PdfPageViewer;
