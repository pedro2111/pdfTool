import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export const generatePdfThumbnail = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1); // Get first page

        const viewport = page.getViewport({ scale: 1 }); // Scale 1 for thumbnail
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Canvas context not available');
        }

        // Set dimensions for thumbnail (e.g., width 200px)
        const scale = 200 / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        await page.render({
            canvasContext: context,
            viewport: scaledViewport,
        } as any).promise;

        return canvas.toDataURL();
    } catch (error) {
        console.error('Error generating PDF thumbnail:', error);
        return ''; // Return empty string or placeholder
    }
};
