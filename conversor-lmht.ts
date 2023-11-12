import * as caminho from 'path';
import * as sistemaArquivos from 'fs';

import { Xslt } from 'xslt-processor';
import { ConversorComum } from './conversor-comum';

/**
 * Classe que comanda a conversão de arquivos LMHT para HTML.
 */
export class ConversorLmht extends ConversorComum {
    constructor() {
        super();
        this.processadorXslt = new Xslt({ selfClosingTags: false });
        const caminhoEspecificacao = caminho.join(__dirname, "./especificacao/lmht10.xslt");

        const textoEspecificacao = sistemaArquivos.readFileSync(caminhoEspecificacao).toString();
        this.especificacao = this.avaliadorXml.xmlParse(textoEspecificacao);
    }
}
