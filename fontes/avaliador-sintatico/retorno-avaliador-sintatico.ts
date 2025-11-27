import { DocumentoLmht } from "../construtos/documento-lmht";

export interface RetornoAvaliadorSintatico {
    arvore: DocumentoLmht;
    erros: string[];
}
