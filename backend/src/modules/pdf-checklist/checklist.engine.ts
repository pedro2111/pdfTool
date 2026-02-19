import { normalizeText } from './text-normalizer';
import { ChecklistResult, DocumentRules } from './types';
import * as fs from 'fs';
import * as path from 'path';

export class ChecklistEngine {
    private rules: DocumentRules;

    constructor() {
        // Carrega regras do arquivo JSON
        const rulesPath = path.join(__dirname, 'document-rules.json');
        const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
        this.rules = JSON.parse(rulesContent);
    }

    /**
     * Gera checklist detalhado a partir dos textos extraídos de cada arquivo
     * @param fileExtractions Lista de textos extraídos por arquivo
     * @returns Resultado completo com estatísticas e detalhes
     */
    async generateChecklist(fileExtractions: { filename: string, type: string, text: string }[]): Promise<ChecklistResult> {
        try {
            const received: string[] = [];
            const unclassifiedFiles: string[] = [];
            const unreadableFiles: string[] = [];
            const filesDetail: any[] = [];

            // 1. Processar cada arquivo para ver o que foi identificado
            for (const extraction of fileExtractions) {
                const cleanText = normalizeText(extraction.text);
                const isReadable = cleanText.trim().length > 10;

                let matchedLabel: string | null = null;

                if (isReadable) {
                    // Tenta casar com cada regra
                    for (const [key, rule] of Object.entries(this.rules)) {
                        if (this.validateDocument(cleanText, rule)) {
                            matchedLabel = rule.label;
                            if (!received.includes(rule.label)) {
                                received.push(rule.label);
                            }
                            break; // Assume um tipo por arquivo/segmento para simplicidade
                        }
                    }
                }

                if (!isReadable) {
                    unreadableFiles.push(extraction.filename);
                } else if (!matchedLabel) {
                    unclassifiedFiles.push(extraction.filename);
                }

                filesDetail.push({
                    filename: extraction.filename,
                    type: extraction.type,
                    textLength: cleanText.length,
                    isReadable: isReadable,
                    isIdentified: !!matchedLabel,
                    matchedRule: matchedLabel || undefined
                });
            }

            // 2. Determinar o que ficou pendente baseado nas regras globais
            const pending = Object.values(this.rules)
                .map(rule => rule.label)
                .filter(label => !received.includes(label));

            return {
                totalFiles: fileExtractions.length,
                received,
                pending,
                unclassifiedFiles,
                unreadableFiles,
                filesDetail
            };

        } catch (error) {
            console.error('Erro ao gerar checklist:', error);
            return {
                totalFiles: fileExtractions.length,
                received: [],
                pending: Object.values(this.rules).map(rule => rule.label),
                unclassifiedFiles: [],
                unreadableFiles: [],
                filesDetail: []
            };
        }
    }

    /**
     * Valida se um documento está presente no texto baseado nas regras
     */
    private validateDocument(text: string, rule: any): boolean {
        // Se a regra tem minOccurrences, conta quantas ocorrências existem
        if (rule.minOccurrences) {
            return this.validateByOccurrences(text, rule);
        }

        // Se a regra tem minMatches, conta quantas keywords diferentes foram encontradas
        if (rule.minMatches) {
            return this.validateByMatches(text, rule);
        }

        return false;
    }

    /**
     * Valida por número de ocorrências (ex: 3 contracheques)
     */
    private validateByOccurrences(text: string, rule: any): boolean {
        let totalCount = 0;

        for (const keyword of rule.keywords) {
            const normalizedKeyword = normalizeText(keyword);
            // Escapa caracteres especiais para regex se necessário (aqui assumimos keywords simples)
            const regex = new RegExp(normalizedKeyword, 'g');
            const matches = text.match(regex);

            if (matches) {
                totalCount += matches.length;
            }
        }

        return totalCount >= (rule.minOccurrences || 1);
    }

    /**
     * Valida por número de keywords diferentes encontradas
     */
    private validateByMatches(text: string, rule: any): boolean {
        let matchCount = 0;

        for (const keyword of rule.keywords) {
            const normalizedKeyword = normalizeText(keyword);

            if (text.includes(normalizedKeyword)) {
                matchCount++;
            }
        }

        return matchCount >= (rule.minMatches || 1);
    }
}

export const checklistEngine = new ChecklistEngine();
