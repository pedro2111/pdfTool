import { UploadDropzone } from '../components/UploadDropzone';
import { SortableList } from '../components/SortableList';
import { ActionPanel } from '../components/ActionPanel';
import { FileStack, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PdfConverter() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container max-w-4xl mx-auto py-4 px-4 flex items-center gap-2">
                    <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2" title="Voltar para Home">
                        <ArrowLeft className="text-slate-600 h-6 w-6" />
                    </Link>
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <FileStack className="text-primary h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Conversor de PDF</h1>
                </div>
            </header>

            <main className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
                <section className="space-y-4">
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Conversor de imagem em PDF e Juntar PDF
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            1 - Arraste e solte as imagens ou PDFs que deseja converter e juntar.
                        </p>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            2 - Se for apenas imagens, elas serão convertidas em PDF.
                        </p>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            3 - Se for PDFs e imagens, elas serão convertidas em PDF e juntadas.
                        </p>
                    </div>

                    <UploadDropzone />
                </section>

                <section>
                    <SortableList />
                </section>
            </main>

            <ActionPanel />
        </div>
    );
}
