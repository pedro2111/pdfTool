import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import guidelinesData from '../data/guidelines.json';

interface Guideline {
    title: string;
    content: string;
}

export function Guidelines() {
    const [data, setData] = useState<Guideline[]>([]);

    useEffect(() => {
        // In a real app, this might be an API call.
        // Here we just load the imported JSON.
        setData(guidelinesData);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container max-w-4xl mx-auto py-4 px-4 flex items-center gap-2">
                    <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2" title="Voltar para Home">
                        <ArrowLeft className="text-slate-600 h-6 w-6" />
                    </Link>
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <ArrowLeft className="text-purple-600 h-6 w-6" />
                        {/* Note: Reuse existing icons or import BookOpen if needed, keeping it simple */}
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Orientações de Atendimento</h1>
                </div>
            </header>

            <main className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {data.map((item, index) => (
                        <AccordionItem key={index} title={item.title} content={item.content} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function AccordionItem({ title, content }: { title: string, content: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-slate-900">{title}</span>
                {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-slate-600 bg-slate-50/50">
                    {content}
                </div>
            )}
        </div>
    );
}
