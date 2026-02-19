import { Download, Merge, FileImage, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useFileContext } from '../context/FileContext';
import { api } from '../services/api';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const ActionPanel = () => {
    const { files, clearFiles, processing, setProcessing } = useFileContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    if (files.length === 0) return null;

    const base64ToBlob = (base64: string, type: string): Blob => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
    };

    const handleAction = async (action: 'convert' | 'merge' | 'convert-merge') => {
        setProcessing({ ...processing, isProcessing: true, progress: 0 });
        try {
            const rawFiles = files.map(f => f.file);
            let response;
            let filename = 'result.pdf';

            if (action === 'convert') {
                response = await api.convertImages(rawFiles);
                filename = 'converted.pdf';
            } else if (action === 'merge') {
                response = await api.mergePdfs(rawFiles);
                filename = 'merged.pdf';
            } else { // convert-merge
                response = await api.convertAndMerge(rawFiles);
                filename = 'combined.pdf';
            }

            // Process JSON response with PDF and checklist
            const { pdf, checklist } = response.data;

            // Convert base64 to blob and download
            const pdfBlob = base64ToBlob(pdf, 'application/pdf');
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Navegar para a página de resultado com os dados do checklist
            if (checklist) {
                navigate('/checklist-result', { state: { checklist } });
            }

            toast({
                title: "Sucesso!",
                description: "Arquivos processados e baixados com sucesso.",
            });
            setProcessing({ isProcessing: false, progress: 100, error: null, success: true });

        } catch (error) {
            console.error(error);
            toast({
                title: "Erro",
                description: "Ocorreu um erro durante o processamento.",
                variant: "destructive"
            });
            setProcessing({ isProcessing: false, progress: 0, error: "Failed", success: false });
        }
    };

    const hasImages = files.some(f => f.type === 'image');
    const hasPdfs = files.some(f => f.type === 'pdf');
    const isMixed = hasImages && hasPdfs;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
            <div className="container max-w-4xl mx-auto flex items-center justify-between gap-4">
                <Button variant="outline" onClick={clearFiles} disabled={processing.isProcessing}>
                    Limpar Tudo
                </Button>

                <div className="flex gap-2">
                    {hasImages && !hasPdfs && (
                        <Button
                            onClick={() => handleAction('convert')}
                            disabled={processing.isProcessing}
                        >
                            {processing.isProcessing ? <Loader2 className="animate-spin mr-2" /> : <FileImage className="mr-2 h-4 w-4" />}
                            Converta Imagens em PDF
                        </Button>
                    )}

                    {hasPdfs && !hasImages && (
                        <Button
                            onClick={() => handleAction('merge')}
                            disabled={files.length < 2 || processing.isProcessing}
                        >
                            {processing.isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Merge className="mr-2 h-4 w-4" />}
                            Junte os PDFs
                        </Button>
                    )}

                    {(isMixed || (hasImages && hasPdfs)) && (
                        <Button
                            onClick={() => handleAction('convert-merge')}
                            disabled={processing.isProcessing}
                        >
                            {processing.isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2 h-4 w-4" />}
                            Converta Imagens em PDF & Junte
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
