import * as sistemaArquivos from 'fs';

import { Xslt, XmlParser, XDocument } from 'xslt-processor';

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
    async converterPorArquivo(caminhoArquivo: string): Promise<string> {
        const textoArquivo = sistemaArquivos.readFileSync(caminhoArquivo).toString();
        const xml = this.avaliadorXml.xmlParse(textoArquivo);
        return await this.processadorXslt.xsltProcess(xml, this.especificacao);
    }

    /**
     * Converte uma sequência de caracteres de um formato para outro, ou 
     * de LMHT para texto (serialização) HTML, ou de HTML para LMHT,
     * dependendo da classe derivada.
     * @param caminhoArquivo O caminho do arquivo. Deve ser absoluto.
     * @returns O resultado da transformação de um formato para outro.
     */
    async converterPorTexto(texto: string): Promise<string> {
        if (!texto) {
            return Promise.resolve("");
        }

        const xml = this.avaliadorXml.xmlParse(texto);
        return await this.processadorXslt.xsltProcess(xml, this.especificacao);
    }
}
