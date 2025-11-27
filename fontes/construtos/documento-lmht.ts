import { ComentarioLmht } from "./comentario-lmht";
import { ConstrutoLmht } from "./construto-lmht";
import { DeclaracaoXmlLmht } from "./declaracao-xml-lmht";
import { ElementoLmht } from "./elemento-lmht";
import { DocTypeLmht } from "./tipo-documento-lmht";

export class DocumentoLmht implements ConstrutoLmht {
    linha: number;
    coluna: number;
    declaracaoXml?: DeclaracaoXmlLmht;
    docType?: DocTypeLmht;
    elementoRaiz?: ElementoLmht;
    comentarios: ComentarioLmht[];

    constructor(
        linha: number = 1,
        coluna: number = 1,
        declaracaoXml?: DeclaracaoXmlLmht,
        docType?: DocTypeLmht,
        elementoRaiz?: ElementoLmht,
        comentarios: ComentarioLmht[] = []
    ) {
        this.linha = linha;
        this.coluna = coluna;
        this.declaracaoXml = declaracaoXml;
        this.docType = docType;
        this.elementoRaiz = elementoRaiz;
        this.comentarios = comentarios;
    }
}
