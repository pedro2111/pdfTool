import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Gera um PDF a partir de um elemento HTML específico.
 * 
 * @param elementId - O ID do elemento no DOM que será capturado.
 * @param fileName - O nome do arquivo gerado (padrão: 'simulacao.pdf').
 */
export async function generateSimulationPDF(elementId: string, fileName: string = 'simulacao.pdf'): Promise<void> {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Elemento com ID "${elementId}" não encontrado.`);
        return;
    }

    try {
        // Captura o elemento como um canvas
        // Escala 2 para melhorar a qualidade da imagem no PDF
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                // Remove elementos com 'no-print' no clone antes da captura
                const noPrintElements = clonedDoc.querySelectorAll('.no-print');
                noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');

                // SOLUÇÃO DEFINITIVA: Remove TODAS as folhas de estilo do clone
                // Isso impede que o html2canvas tente parsear oklab/oklch das regras CSS
                const styleSheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
                styleSheets.forEach(sheet => sheet.remove());

                // Agora força TODOS os estilos computados como inline
                // O navegador já converteu oklch/oklab para rgb no computedStyle
                const allElements = clonedDoc.getElementsByTagName('*');
                for (let i = 0; i < allElements.length; i++) {
                    const el = allElements[i] as HTMLElement;

                    // Pega o estilo computado do elemento ORIGINAL (antes de remover as folhas)
                    const originalElement = document.getElementsByTagName('*')[i];
                    if (!originalElement) continue;

                    const computedStyle = window.getComputedStyle(originalElement);

                    // Força os estilos mais importantes como inline
                    el.style.backgroundColor = computedStyle.backgroundColor;
                    el.style.color = computedStyle.color;
                    el.style.borderColor = computedStyle.borderColor;
                    el.style.borderWidth = computedStyle.borderWidth;
                    el.style.borderStyle = computedStyle.borderStyle;
                    el.style.borderRadius = computedStyle.borderRadius;
                    el.style.padding = computedStyle.padding;
                    el.style.margin = computedStyle.margin;
                    el.style.fontSize = computedStyle.fontSize;
                    el.style.fontWeight = computedStyle.fontWeight;
                    el.style.lineHeight = computedStyle.lineHeight;
                    el.style.textAlign = computedStyle.textAlign;
                    el.style.display = computedStyle.display;
                    el.style.width = computedStyle.width;
                    el.style.height = computedStyle.height;
                    el.style.boxShadow = computedStyle.boxShadow;

                    // Para gradientes, simplificamos para cor sólida
                    if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
                        el.style.backgroundImage = 'none';
                        // Se for um gradiente azul (card principal), usa azul sólido
                        if (originalElement.classList.contains('bg-gradient-to-br')) {
                            el.style.backgroundColor = 'rgb(37, 99, 235)'; // blue-600
                        }
                    }
                }

                const resultsContainer = clonedDoc.getElementById(elementId);
                if (resultsContainer) {
                    resultsContainer.style.backgroundColor = '#ffffff';
                    resultsContainer.style.padding = '20px';
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');

        // Configuração do PDF (A4)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Adiciona a imagem ao PDF mantendo a proporção da largura
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Download automático
        pdf.save(fileName);
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
    }
}
