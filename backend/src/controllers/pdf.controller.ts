import { Request, Response, NextFunction } from 'express';
import { pdfService } from '../services/pdf.service';

export class PdfController {

    async convertImages(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const files = req.files as Express.Multer.File[];

            // Passa o array de arquivos para o serviço que agora lida com o fluxo completo
            const result = await pdfService.convertImageToPdf(files);

            // Retorna JSON com PDF em base64 e o checklist gerado
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                pdf: result.pdfBuffer.toString('base64'),
                checklist: result.checklist
            });

        } catch (error) {
            next(error);
        }
    }

    async mergePdfs(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const files = req.files as Express.Multer.File[];
            const result = await pdfService.mergePdfs(files);

            // Retorna JSON com PDF em base64 e checklist
            res.setHeader('Content-Type', 'application/json');
            res.json({
                pdf: result.pdfBuffer.toString('base64'),
                checklist: result.checklist
            });
        } catch (error) {
            next(error);
        }
    }

    async convertAndMerge(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const files = req.files as Express.Multer.File[];
            const result = await pdfService.convertAndMerge(files);

            // Retorna JSON com PDF em base64 e checklist
            res.setHeader('Content-Type', 'application/json');
            res.json({
                pdf: result.pdfBuffer.toString('base64'),
                checklist: result.checklist
            });

        } catch (error) {
            next(error);
        }
    }
}

export const pdfController = new PdfController();
