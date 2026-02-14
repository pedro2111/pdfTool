import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator } from 'lucide-react';
import { SimulationForm } from '../modules/Simulation/components/SimulationForm';

export function SimulationPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container max-w-6xl mx-auto py-4 px-4 flex items-center gap-2">
                    <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2" title="Voltar para Home">
                        <ArrowLeft className="text-slate-600 h-6 w-6" />
                    </Link>
                    <div className="bg-emerald-100 p-2 rounded-lg">
                        <Calculator className="text-emerald-600 h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Simulação de Financiamento</h1>
                </div>
            </header>

            <main className="container max-w-6xl mx-auto py-8 px-4">
                <SimulationForm />
            </main>
        </div>
    );
}
