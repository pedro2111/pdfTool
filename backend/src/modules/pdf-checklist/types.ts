export interface PageOCRResult {
    page: number;
    text: string;
}

export interface DocumentRule {
    label: string;
    keywords: string[];
    minMatches?: number;
    minOccurrences?: number;
}

export interface DocumentRules {
    [key: string]: DocumentRule;
}

export interface FileProcessInfo {
    filename: string;
    type: string;
    textLength: number;
    isReadable: boolean;
    isIdentified: boolean;
    matchedRule?: string;
}

export interface ChecklistResult {
    totalFiles: number;
    received: string[];
    pending: string[];
    unclassifiedFiles: string[]; // Arquivos que foram lidos mas não casaram com nenhuma regra
    unreadableFiles: string[];     // PDFs com imagem ou vazios (sem camada de texto)
    filesDetail: FileProcessInfo[];
}
