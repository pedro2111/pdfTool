import type { SimulationData } from '../types';

/**
 * Sanitiza um número de telefone removendo caracteres não numéricos.
 */
export function sanitizePhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
}

/**
 * Valida se um número de telefone possui pelo menos 10 ou 11 dígitos.
 */
export function validatePhoneNumber(phone: string): boolean {
    const sanitized = sanitizePhoneNumber(phone);
    return sanitized.length >= 10 && sanitized.length <= 11;
}

/**
 * Adiciona o código do país (55 para Brasil) se não estiver presente.
 */
export function addCountryCode(phone: string): string {
    const sanitized = sanitizePhoneNumber(phone);

    // Se já tem código do país (mais de 11 dígitos), retorna como está
    if (sanitized.length > 11) {
        return sanitized;
    }

    // Adiciona código do Brasil (55)
    return `55${sanitized}`;
}

export function generateShareMessage(data: SimulationData): string {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const message = `*Resultado da Simulação de Financiamento*

*Valor do Imóvel:* ${formatCurrency(data.valor_apartamento || 0)}

*Parcela Mensal:* ${formatCurrency(data.valor_parcela || 0)}

*Entrada Necessária:* ${formatCurrency(data.entrada_apos_desconto || 0)}

*Valor Financiado:* ${formatCurrency(data.valor_financiado || 0)}

*Total Economizado:*
- Doação de Terreno: ${formatCurrency(data.doacao_terreno || 0)}
- Cheque Morar Bem: ${formatCurrency(data.cheque_morar_bem || 0)}
- Desconto MCMV: ${formatCurrency(data.mcmv_desconto_simu || 0)}

*Valor Final com Descontos:* ${formatCurrency(data.valor_apartamento_com_descontos_codahb || 0)}`.trim();

    return message;
}

/**
 * Monta a URL do WhatsApp Web com número e mensagem.
 */
export function buildWhatsAppURL(phone: string, message: string): string {
    const phoneWithCountryCode = addCountryCode(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://web.whatsapp.com/send?phone=${phoneWithCountryCode}&text=${encodedMessage}`;
}

/**
 * Abre o WhatsApp Web em uma nova aba.
 */
export function openWhatsApp(phone: string, data: SimulationData): void {
    const message = generateShareMessage(data);
    const url = buildWhatsAppURL(phone, message);
    window.open(url, '_blank');
}
