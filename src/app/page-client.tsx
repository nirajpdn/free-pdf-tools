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
  ArrowRight,
  Github,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
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
    icon: ImageIcon,
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
      <div
        className="fixed top-0 left-0 w-18 aspect-square bg-black"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0% 100%, 0 0)",
        }}
      >
        <Image
          src="/site-logo.png"
          alt="PDF Tools logo"
          height={40}
          width={40}
          className="h-10 w-auto brightness-0 invert"
        />
      </div>
      <div
        className="fixed top-0 right-0 w-18 aspect-square bg-black flex justify-end px-1"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)",
        }}
      >
        <Link target="_blank" href="https://github.com/nirajpdn/free-pdf-tools">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 48 48"
            className="text-white hover:text-white/80"
          >
            <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
              <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20S35.046 4 24 4M0 24C0 10.745 10.745 0 24 0s24 10.745 24 24s-10.745 24-24 24S0 37.255 0 24" />
              <path d="M19.183 45.472q-.29-.375 0-6.674q-3.107.108-3.927-.431c-.819-.539-1.64-2.2-2.367-3.371s-2.343-1.356-2.995-1.618c-.652-.261-.816-1.328 1.797-.522c2.613.807 2.74 3.005 3.565 3.518c.825.514 2.796.29 3.689-.122s.827-1.944.987-2.551c.201-.567-.509-.693-.524-.697c-.873 0-5.454-.997-6.713-5.433c-1.258-4.437.363-7.337 1.228-8.583q.864-1.248-.153-5.314Q17.466 13.2 19.473 16c.002.01 1.756-1.043 4.527-1.043s3.755.858 4.514 1.043s1.366-3.266 6.053-2.326c-.979 1.923-1.798 4.326-1.173 5.314c.626.987 3.08 4.127 1.573 8.583q-1.509 4.455-5.929 5.433q-.506.162-.506.522c0 .36.456.399 1.114 2.086q.66 1.686.096 9.635q-1.427.363-2.22.488c-.937.147-1.955.23-2.955.261c-1 .032-1.347.029-2.73-.1a20 20 0 0 1-2.654-.424" />
            </g>
          </svg>
        </Link>
      </div>

      <header className="pt-10 md:pt-16 pb-10 md:pb-16 flex flex-col flex-1 items-center justify-center gap-6 px-4">
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
              Get Started <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </header>
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

      <footer className="border-t py-6 px-4 text-center text-xs text-muted-foreground">
        <div className="flex justify-between flex-wrap">
          <p>
            Built with privacy in mind — your files never leave your browser.
          </p>
          <p>
            {new Date().getFullYear()} &copy; Free PDF Tool. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
