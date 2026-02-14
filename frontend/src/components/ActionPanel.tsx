import { Download, Merge, FileImage, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useFileContext } from '../context/FileContext';
import { api } from '../services/api';
import { useToast } from './ui/use-toast';

export const ActionPanel = () => {
    const { files, clearFiles, processing, setProcessing } = useFileContext();
    const { toast } = useToast();

    if (files.length === 0) return null;

    const handleAction = async (action: 'convert' | 'merge' | 'convert-merge') => {
        setProcessing({ ...processing, isProcessing: true, progress: 0 });
        try {
            const rawFiles = files.map(f => f.file);

            if (action === 'convert') {
                // Process images individually
                const imageFiles = rawFiles.filter(f => f.type.startsWith('image/'));

                for (const file of imageFiles) {
                    const response = await api.convertImage(file);
                    const filename = `${file.name.split('.')[0]}.pdf`;

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    // Small delay to prevent browser blocking multiple downloads
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } else {
                let response;
                let filename = 'result.pdf';

                if (action === 'merge') {
                    response = await api.mergePdfs(rawFiles);
                    filename = 'merged.pdf';
                } else { // convert-merge
                    response = await api.convertAndMerge(rawFiles);
                    filename = 'combined.pdf';
                }

                // Download logic for single result
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

            toast({
                title: "Success!",
                description: "Files processed and downloaded.",
            });
            setProcessing({ isProcessing: false, progress: 100, error: null, success: true });

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Something went wrong during processing.",
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
                    Clear All
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
