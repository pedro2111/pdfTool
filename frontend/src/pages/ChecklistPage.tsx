import { useLocation, useNavigate } from 'react-router-dom';
import { useFileContext } from '../context/FileContext';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

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

export function ChecklistPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearFiles } = useFileContext();

    // O backend agora retorna os dados no formato ChecklistResult
    const data = location.state?.checklist as ChecklistResult;

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                <h1 className="text-xl font-bold text-slate-900">Nenhum resultado encontrado</h1>
                <Button variant="link" onClick={() => navigate('/pdf-tools')}>
                    Voltar para Conversor
                </Button>
            </div>
        );
    }

    const identifiedCount = data.received.length;
    const totalRules = data.received.length + data.pending.length;
    const completionPercent = totalRules > 0 ? (identifiedCount / totalRules) * 100 : 0;

    const handleFinish = () => {
        clearFiles();
        navigate('/pdf-tools');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container max-w-4xl mx-auto py-4 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Resultado do Processamento</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button variant="default" size="sm" onClick={handleFinish} className="bg-slate-900">
                            Finalizar e Limpar
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
                {/* Resumo e Score */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Status do Checklist</h3>
                            <span className="text-2xl font-bold text-slate-900">{Math.round(completionPercent)}%</span>
                        </div>
                        <Progress value={completionPercent} className="h-3 bg-slate-100" />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>{identifiedCount} de {totalRules} documentos identificados</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center items-center text-center space-y-1">
                        <span className="text-3xl font-bold">{data.totalFiles}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">Arquivos Processados</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Lista de Documentos Recebidos/Pendendes */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="text-emerald-500 h-5 w-5" /> Checklist Principal
                        </h4>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <ul className="divide-y divide-slate-100">
                                {data.received.map((item, idx) => (
                                    <li key={idx} className="p-4 flex items-center justify-between bg-emerald-50/30">
                                        <span className="text-sm font-medium text-slate-700">{item}</span>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md uppercase">Recebido</span>
                                    </li>
                                ))}
                                {data.pending.map((item, idx) => (
                                    <li key={idx} className="p-4 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">{item}</span>
                                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md uppercase flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Pendente
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Detalhamento Técnico e Observações */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="text-blue-500 h-5 w-5" /> Detalhes por Arquivo
                        </h4>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y overflow-hidden max-h-[500px] overflow-y-auto">
                            {data.filesDetail.map((file, idx) => (
                                <div key={idx} className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold text-slate-800 line-clamp-1 flex-1 mr-2" title={file.filename}>
                                            {file.filename}
                                        </p>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                                            {file.type.split('/')[1] || file.type}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        {!file.isReadable ? (
                                            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 font-bold uppercase">
                                                🚨 Não Legível (Foto/Scan ruim)
                                            </span>
                                        ) : file.isIdentified ? (
                                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-bold uppercase">
                                                🆔 {file.matchedRule}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 font-bold uppercase">
                                                ❓ Não Identificado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {data.unreadableFiles.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-1">
                                <p className="text-xs font-bold text-red-700 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> ATENÇÃO
                                </p>
                                <p className="text-[11px] text-red-600">
                                    {data.unreadableFiles.length} arquivo(s) parecem ser fotos ou scans sem camada de texto legível.
                                    O sistema tentou o OCR básico, mas o texto extraído foi insuficiente para classificação automática.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
