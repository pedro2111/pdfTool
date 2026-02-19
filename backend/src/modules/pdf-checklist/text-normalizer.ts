/**
 * Normaliza texto para facilitar comparação de palavras-chave
 * - Converte para UPPERCASE
 * - Remove acentos
 * - Remove espaços duplicados
 * - Remove quebras de linha desnecessárias
 */
export function normalizeText(text: string): string {
    return text
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/\s+/g, ' ') // Remove espaços duplicados
        .replace(/\n+/g, ' ') // Remove quebras de linha
        .trim();
}
