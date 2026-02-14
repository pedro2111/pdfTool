import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, FileText, Image as ImageIcon } from 'lucide-react';
import type { UploadedFile } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useFileContext } from '../context/FileContext';

interface FileCardProps {
    file: UploadedFile;
}

export const FileCard = ({ file }: FileCardProps) => {
    const { removeFile, updateFileName } = useFileContext();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: file.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group touch-none">
            <Card className="p-3 flex items-center space-x-4 hover:shadow-md transition-shadow">
                <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600">
                    <GripVertical size={20} />
                </div>

                <div className="h-16 w-16 bg-slate-100 rounded overflow-hidden flex-shrink-0 relative border">
                    {file.previewUrl ? (
                        <img src={file.previewUrl} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            {file.type === 'pdf' ? <FileText className="text-slate-400" /> : <ImageIcon className="text-slate-400" />}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <input
                        className="font-medium text-sm text-slate-700 truncate bg-transparent border-none focus:ring-0 w-full p-1 hover:bg-slate-50 rounded"
                        value={file.name}
                        onChange={(e) => updateFileName(file.id, e.target.value)}
                        placeholder="Filename"
                    />
                    <div className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                        <span className="uppercase bg-slate-100 px-1.5 py-0.5 rounded">{file.type}</span>
                        <span>{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-500"
                    onClick={() => removeFile(file.id)}
                >
                    <Trash2 size={18} />
                </Button>
            </Card>
        </div>
    );
};
