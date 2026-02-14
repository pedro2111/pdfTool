import { useState, useEffect } from 'react';
import { type SimulationData, initialSimulationData } from './types';

const STORAGE_KEY = 'simulation_data';

export const useSimulation = () => {
    const [data, setData] = useState<SimulationData>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : initialSimulationData;
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // Calculation Logic
    // Using a separate effect to update calculated fields when inputs change.
    // This ensures reactivity.
    useEffect(() => {
        setData(prev => {
            // Destructure inputs to avoid circular dependency triggers if we were naive, 
            // but here we are calculating strictly based on current state.
            // However, to avoid infinite loops, we should only update if values actually change.
            // But since we are replacing the whole object in strict mode, let's just calculate.

            // 0. MCMV (desconto Simu.) mirrors Desconto Caixa
            const mcmv_desconto_simu = prev.desconto_caixa || 0;

            // 1. Valor Entrada = Doação de Terreno + Cheque Morar Bem
            const valor_entrada = (prev.doacao_terreno || 0) + (prev.cheque_morar_bem || 0);

            // 2. Valor do Apartamento Com Descontos Codahb
            const valor_apartamento_com_descontos_codahb = (prev.valor_apartamento || 0)
                - (prev.doacao_terreno || 0)
                - (prev.cheque_morar_bem || 0)
                - mcmv_desconto_simu;

            // 3. Valor Financiamento = Valor Financiado (Mirror)
            const valor_financiamento = prev.valor_financiado || 0;

            // 4. Entrada Sem os Descontos = Valor Entrada
            const entrada_sem_os_descontos = valor_entrada;

            // 5. Entrada após desconto
            const entrada_apos_desconto = entrada_sem_os_descontos
                - (prev.doacao_terreno || 0)
                - (prev.cheque_morar_bem || 0);

            // 6. Parcela Apartamento = Valor da Parcela
            const parcela_apartamento = prev.valor_parcela || 0;

            // Check if any calculated value is different to avoid unnecessary re-renders/loops
            // (Strictly speaking, setting state with same values might trigger re-render in some React versions but we want to be safe)
            const newCalculatedValues = {
                mcmv_desconto_simu,
                valor_entrada,
                valor_apartamento_com_descontos_codahb,
                valor_financiamento,
                entrada_sem_os_descontos,
                entrada_apos_desconto,
                parcela_apartamento
            };

            const hasChanged =
                prev.mcmv_desconto_simu !== newCalculatedValues.mcmv_desconto_simu ||
                prev.valor_entrada !== newCalculatedValues.valor_entrada ||
                prev.valor_apartamento_com_descontos_codahb !== newCalculatedValues.valor_apartamento_com_descontos_codahb ||
                prev.valor_financiamento !== newCalculatedValues.valor_financiamento ||
                prev.entrada_sem_os_descontos !== newCalculatedValues.entrada_sem_os_descontos ||
                prev.entrada_apos_desconto !== newCalculatedValues.entrada_apos_desconto ||
                prev.parcela_apartamento !== newCalculatedValues.parcela_apartamento;

            if (hasChanged) {
                return {
                    ...prev,
                    ...newCalculatedValues
                };
            }
            return prev;
        });
    }, [
        data.valor_apartamento,
        data.doacao_terreno,
        data.cheque_morar_bem,
        data.desconto_caixa, // Updated dependency
        data.valor_financiado,
        data.valor_parcela
        // removed mcmv_desconto_simu from dependency to avoid cycles/redundancy since it is now derived
    ]);

    const handleChange = (field: keyof SimulationData, value: number) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return { data, handleChange };
};
