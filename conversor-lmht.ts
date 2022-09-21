import * as caminho from 'path';
import SaxonJS from 'saxon-js';

/**
 * Classe que comanda a conversão de arquivos LMHT para HTML.
 */
export default class ConversorLmht {
    plataforma: any;

    constructor() {
        this.plataforma = SaxonJS.getPlatform();
    }

    /**
     * Converte um arquivo de LMHT para texto (serialização) HTML.
     * @param caminhoArquivo O caminho do arquivo, podendo ser absoluto ou relativo.
     * @returns O resultado da transformação de LMHT para HTML.
     */
    async converterPorArquivo(caminhoArquivo: string) {
        const saida: any = await SaxonJS.transform({
            stylesheetFileName: caminho.join(__dirname, "lmht.sef.json"),
            sourceFileName: caminhoArquivo,
            destination: "serialized"
        }, "async");
        return saida.principalResult;
    }
}
