import SaxonJS from 'saxon-js';
import montarObjetoEspecificacao from './objeto-especificacao';

export default class ConversorLmht {
    plataforma: any;
    objetoEspecificacao: any;

    constructor() {
        this.plataforma = SaxonJS.getPlatform();
        this.objetoEspecificacao = montarObjetoEspecificacao(this.plataforma);
    }

    async converterPorArquivo() {
        const saida: any = await SaxonJS.transform({
            stylesheetInternal: this.objetoEspecificacao,
            sourceFileName: "./especificacao/exemplo.lmht",
            destination: "serialized"
        }, "async");
        return saida.principalResult;
    }
}
