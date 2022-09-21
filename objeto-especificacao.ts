import * as caminho from 'path';
import SaxonJS from 'saxon-js';

/**
 * Esse método não é exatamente usado mas está aqui para demonstrar como se 
 * compila uma especificação de XSLT para o formato que o SaxonJS aceita.
 * Mais informações: 
 * - https://www.saxonica.com/saxon-js/documentation2/index.html#!api/transform (ver parâmetro `stylesheetInternal`)
 * - https://stackoverflow.com/questions/63187173/how-to-convert-xsl-file-to-sef-file/66593325#66593325
 * @param plataforma 
 * @returns 
 */
export default function montarObjetoEspecificacao(plataforma: any): any {
    const documento = plataforma.parseXmlFromString(
        plataforma.readFile(
            caminho.join(__dirname, "./especificacao/lmht.xslt")));
            
    // Artifício técnico para evitar o seguinte erro: 
    // "Required cardinality of value of parameter $static-base-uri is exactly one; supplied value is empty"
    documento._saxonBaseUri = "file:///";

    return SaxonJS.compile(documento);
}
