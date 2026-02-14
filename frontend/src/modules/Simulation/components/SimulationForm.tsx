import { Sliders, Calendar, Banknote, CheckCircle2, PiggyBank, Landmark, ReceiptText, Share2, Printer } from 'lucide-react';
import { useSimulation } from '../useSimulation';
import { InputMoney } from './InputMoney';

export function SimulationForm() {
    const { data, handleChange } = useSimulation();

    const totalEconomizado = (data.doacao_terreno || 0) + (data.cheque_morar_bem || 0) + (data.mcmv_desconto_simu || 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Parâmetros (Editáveis) */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <Sliders className="text-blue-600 w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Parâmetros</h2>
                        </div>
                        <p className="text-sm text-slate-500 ml-11">Ajuste os valores da simulação</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Valor Apartamento */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_valor_apartamento"
                                label="Valor do Apartamento"
                                value={data.valor_apartamento}
                                onChange={(v) => handleChange('valor_apartamento', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-base font-semibold transition-all"
                            />
                        </div>

                        {/* Doação de Terreno */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_doacao_terreno"
                                label="Doação de Terreno"
                                value={data.doacao_terreno}
                                onChange={(v) => handleChange('doacao_terreno', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
                            />
                        </div>

                        {/* Cheque Morar Bem */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_cheque_morar_bem"
                                label="Cheque Morar Bem"
                                value={data.cheque_morar_bem}
                                onChange={(v) => handleChange('cheque_morar_bem', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
                            />
                        </div>

                        {/* Desconto Caixa */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_desconto_caixa"
                                label="Desconto Caixa / MCMV"
                                value={data.desconto_caixa}
                                onChange={(v) => handleChange('desconto_caixa', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
                            />
                        </div>

                        {/* Valor Financiado */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_valor_financiado"
                                label="Valor Financiado"
                                value={data.valor_financiado}
                                onChange={(v) => handleChange('valor_financiado', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium transition-all"
                            />
                        </div>

                        {/* Valor Parcela */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_valor_parcela"
                                label="Valor da Parcela"
                                value={data.valor_parcela}
                                onChange={(v) => handleChange('valor_parcela', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium transition-all"
                            />
                        </div>

                        <div className="h-px bg-slate-100 my-2"></div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Outros Custos</p>

                        {/* Sinal Compra */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_sinal_compra"
                                label="Sinal de Compra (Ato)"
                                value={data.sinal_compra}
                                onChange={(v) => handleChange('sinal_compra', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium transition-all"
                            />
                        </div>
                        {/* Sinal */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_sinal"
                                label="Sinal (Após Aprovação)"
                                value={data.sinal}
                                onChange={(v) => handleChange('sinal', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium transition-all"
                            />
                        </div>
                        {/* Documentos Cartório */}
                        <div className="space-y-2">
                            <InputMoney
                                id="input_documentos_cartorio"
                                label="Documentos Cartório"
                                value={data.documentos_cartorio}
                                onChange={(v) => handleChange('documentos_cartorio', v)}
                                inputClassName="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Resultados */}
            <div className="lg:col-span-8 space-y-6">

                {/* 1. Main Gradient Card */}
                <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-500/30 p-1.5 rounded-lg backdrop-blur-sm">
                                    <Calendar className="text-blue-100 w-4 h-4" />
                                </span>
                                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">Parcela Mensal</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <InputMoney
                                    id="res_parcela_mensal"
                                    label=""
                                    value={data.valor_parcela}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-5xl lg:text-6xl font-extrabold tracking-tighter bg-transparent border-none text-white focus:ring-0 p-0 w-auto"
                                />
                            </div>
                            <p className="text-blue-100 text-sm mt-3 font-medium opacity-90">Primeira parcela do financiamento</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-white/20 p-1.5 rounded-lg">
                                    <Banknote className="text-white w-4 h-4" />
                                </span>
                                <p className="text-white text-xs font-bold uppercase tracking-wider">Entrada Necessária</p>
                            </div>
                            <div className="flex items-baseline gap-1 mb-1">
                                <InputMoney
                                    id="res_entrada_necessaria"
                                    label=""
                                    value={data.entrada_apos_desconto}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-3xl lg:text-4xl font-extrabold bg-transparent border-none text-white focus:ring-0 p-0 w-auto"
                                />
                            </div>
                            <div className="h-1 w-full bg-white/20 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-emerald-400 w-full rounded-full"></div>
                            </div>
                            <p className="text-emerald-300 text-xs font-bold mt-2 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Entrada calculada
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* 2. Subsidies & Discounts */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                <PiggyBank className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Subsídios e Descontos</h3>
                                <p className="text-xs text-slate-500">Benefícios aplicados</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group">
                                <span className="text-sm text-slate-600 group-hover:text-emerald-600 transition-colors">Doação de Terreno</span>
                                <InputMoney
                                    id="res_doacao_terreno"
                                    label=""
                                    value={data.doacao_terreno}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded border-none w-fit text-right"
                                />
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-sm text-slate-600 group-hover:text-emerald-600 transition-colors">Cheque Morar Bem</span>
                                <InputMoney
                                    id="res_cheque_morar_bem"
                                    label=""
                                    value={data.cheque_morar_bem}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded border-none w-fit text-right"
                                />
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-sm text-slate-600 group-hover:text-emerald-600 transition-colors">Desconto MCMV</span>
                                <InputMoney
                                    id="res_desconto_mcmv"
                                    label=""
                                    value={data.mcmv_desconto_simu}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded border-none w-fit text-right"
                                />
                            </div>
                            <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Economizado</span>
                                <InputMoney
                                    id="res_total_economizado"
                                    label=""
                                    value={totalEconomizado}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-base font-bold text-emerald-700 bg-transparent border-none w-32 text-right p-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Financial Composition */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <Landmark className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Composição Financeira</h3>
                                <p className="text-xs text-slate-500">Detalhes do contrato</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Valor do Imóvel</span>
                                <InputMoney
                                    id="res_valor_imovel"
                                    label=""
                                    value={data.valor_apartamento}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-sm font-bold text-slate-900 bg-transparent border-none w-28 text-right p-0"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Valor Financiado</span>
                                <InputMoney
                                    id="res_valor_financiado_comp"
                                    label=""
                                    value={data.valor_financiado}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-sm font-bold text-slate-900 bg-transparent border-none w-28 text-right p-0"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Entrada (Sem Descontos)</span>
                                <InputMoney
                                    id="res_entrada_sem_desconto"
                                    label=""
                                    value={data.entrada_sem_os_descontos}
                                    readOnly
                                    variant="clean"
                                    direction="row"
                                    inputClassName="text-sm font-bold text-slate-900 bg-transparent border-none w-28 text-right p-0"
                                />
                            </div>
                            <div className="pt-3 mt-1 bg-slate-50 -mx-6 px-6 pb-2 border-t border-slate-100">
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-bold text-slate-900">Valor Final com Descontos</span>
                                    <InputMoney
                                        id="res_valor_final"
                                        label=""
                                        value={data.valor_apartamento_com_descontos_codahb}
                                        readOnly
                                        variant="clean"
                                        direction="row"
                                        inputClassName="text-lg lg:text-xl font-extrabold text-blue-700 bg-transparent border-none w-fit min-w-[120px] text-right p-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Post-Approval Costs */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                <ReceiptText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Custos Pós-Aprovação</h3>
                                <p className="text-xs text-slate-500">Estimativa de despesas cartoriais e taxas</p>
                            </div>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded border border-amber-200">Importante</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Sinal de Compra</span>
                            <InputMoney
                                id="res_sinal_compra"
                                label=""
                                value={data.sinal_compra}
                                readOnly
                                variant="clean"
                                direction="row"
                                inputClassName="text-lg font-extrabold text-slate-900 bg-transparent border-none w-full text-left p-0"
                            />
                        </div>
                        <div className="flex flex-col border-l border-slate-200 pl-8">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Documentos Cartório (ITBI + Registro)</span>
                            <InputMoney
                                id="res_docs_cartorio"
                                label=""
                                value={data.documentos_cartorio}
                                readOnly
                                variant="clean"
                                direction="row"
                                inputClassName="text-lg font-extrabold text-slate-900 bg-transparent border-none w-full text-left p-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Compartilhar Simulação
                    </button>
                    <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        <Printer className="w-5 h-5" />
                        Imprimir Relatório
                    </button>
                </div>
            </div>
        </div>
    );
}
