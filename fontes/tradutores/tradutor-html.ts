import { Atributo, ComentarioLmht, DeclaracaoXmlLmht, DocTypeLmht, DocumentoLmht, ElementoLmht, TextoLmht } from "../construtos";
import { MAPEAMENTO_ATRIBUTOS } from "./mapeamento-atributos";
import { MAPEAMENTO_TAGS } from "./mapeamento-tags";
import { OpcoesTradutorHtml } from "./opcoes-tradutor-html";

export class TradutorHtml {
    private opcoes: OpcoesTradutorHtml;
    private nivelIdentacao: number = 0;

    constructor(opcoes: OpcoesTradutorHtml = {}) {
        this.opcoes = {
            identacao: opcoes.identacao ?? 2,
            usarTabulacao: opcoes.usarTabulacao ?? false,
            formatarSaida: opcoes.formatarSaida ?? true,
            preservarComentarios: opcoes.preservarComentarios ?? false,
            incluirDeclaracaoXml: opcoes.incluirDeclaracaoXml ?? false,
            incluirDocType: opcoes.incluirDocType ?? true,
        };
    }

    traduzir(documento: DocumentoLmht): string {
        let resultado = '';

        // Declaração XML (opcional)
        if (this.opcoes.incluirDeclaracaoXml && documento.declaracaoXml) {
            resultado += this.traduzirDeclaracaoXml(documento.declaracaoXml);
            if (this.opcoes.formatarSaida) {
                resultado += '\n';
            }
        }

        // DOCTYPE
        if (this.opcoes.incluirDocType) {
            if (documento.docType) {
                resultado += this.traduzirDocType(documento.docType);
            } else {
                // DOCTYPE padrão HTML5
                resultado += '<!DOCTYPE html>';
            }
            if (this.opcoes.formatarSaida) {
                resultado += '\n';
            }
        }

        // Comentários antes do elemento raiz
        if (this.opcoes.preservarComentarios && documento.comentarios.length > 0) {
            for (const comentario of documento.comentarios) {
                resultado += this.traduzirComentario(comentario);
                if (this.opcoes.formatarSaida) {
                    resultado += '\n';
                }
            }
        }

        // Elemento raiz
        if (documento.elementoRaiz) {
            resultado += this.traduzirElemento(documento.elementoRaiz);
        }

        return resultado;
    }

    private traduzirElemento(elemento: ElementoLmht): string {
        const nomeTagHtml = this.traduzirNomeTag(elemento.nome);
        let resultado = '';

        // Identação
        if (this.opcoes.formatarSaida) {
            resultado += this.obterIdentacao();
        }

        // Tag de abertura
        resultado += `<${nomeTagHtml}`;

        // Atributos
        if (elemento.atributos.length > 0) {
            resultado += this.traduzirAtributos(elemento.atributos);
        }

        // Tag auto-fechante
        if (elemento.autoFechante) {
            resultado += ' />';
            if (this.opcoes.formatarSaida) {
                resultado += '\n';
            }
            return resultado;
        }

        resultado += '>';

        // Filhos
        if (elemento.filhos.length > 0) {
            const temApenasTexto = elemento.filhos.length === 1 && 
                                   elemento.filhos[0] instanceof TextoLmht;

            if (!temApenasTexto && this.opcoes.formatarSaida) {
                resultado += '\n';
                this.nivelIdentacao++;
            }

            for (let i = 0; i < elemento.filhos.length; i++) {
                const filho = elemento.filhos[i];

                if (filho instanceof ElementoLmht) {
                    resultado += this.traduzirElemento(filho);
                } else if (filho instanceof TextoLmht) {
                    if (temApenasTexto) {
                        resultado += this.traduzirTexto(filho, false);
                    } else {
                        resultado += this.traduzirTexto(filho, true);
                    }
                }
            }

            if (!temApenasTexto && this.opcoes.formatarSaida) {
                this.nivelIdentacao--;
                resultado += this.obterIdentacao();
            }
        }

        // Tag de fechamento
        resultado += `</${nomeTagHtml}>`;
        if (this.opcoes.formatarSaida) {
            resultado += '\n';
        }

        return resultado;
    }

    private traduzirTexto(texto: TextoLmht, comIdentacao: boolean): string {
        let resultado = '';
        
        if (comIdentacao && this.opcoes.formatarSaida) {
            resultado += this.obterIdentacao();
        }
        
        resultado += this.escaparHtml(texto.conteudo);
        
        if (comIdentacao && this.opcoes.formatarSaida) {
            resultado += '\n';
        }
        
        return resultado;
    }

    private traduzirAtributos(atributos: Atributo[]): string {
        return atributos
            .map(attr => {
                const nomeAtributoHtml = this.traduzirNomeAtributo(attr.nome);
                const valorEscapado = this.escaparAtributo(attr.valor);
                return ` ${nomeAtributoHtml}="${valorEscapado}"`;
            })
            .join('');
    }

    private traduzirComentario(comentario: ComentarioLmht): string {
        return comentario.conteudo;
    }

    private traduzirDeclaracaoXml(declaracao: DeclaracaoXmlLmht): string {
        return declaracao.conteudo;
    }

    private traduzirDocType(docType: DocTypeLmht): string {
        // Traduzir DOCTYPE de LMHT para HTML
        if (docType.conteudo.includes('lmht')) {
            return '<!DOCTYPE html>';
        }
        return docType.conteudo;
    }

    private traduzirNomeTag(nomeTag: string): string {
        return MAPEAMENTO_TAGS[nomeTag] || nomeTag;
    }

    private traduzirNomeAtributo(nomeAtributo: string): string {
        // Atributos que começam com "dados-" devem ser traduzidos para "data-"
        if (nomeAtributo.startsWith('dados-')) {
            return 'data-' + nomeAtributo.substring(6);
        }
        
        // Atributos que começam com "aria-" devem ser preservados
        if (nomeAtributo.startsWith('aria-')) {
            return nomeAtributo;
        }
        
        return MAPEAMENTO_ATRIBUTOS[nomeAtributo] || nomeAtributo;
    }

    private escaparHtml(texto: string): string {
        return texto
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    private escaparAtributo(valor: string): string {
        return valor
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    private obterIdentacao(): string {
        if (!this.opcoes.formatarSaida) {
            return '';
        }

        const espacos = this.opcoes.identacao ?? 2;
        const caractere = this.opcoes.usarTabulacao ? '\t' : ' ';
        const quantidade = this.opcoes.usarTabulacao ? this.nivelIdentacao : this.nivelIdentacao * espacos;

        return caractere.repeat(quantidade);
    }
}