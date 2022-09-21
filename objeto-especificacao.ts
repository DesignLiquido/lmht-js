import SaxonJS from 'saxon-js';

export default function montarObjetoEspecificacao(plataforma: any): any {
    const documento = plataforma.parseXmlFromString(plataforma.readFile("./especificacao/lmht.xslt"));
    // hack: avoid error "Required cardinality of value of parameter $static-base-uri is exactly one; supplied value is empty"
    documento._saxonBaseUri = "file:///";

    return SaxonJS.compile(documento);
}
