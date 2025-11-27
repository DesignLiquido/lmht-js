import { Atributo } from "./atributo";
import { ConstrutoLmht } from "./construto-lmht";
import { TextoLmht } from "./texto-lmht";

export class ElementoLmht implements ConstrutoLmht {
    linha: number;
    coluna: number;
    nome: string;
    atributos: Atributo[];
    filhos: (ElementoLmht | TextoLmht)[];
    autoFechante: boolean;

    constructor(
        linha: number,
        coluna: number,
        nome: string,
        atributos: Atributo[] = [],
        filhos: (ElementoLmht | TextoLmht)[] = [],
        autoFechante: boolean = false
    ) {
        this.linha = linha;
        this.coluna = coluna;
        this.nome = nome;
        this.atributos = atributos;
        this.filhos = filhos;
        this.autoFechante = autoFechante;
    }
}
