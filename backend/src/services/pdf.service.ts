import sharp from 'sharp';
import { PDFDocument, PDFImage } from 'pdf-lib';
import { checklistEngine } from '../modules/pdf-checklist/checklist.engine';
import { ocrService } from '../modules/pdf-checklist/ocr.service';
import { ChecklistResult } from '../modules/pdf-checklist/types';

export class PdfService {
    /**
     * Converts an array of image files to a single PDF buffer with OCR and Checklist.
     * Order:
     * 1. Apply OCR to each image
     * 2. Apply existing compression
     * 3. Convert each image to PDF
     * 4. Merge all PDFs
     * 5. Apply checklist
     */
    async convertImageToPdf(files: Express.Multer.File[]): Promise<{ pdfBuffer: Buffer; checklist: ChecklistResult }> {
        const pdfDoc = await PDFDocument.create();
        const fileExtractions: { filename: string, type: string, text: string }[] = [];
        const pdfBuffers: Buffer[] = [];

        for (const file of files) {
            console.log(`[PdfService] Processando imagem para conversão: ${file.originalname}`);

            // 1. Aplicar o OCR em cada imagem (com pré-processamento para melhor eficácia)
            const preprocessedBuffer = await this.preprocessImageForOCR(file.buffer);
            const extractedText = await ocrService.runOCRFromImage(preprocessedBuffer);
            fileExtractions.push({
                filename: file.originalname,
                type: file.mimetype,
                text: extractedText
            });

            // 2 & 3. Realizar a compressão e transformar em pdf cada imagem (usando helper)
            const pdfBuffer = await this.compressAndConvertSingleImage(file.buffer);
            pdfBuffers.push(pdfBuffer);
        }

        // 4. Realizar o merge
        for (const buffer of pdfBuffers) {
            const pdf = await PDFDocument.load(buffer);
            const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => pdfDoc.addPage(page));
        }

        const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        const finalPdfBuffer = Buffer.from(pdfBytes);

        // 5. Aplicar o checklist
        const checklist = await checklistEngine.generateChecklist(fileExtractions);

        return {
            pdfBuffer: finalPdfBuffer,
            checklist
        };
    }

    /**
     * Internal helper to convert a single image buffer to a PDF buffer with compression.
     * (Reuses the original logic)
     */
    private async compressAndConvertSingleImage(imageBuffer: Buffer): Promise<Buffer> {
        let image = sharp(imageBuffer);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            throw new Error('Invalid image metadata');
        }

        const MAX_DIMENSION = 2000;
        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            image = image.resize({
                width: metadata.width > metadata.height ? MAX_DIMENSION : undefined,
                height: metadata.height >= metadata.width ? MAX_DIMENSION : undefined,
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        const resizedBuffer = await image.toBuffer();
        image = sharp(resizedBuffer);
        const newMetadata = await image.metadata();

        const width = newMetadata.width || metadata.width;
        const height = newMetadata.height || metadata.height;

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([width, height]);

        let uniqueImage;
        if (newMetadata.hasAlpha) {
            const pngBuffer = await image
                .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
                .toBuffer();
            uniqueImage = await pdfDoc.embedPng(pngBuffer);
        } else {
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

        const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        return Buffer.from(pdfBytes);
    }

    /**
     * Prepara a imagem para o OCR aplicando filtros do Sharp.
     */
    private async preprocessImageForOCR(imageBuffer: Buffer): Promise<Buffer> {
        console.log('[PdfService] Aplicando pré-processamento de imagem para OCR (Sharp)...');
        return sharp(imageBuffer)
            .resize({ width: 1500 })        // aumenta DPI proporcionalmente
            .grayscale()                    // remove cor
            .normalize()                    // melhora contraste
            .sharpen()                      // melhora nitidez
            .threshold(180)                 // binariza (preto e branco puro)
            .toBuffer();
    }

    /**
     * Mescla múltiplos arquivos, realizando OCR/Extração ANTES de qualquer conversão.
     */
    async mergePdfs(files: Express.Multer.File[]): Promise<{ pdfBuffer: Buffer; checklist: ChecklistResult }> {
        const mergedPdf = await PDFDocument.create();
        const fileExtractions: { filename: string, type: string, text: string }[] = [];
        const pdfBuffers: Buffer[] = [];

        for (const file of files) {
            console.log(`[PdfService] Iniciando processamento de: ${file.originalname}`);

            // 1. OCR/Extração no arquivo ORIGINAL
            let textToProcess = '';
            if (file.mimetype.startsWith('image/')) {
                const preprocessedBuffer = await this.preprocessImageForOCR(file.buffer);
                textToProcess = await ocrService.runOCRFromImage(preprocessedBuffer);
            } else {
                textToProcess = await ocrService.processFile(file);
            }

            fileExtractions.push({
                filename: file.originalname,
                type: file.mimetype,
                text: textToProcess
            });

            // 2. Preparação dos buffers
            if (file.mimetype === 'application/pdf') {
                pdfBuffers.push(file.buffer);
            } else if (file.mimetype.startsWith('image/')) {
                const pdfBuffer = await this.compressAndConvertSingleImage(file.buffer);
                pdfBuffers.push(pdfBuffer);
            }
        }

        // 3. Mesclagem
        for (const buffer of pdfBuffers) {
            const pdf = await PDFDocument.load(buffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
        const finalPdfBuffer = Buffer.from(pdfBytes);

        // 4. Geração do checklist
        const checklist = await checklistEngine.generateChecklist(fileExtractions);

        return {
            pdfBuffer: finalPdfBuffer,
            checklist
        };
    }

    /**
     * Agora o convertAndMerge apenas delega para o mergePdfs, que já cuida de tudo.
     */
    async convertAndMerge(files: Express.Multer.File[]): Promise<{ pdfBuffer: Buffer; checklist: ChecklistResult }> {
        return this.mergePdfs(files);
    }
}

export const pdfService = new PdfService();
