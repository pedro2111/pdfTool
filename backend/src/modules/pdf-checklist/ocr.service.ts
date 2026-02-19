import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';
import { PageOCRResult } from './types';

export class OcrService {
    /**
     * Processa um arquivo individual (Imagem ou PDF) e extrai o texto
     */
    async processFile(file: Express.Multer.File): Promise<string> {
        console.log(`[OcrService] Analisando arquivo: ${file.originalname} | Mime: ${file.mimetype}`);

        // Regra do Usuário: Se for imagem -> OCR Direto
        if (file.mimetype.startsWith('image/')) {
            console.log(`[OcrService] Identificado como IMAGEM. Chamando Tesseract para ${file.originalname}`);
            return this.runOCRFromImage(file.buffer);
        }

        // Regra do Usuário: Se for PDF -> Extração Direta
        if (file.mimetype === 'application/pdf') {
            console.log(`[OcrService] Identificado como PDF. Chamando extração de texto para ${file.originalname}`);
            return this.extractTextFromPdf(file.buffer);
        }

        console.warn(`[OcrService] Tipo de arquivo não suportado para OCR: ${file.mimetype}`);
        return '';
    }

    /**
     * Executa OCR em uma imagem simples usando Tesseract.js
     */
    async runOCRFromImage(imageBuffer: Buffer): Promise<string> {
        let worker: any = null;
        try {
            // Usando por+eng para melhorar reconhecimento de números e símbolos junto com o português
            worker = await createWorker(['por', 'eng']);
            const { data: { text } } = await worker.recognize(imageBuffer);

            console.log('--- TEXTO EXTRAÍDO (OCR IMAGEM) ---');
            console.log(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
            console.log('--- TEXTO NORMALIZADO (O QUE O MOTOR VÊ) ---');
            const { normalizeText } = require('./text-normalizer');
            console.log(normalizeText(text).substring(0, 500) + '...');
            console.log('-----------------------------------');

            return text;
        } catch (error) {
            console.error('[OcrService] Erro no OCR de imagem:', error);
            return '';
        } finally {
            if (worker) await worker.terminate();
        }
    }

    /**
     * Tenta extrair texto diretamente do PDF (PDFs digitais) usando pdf-parse
     */
    async extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
        try {
            console.log('[OcrService] Tentando extração direta de texto do PDF...');

            // Com allowSyntheticDefaultImports habilitado e importação ESM, usamos direto:
            const data = await pdf(pdfBuffer);


            if (data && data.text) {
                const text = data.text.trim();

                console.log('--- TEXTO EXTRAÍDO (PDF DIGITAL) ---');
                console.log(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
                console.log('--- TEXTO NORMALIZADO (O QUE O MOTOR VÊ) ---');
                const { normalizeText } = require('./text-normalizer');
                console.log(normalizeText(text).substring(0, 500) + '...');
                console.log('------------------------------------');

                return text;
            }

            console.log('[OcrService] O PDF parece ser uma imagem ou está vazio.');
        } catch (err: any) {
            console.error('[OcrService] Erro na extração do PDF:', err.message);
        }
        return '';
    }
}

export const ocrService = new OcrService();
