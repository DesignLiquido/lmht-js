import * as caminho from 'path';
import * as sistemaArquivos from 'fs';

import { Xslt } from 'xslt-processor';
import { ConversorComum } from './conversor-comum';

export class ConversorHtml extends ConversorComum {
    constructor() {
        super();
        this.processadorXslt = new Xslt({ selfClosingTags: true });
        const caminhoEspecificacao = caminho.join(__dirname, "./especificacao/lmht-reverso-xml10.xslt");

        const textoEspecificacao = sistemaArquivos.readFileSync(caminhoEspecificacao).toString();
        this.especificacao = this.avaliadorXml.xmlParse(textoEspecificacao);
    }
}
