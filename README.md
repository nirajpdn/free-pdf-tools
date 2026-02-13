# Free PDF Tools

A free, open-source web application for PDF. Edit, merge, split, arrange, draw on, and convert PDFs to images—all without subscriptions or watermarks.

## Demo

![Landing Screenshot](https://free-pdf-tools.vercel.app/landing-ss.png)
*Free PDF Tools - All-in-one PDF manipulation platform*

## Tech Stack

### Frontend
- **React** 19.2 - UI library
- **Next.js** 16.1 - React framework with SSR and static generation
- **TypeScript** - Type-safe development

### PDF Processing
- **pdfjs-dist** 5.4 - PDF rendering and viewing
- **pdf-lib** 1.17 - PDF manipulation and creation

### UI & Styling
- **Tailwind CSS** 4 - Utility-first CSS framework
- **Radix UI** 1.4 - Headless UI components
- **Shadcn** - Component library built on Radix UI
- **Lucide React** 0.563 - Icon library

### Utilities & Animations
- **Framer Motion** 12.34 - Animation library
- **jszip** 3.10 - ZIP file handling
- **nuqs** 2.8 - URL search params state management
- **Sonner** 2.0 - Toast notifications
- **Tailwind Merge** 3.4 - Utility class merging
- **clsx** 2.1 - Conditional className utility

## Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **pnpm** (or npm/yarn, but pnpm is recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-tools.git
cd pdf-tools
```

2. Install dependencies:
```bash
pnpm install
```
This automatically runs the postinstall hook to set up the PDF.js worker file.

### Running the Project

**Development Server**
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production Build**
```bash
pnpm build
pnpm start
```

**Linting**
```bash
pnpm lint
```

## Features

### ✅ Completed Features

- **Edit PDF** - Modify text, add annotations, and edit PDF content
- **Draw on PDFs** - Add freehand drawings and markup to documents
- **Merge PDFs** - Combine multiple PDF files into one
- **Split PDFs** - Extract specific pages or split documents
- **Arrange Pages** - Reorder and reorganize PDF pages
- **Convert to Images** - Export PDF pages as PNG/JPG images

### 🚀 Upcoming Features

- **Watermark PDFs** - Add text and image watermarks to documents
- **Compress PDFs** - Reduce file size while maintaining quality
- **Extract Text** - OCR support for scanned documents
- **Form Filling** - Interactive form field support
- **Digital Signatures** - Sign and verify document signatures
- **Batch Processing** - Process multiple files at once

## Project Structure

```
src/
├── app/               # Next.js app directory and pages
├── components/        # React components
│   ├── tools/        # PDF tool components (Edit, Draw, Merge, etc.)
│   └── ui/           # UI components (buttons, dialogs, etc.)
├── hooks/            # Custom React hooks
└── lib/              # Utility functions and helpers
```

## Contributing

We welcome contributions! Here's how to get involved:

### Setting Up for Development

1. Fork the repository
2. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```
3. Install dependencies and run the dev server:
```bash
pnpm install
pnpm dev
```

### Making Changes

- Keep changes focused and atomic
- Run linting before committing:
```bash
pnpm lint
```
- Follow the existing code style (TypeScript, functional components)

### Submitting a Pull Request

1. Commit your changes with clear messages
2. Push to your fork
3. Open a pull request with a description of your changes
4. Ensure all linting passes

## License

This project is open source and available under the MIT License.

## Support

If you find this tool helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🤝 Contributing code improvements
