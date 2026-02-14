# PDF Master Tool

A modern web application for converting and merging PDFs and Images.

## Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI, dnd-kit.
- **Backend**: Node.js, Express, Sharp, pdf-lib, Multer.

## Capabilities
- **Convert Images to PDF**: Supports JPG, PNG, WEBP.
- **Merge PDFs**: Combine multiple PDFs into one.
- **Mixed Processing**: Convert images and merge with PDFs in one go.
- **Interactive UI**: Drag & Drop reordering, Real-time previews.

## Prerequisites
- Node.js (v18+)

## Setup

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on `http://localhost:3000`.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on `http://localhost:5173`.

## Development
- Uses `memoryStorage` for file handling (no disk usage for temporary files).
- Styled with Tailwind CSS v4 variables.
- Components based on Radix UI primitives.

## License
MIT
