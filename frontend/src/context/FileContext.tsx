import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UploadedFile, ProcessingState } from '../types';
import { generatePdfThumbnail } from '../utils/pdf';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

interface FileContextType {
    files: UploadedFile[];
    addFiles: (newFiles: File[]) => Promise<void>;
    removeFile: (id: string) => void;
    reorderFiles: (newOrder: UploadedFile[]) => void;
    clearFiles: () => void;
    processing: ProcessingState;
    setProcessing: (state: ProcessingState) => void;
    updateFileName: (id: string, newName: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [processing, setProcessing] = useState<ProcessingState>({
        isProcessing: false,
        progress: 0,
        error: null,
        success: false,
    });

    const addFiles = async (newFiles: File[]) => {
        // Process files one by one to generate previews
        const processFiles = newFiles.map(async (file, index) => {
            let previewUrl = '';
            const type = file.type === 'application/pdf' ? 'pdf' : 'image';

            if (type === 'image') {
                previewUrl = URL.createObjectURL(file);
            } else {
                // Generate PDF thumbnail
                previewUrl = await generatePdfThumbnail(file);
            }

            return {
                id: generateId(),
                file,
                previewUrl,
                type: type as 'pdf' | 'image',
                name: file.name,
                originalName: file.name,
                order: files.length + index,
            };
        });

        const processed = await Promise.all(processFiles);

        // Sort logic: "arquivos devem aparecer inicialmente ordenados pelo número inicial do nome"
        // We can implement strict sort here or just append. 
        // User requirement: "arquivos devem aparecer inicialmente ordenados pelo número inicial do nome"
        // Let's combine existing + new, then sort everything? Or just append? 
        // Usually append is better UX, but if requirement says "Initially ordered", maybe for the BATCH being uploaded.
        // Let's append and let user reorder, but if they upload a batch "1.pdf, 2.pdf", it should come in that order.
        // Native selection usually gives them in name order on Windows, but let's ensure we respect it or sort the NEW batch.

        const sortedNew = processed.sort((a, b) => {
            const numA = parseInt(a.originalName.match(/^\d+/)?.[0] || '0');
            const numB = parseInt(b.originalName.match(/^\d+/)?.[0] || '0');
            return numA - numB || a.originalName.localeCompare(b.originalName);
        });

        setFiles(prev => [...prev, ...sortedNew]);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const reorderFiles = (newOrder: UploadedFile[]) => {
        setFiles(newOrder);
    };

    const clearFiles = () => {
        setFiles([]);
        setProcessing({ isProcessing: false, progress: 0, error: null, success: false });
    };

    const updateFileName = (id: string, newName: string) => {
        setFiles(prev => prev.map(f => (f.id === id ? { ...f, name: newName } : f)));
    }

    return (
        <FileContext.Provider value={{
            files,
            addFiles,
            removeFile,
            reorderFiles,
            clearFiles,
            processing,
            setProcessing,
            updateFileName
        }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};
