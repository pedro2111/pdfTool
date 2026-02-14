import { Router } from 'express';
import multer from 'multer';

import { pdfController } from '../controllers/pdf.controller';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit example
});

router.post('/convert-images', upload.array('files'), pdfController.convertImages);
router.post('/merge-pdfs', upload.array('files'), pdfController.mergePdfs);
router.post('/convert-and-merge', upload.array('files'), pdfController.convertAndMerge);

export default router;

