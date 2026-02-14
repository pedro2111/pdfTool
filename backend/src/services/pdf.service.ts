import sharp from 'sharp';
import { PDFDocument, PDFImage } from 'pdf-lib';

export class PdfService {
    /**
     * Converts a single image buffer to a PDF buffer with compression.
     */
    async convertImageToPdf(imageBuffer: Buffer): Promise<Buffer> {
        let image = sharp(imageBuffer);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            throw new Error('Invalid image metadata');
        }

        // Resize if too large to reduce file size (max width/height 2000px)
        // detailed documents usually don't need more than 2000px width (approx 200-300 DPI for A4)
        const MAX_DIMENSION = 2000;
        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            image = image.resize({
                width: metadata.width > metadata.height ? MAX_DIMENSION : undefined,
                height: metadata.height >= metadata.width ? MAX_DIMENSION : undefined,
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Update metadata after resize
        const resizedBuffer = await image.toBuffer();
        image = sharp(resizedBuffer); // Reload to get new metadata
        const newMetadata = await image.metadata();

        const width = newMetadata.width || metadata.width;
        const height = newMetadata.height || metadata.height;

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([width, height]);

        let uniqueImage;

        if (newMetadata.hasAlpha) {
            // PNG compression
            const pngBuffer = await image
                .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
                .toBuffer();
            uniqueImage = await pdfDoc.embedPng(pngBuffer);
        } else {
            // JPEG compression (quality 80 provides good balance)
            const jpegBuffer = await image
                .jpeg({ quality: 80, force: true })
                .toBuffer();
            uniqueImage = await pdfDoc.embedJpg(jpegBuffer);
        }

        page.drawImage(uniqueImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        // Save with object streams to reduce size
        const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        return Buffer.from(pdfBytes);
    }

    /**
     * Merges multiple PDF buffers into a single PDF buffer.
     */
    async mergePdfs(pdfBuffers: Buffer[]): Promise<Buffer> {
        const mergedPdf = await PDFDocument.create();

        for (const pdfBuffer of pdfBuffers) {
            const pdf = await PDFDocument.load(pdfBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        // Save with object streams to reduce size
        const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
        return Buffer.from(pdfBytes);
    }

    /**
     * Processes a list of files (mixed images and PDFs).
     * Images are converted to PDF first.
     * Then all PDFs are merged into one.
     */
    async convertAndMerge(files: Express.Multer.File[]): Promise<Buffer> {
        const pdfBuffers: Buffer[] = [];

        for (const file of files) {
            if (file.mimetype === 'application/pdf') {
                pdfBuffers.push(file.buffer);
            } else if (file.mimetype.startsWith('image/')) {
                const pdfBuffer = await this.convertImageToPdf(file.buffer);
                pdfBuffers.push(pdfBuffer);
            }
        }

        return this.mergePdfs(pdfBuffers);
    }
}

export const pdfService = new PdfService();
