import * as sistemaArquivos from 'fs';

import { Xslt, XmlParser } from 'xslt-processor';
import { XDocument } from 'xslt-processor/dom';

export abstract class ConversorComum {
    especificacao: XDocument;
    processadorXslt: Xslt;
    avaliadorXml: XmlParser;

    constructor() {
        this.avaliadorXml = new XmlParser();
    }

    /**
     * Converte um arquivo de um formato para outro, ou de 
     * LMHT para texto (serialização) HTML, ou de HTML para LMHT, 
     * dependendo da classe derivada.
     * @param caminhoArquivo O caminho do arquivo. Deve ser absoluto.
     * @returns O resultado da transformação de um formato para outro.
     */
    converterPorArquivo(caminhoArquivo: string): string {
        const textoArquivo = sistemaArquivos.readFileSync(caminhoArquivo).toString();
        const xml = this.avaliadorXml.xmlParse(textoArquivo);
        return this.processadorXslt.xsltProcess(xml, this.especificacao);
    }

    /**
     * Converte uma sequência de caracteres de um formato para outro, ou 
     * de LMHT para texto (serialização) HTML, ou de HTML para LMHT,
     * dependendo da classe derivada.
     * @param caminhoArquivo O caminho do arquivo. Deve ser absoluto.
     * @returns O resultado da transformação de um formato para outro.
     */
    converterPorTexto(texto: string) {
        if (!texto) {
            return "";
        }

        const xml = this.avaliadorXml.xmlParse(texto);
        return this.processadorXslt.xsltProcess(xml, this.especificacao);
    }
}
