import { ConversorLmht } from "./conversor-lmht";

export class ConversorHtml extends ConversorLmht {
    constructor(diretorioEspecificacao: string = __dirname, enderecoBaseEspecificacao: string = null) {
        super(diretorioEspecificacao, enderecoBaseEspecificacao);
        this.arquivoSef = 'lmht-reverso-xml10.sef.json';
    }
}