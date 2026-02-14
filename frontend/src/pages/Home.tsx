import { FileStack, Calculator, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: PDF Converter */}
                <Link to="/pdf-tools" className="group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full flex flex-col items-center text-center space-y-4">
                        <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors">
                            <FileStack className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Conversor PDF</h2>
                        <p className="text-slate-600">
                            Converta imagens para PDF, junte múltiplos arquivos e organize seus documentos.
                        </p>
                    </div>
                </Link>

                {/* Card 2: Simulation */}
                <Link to="/simulacao" className="group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer h-full flex flex-col items-center text-center space-y-4">
                        <div className="bg-emerald-50 p-4 rounded-full group-hover:bg-emerald-100 transition-colors">
                            <Calculator className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Simulação</h2>
                        <p className="text-slate-600">
                            Simule financiamentos com as regras exatas da planilha Modelo.
                        </p>
                    </div>
                </Link>

                {/* Card 3: Guidelines */}
                <Link to="/orientacoes" className="group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer h-full flex flex-col items-center text-center space-y-4">
                        <div className="bg-purple-50 p-4 rounded-full group-hover:bg-purple-100 transition-colors">
                            <BookOpen className="w-12 h-12 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Orientações</h2>
                        <p className="text-slate-600">
                            Confira as diretrizes de atendimento e informações importantes.
                        </p>
                    </div>
                </Link>

            </div>
        </div>
    );
}
