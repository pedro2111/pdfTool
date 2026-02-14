export interface SimulationData {
    // Inputs (Manual & External)
    valor_apartamento: number;
    doacao_terreno: number; // Desconto
    cheque_morar_bem: number; // Benefício
    sinal_compra: number; // Entrada
    mcmv_desconto_simu: number; // Externo
    desconto_caixa: number; // Externo, Manual
    valor_parcela: number; // Externo, Manual
    documentos_cartorio: number;
    sinal: number;
    valor_financiado: number; // Externo

    // Calculated Fields
    valor_entrada: number;
    valor_apartamento_com_descontos_codahb: number;
    valor_financiamento: number;
    entrada_sem_os_descontos: number;
    entrada_apos_desconto: number;
    parcela_apartamento: number;
}

export const initialSimulationData: SimulationData = {
    valor_apartamento: 225000,
    doacao_terreno: 30500,
    cheque_morar_bem: 16079.27,
    sinal_compra: 1000, // Based on image
    mcmv_desconto_simu: 0,
    desconto_caixa: 0,
    valor_parcela: 0,
    documentos_cartorio: 2593.26,
    sinal: 1000, // Based on image 'Sinal' in 'Após Aprovação Caixa' section could be distinct or same. Image shows 'Sinal' 1.000,00 in bottom section.
    valor_financiado: 0,
    valor_entrada: 0,
    valor_apartamento_com_descontos_codahb: 0,
    valor_financiamento: 0,
    entrada_sem_os_descontos: 0,
    entrada_apos_desconto: 0,
    parcela_apartamento: 0,
};
