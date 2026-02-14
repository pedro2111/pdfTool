import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useFileContext } from '../context/FileContext';
import { cn } from '../lib/utils';
import { useToast } from './ui/use-toast';

export const UploadDropzone = () => {
    const { addFiles } = useFileContext();
    const [isDragging, setIsDragging] = useState(false);
    const { toast } = useToast();

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(file =>
            file.type === 'application/pdf' ||
            file.type.startsWith('image/')
        );

        if (validFiles.length !== droppedFiles.length) {
            toast({
                title: "Invalid files detected",
                description: "Only PDF, JPG, PNG, and WEBP files are allowed.",
                variant: "destructive"
            });
        }

        if (validFiles.length > 0) {
            await addFiles(validFiles);
            toast({
                title: "Files added",
                description: `${validFiles.length} file(s) added successfully.`
            });
        }
    }, [addFiles, toast]);

    const onFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            await addFiles(files);
            toast({
                title: "Files added",
                description: `${files.length} file(s) added successfully.`
            });
        }
    }, [addFiles, toast]);

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/10" : "border-slate-300 hover:border-primary hover:bg-slate-50"
            )}
            onClick={() => document.getElementById('fileInput')?.click()}
        >
            <input
                type="file"
                id="fileInput"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={onFileInput}
            />
            <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Drag & Drop files here</h3>
            <p className="text-sm text-slate-500 mt-2">or click to select files</p>
            <p className="text-xs text-slate-400 mt-4">Supported: PDF, JPG, PNG, WEBP</p>
        </div>
    );
};
