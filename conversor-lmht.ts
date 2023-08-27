import * as caminho from 'path';
import * as sistemaArquivos from 'fs';

import { Xslt, xmlParse } from 'xslt-processor';
import { XDocument } from 'xslt-processor/dom';

/**
 * Classe que comanda a conversão de arquivos LMHT para HTML.
 */
export class ConversorLmht {
    especificacao: XDocument;
    processadorXslt: Xslt;

    constructor(caminhoEspecificacao?: string) {
        this.processadorXslt = new Xslt();
        if (!caminhoEspecificacao) {
            caminhoEspecificacao = caminho.join(__dirname, "./especificacao/lmht10.xslt");
        }

        const textoEspecificacao = sistemaArquivos.readFileSync(caminhoEspecificacao).toString();
        this.especificacao = xmlParse(textoEspecificacao);
    }

    /**
     * Converte um arquivo de LMHT para texto (serialização) HTML.
     * @param caminhoArquivo O caminho do arquivo. Deve ser absoluto.
     * @returns O resultado da transformação de LMHT para HTML.
     */
    converterPorArquivo(caminhoArquivo: string) {
        const textoArquivo = sistemaArquivos.readFileSync(caminhoArquivo).toString();
        const xml = xmlParse(textoArquivo);
        return this.processadorXslt.xsltProcess(xml, this.especificacao);
    }

    /**
     * Converte uma sequência de caracteres em LMHT para texto (serialização) HTML.
     * @param caminhoArquivo O caminho do arquivo. Deve ser absoluto.
     * @returns O resultado da transformação de LMHT para HTML.
     */
    converterPorTexto(texto: string) {
        if (!texto) {
            return "";
        }

        const xml = xmlParse(texto);
        return this.processadorXslt.xsltProcess(xml, this.especificacao);
    }
}
