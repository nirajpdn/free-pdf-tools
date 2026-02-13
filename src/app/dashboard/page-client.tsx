"use client";

import { useState } from "react";
import {
  Pencil,
  Type,
  Scissors,
  Combine,
  ArrowUpDown,
  Image,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DrawTool from "@/components/tools/DrawTool";
import EditTool from "@/components/tools/EditTool";
import SplitTool from "@/components/tools/SplitTool";
import MergeTool from "@/components/tools/MergeTool";
import ArrangeTool from "@/components/tools/ArrangeTool";
import PdfToImageTool from "@/components/tools/PdfToImageTool";
import Link from "next/link";

const tools = [
  { id: "draw", label: "Draw", icon: Pencil },
  { id: "edit", label: "Edit", icon: Type },
  { id: "split", label: "Split", icon: Scissors },
  { id: "merge", label: "Merge", icon: Combine },
  { id: "arrange", label: "Arrange", icon: ArrowUpDown },
  { id: "to-image", label: "To Image", icon: Image },
] as const;

type ToolId = (typeof tools)[number]["id"];

const toolComponents: Record<ToolId, React.FC> = {
  draw: DrawTool,
  edit: EditTool,
  split: SplitTool,
  merge: MergeTool,
  arrange: ArrangeTool,
  "to-image": PdfToImageTool,
};

const Dashboard = () => {
  const [activeTool, setActiveTool] = useState<ToolId>("draw");
  const ActiveComponent = toolComponents[activeTool];

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-56 flex-col border-r bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm font-semibold text-foreground">
            PDF Tools
          </span>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                activeTool === t.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6 h-screen flex flex-col">
        <ActiveComponent />
      </main>
    </div>
  );
};

export default Dashboard;
