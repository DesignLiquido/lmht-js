import { ConstrutoLmht } from "./construto-lmht";

export class CDataLmht implements ConstrutoLmht {
    linha: number;
    coluna: number;
    conteudo: string;

    constructor(linha: number, coluna: number, conteudo: string) {
        this.linha = linha;
        this.coluna = coluna;
        this.conteudo = conteudo;
    }
}
