export interface OpcoesFormatadorLmht {
    quebraLinha?: string;
    tamanhoIdentacao?: number;
    usarTabulacao?: boolean;
    aspasAtributos?: 'simples' | 'duplas';
    espacoAntesAutoFechante?: boolean;
    quebrarAtributosEmLinhas?: boolean;
    limiteCaracteresPorLinha?: number;
    preservarQuebraLinhaTexto?: boolean;
    ordenarAtributos?: boolean;
}