import * as caminho from 'path';
import SaxonJS from 'saxon-js';

/**
 * Classe que comanda a conversão de arquivos LMHT para HTML.
 */
export class ConversorLmht {
    plataforma: any;
    diretorioEspecificacao: string;
    enderecoBaseEspecificacao: string;

    constructor(diretorioEspecificacao: string = __dirname, enderecoBaseEspecificacao: string = null) {
        this.plataforma = SaxonJS.getPlatform();
        this.diretorioEspecificacao = diretorioEspecificacao;
        this.enderecoBaseEspecificacao = enderecoBaseEspecificacao;
    }

    private objetoParaTransformacao(
            texto: string = null, 
            caminhoArquivo: string = null) {
        let objeto = {
            destination: "serialized"
        };

        if (texto) {
            objeto['sourceText'] = texto;
        } else if (caminhoArquivo) {
            objeto['sourceFileName'] = caminhoArquivo;
        } 
        
        if (this.enderecoBaseEspecificacao) {
            objeto['stylesheetBaseURI'] = this.enderecoBaseEspecificacao + "/lmht.sef.json";
        } else {
            objeto['stylesheetFileName'] = caminho.join(this.diretorioEspecificacao, "lmht.sef.json");
        }

        return objeto;
    }

    /**
     * Converte um arquivo de LMHT para texto (serialização) HTML.
     * @param caminhoArquivo O caminho do arquivo, podendo ser absoluto ou relativo.
     * @returns O resultado da transformação de LMHT para HTML.
     */
    async converterPorArquivo(caminhoArquivo: string) {
        const objetoParaTransformacao = this.objetoParaTransformacao(null, caminhoArquivo);
        const saida: any = await SaxonJS.transform(objetoParaTransformacao, "async");
        return saida.principalResult;
    }

    /**
     * Converte uma sequência de caracteres em LMHT para texto (serialização) HTML.
     * @param caminhoArquivo O caminho do arquivo, podendo ser absoluto ou relativo.
     * @returns O resultado da transformação de LMHT para HTML.
     */
    async converterPorTexto(texto: string) {
        if (!texto) {
            return "";
        }

        const objetoParaTransformacao = this.objetoParaTransformacao(texto, null);
        const saida: any = await SaxonJS.transform(objetoParaTransformacao, "async");
        return saida.principalResult;
    }
}
