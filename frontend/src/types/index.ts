export interface UploadedFile {
    id: string;
    file: File;
    previewUrl?: string;
    type: 'image' | 'pdf';
    name: string;
    order: number;
    originalName: string;
}

export interface ProcessingState {
    isProcessing: boolean;
    progress: number;
    error: string | null;
    success: boolean;
}
