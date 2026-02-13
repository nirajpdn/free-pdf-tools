"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Pencil,
  Type,
  Scissors,
  Combine,
  ArrowUpDown,
  Image,
  ArrowRight,
} from "lucide-react";
const tools = [
  {
    icon: Pencil,
    title: "Draw on PDF",
    desc: "Add freehand drawings, shapes, and annotations to any PDF page.",
  },
  {
    icon: Type,
    title: "Edit PDF",
    desc: "Insert and modify text directly on your PDF documents.",
  },
  {
    icon: Scissors,
    title: "Split PDF",
    desc: "Extract specific pages or ranges into separate PDF files.",
  },
  {
    icon: Combine,
    title: "Merge PDFs",
    desc: "Combine multiple PDF files into a single document.",
  },
  {
    icon: ArrowUpDown,
    title: "Arrange Pages",
    desc: "Reorder, delete, or duplicate pages within a PDF.",
  },
  {
    icon: Image,
    title: "PDF to Image",
    desc: "Convert PDF pages to PNG, JPG, or WEBP images.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-col items-center justify-center gap-6 px-4 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary tracking-wide uppercase">
            100% Client-Side · No Upload · Free Download
          </span>
        </motion.div>
        <motion.h1
          className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          All-in-One 100% Free PDF Tools
        </motion.h1>
        <motion.p
          className="max-w-lg text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Draw, edit, split, merge, rearrange, and convert, all in your browser,
          no files ever leave your device.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            asChild
            size="lg"
            className="mt-2 rounded-full px-8 text-base"
          >
            <Link href="/dashboard">
              Open Dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </header>

      {/* Feature Grid */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tools.map((t) => (
            <motion.div
              key={t.title}
              variants={item}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold text-card-foreground">
                {t.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Built with privacy in mind — your files never leave your browser.
      </footer>
    </div>
  );
}
