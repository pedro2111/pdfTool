import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Progress } from "./ui/progress";

interface FileProcessInfo {
    filename: string;
    type: string;
    textLength: number;
    isReadable: boolean;
    isIdentified: boolean;
    matchedRule?: string;
}

interface ChecklistResult {
    totalFiles: number;
    received: string[];
    pending: string[];
    unclassifiedFiles: string[];
    unreadableFiles: string[];
    filesDetail: FileProcessInfo[];
}

interface ChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ChecklistResult | null;
}

export const ChecklistModal = ({ isOpen, onClose, data }: ChecklistModalProps) => {
    if (!data) return null;

    const identifiedCount = data.received.length;
    const totalRules = data.received.length + data.pending.length;
    const completionPercent = totalRules > 0 ? (identifiedCount / totalRules) * 100 : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        📋 Resultado do Checklist
                    </DialogTitle>
                    <DialogDescription>
                        Resumo do processamento de {data.totalFiles} arquivo(s)
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Resumo Estatístico */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-green-600 font-medium">Documentos Identificados</p>
                            <p className="text-2xl font-bold text-green-700">{identifiedCount}</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <p className="text-sm text-amber-600 font-medium">Pendentes</p>
                            <p className="text-2xl font-bold text-amber-700">{data.pending.length}</p>
                        </div>
                    </div>

                    {/* Barra de Progresso do Checklist */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Completude do Checklist</span>
                            <span className="font-medium">{Math.round(completionPercent)}%</span>
                        </div>
                        <Progress value={completionPercent} className="h-2" />
                    </div>

                    {/* Detalhamento de Arquivos */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Detalhamento por Arquivo:</h4>
                        <div className="border rounded-md divide-y overflow-hidden text-sm">
                            {data.filesDetail.map((file, idx) => (
                                <div key={idx} className="p-3 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800 truncate max-w-[300px]" title={file.filename}>
                                            {file.filename}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {file.type.split('/')[1].toUpperCase()} • {file.textLength} caracteres
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!file.isReadable ? (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase">
                                                Não Legível (Foto/Scan)
                                            </span>
                                        ) : file.isIdentified ? (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase">
                                                {file.matchedRule}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase">
                                                Não Classificado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seção de Pendências (Rules not matched) */}
                    {data.pending.length > 0 && (
                        <div className="bg-red-50/50 p-4 rounded-lg border border-red-100/50">
                            <h4 className="text-sm font-semibold text-red-700 mb-2">Ainda faltam:</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.pending.map((item, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-white border border-red-200 text-red-600 rounded text-xs shadow-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
