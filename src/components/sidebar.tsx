"use client";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useTool from "@/hooks/useTool";
import Image from "next/image";

const Sidebar = () => {
  const { activeTool, setActiveTool, tools } = useTool();
  return (
    <aside className="flex w-56 flex-col border-r bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Image
          src="/site-logo.png"
          alt="PDF Tool"
          height={28}
          width={28}
          className="h-7 w-auto"
        />
        <span className="text-sm font-semibold text-foreground">PDF Tools</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
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
  );
};

export default Sidebar;
