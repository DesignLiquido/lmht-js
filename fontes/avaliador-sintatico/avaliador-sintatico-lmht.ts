import { Atributo, ComentarioLmht, DeclaracaoXmlLmht, DocTypeLmht, DocumentoLmht, ElementoLmht, TextoLmht } from "../construtos";
import { TipoToken } from "../lexador/tipo-token";
import { Token } from "../lexador/token";
import { RetornoAvaliadorSintatico } from "./retorno-avaliador-sintatico";

export class AvaliadorSintaticoLmht {
    private tokens: Token[] = [];
    private erros: string[] = [];
    private atual: number = 0;

    analisar(tokens: Token[]): RetornoAvaliadorSintatico {
        this.tokens = tokens;
        this.erros = [];
        this.atual = 0;

        const arvore = this.analisarDocumento();

        return {
            arvore,
            erros: this.erros
        };
    }

    private analisarDocumento(): DocumentoLmht {
        const documento = new DocumentoLmht();

        // Analisar declaração XML (opcional)
        if (this.verificarTipoSimboloAtual(TipoToken.DECLARACAO_XML)) {
            const declaracaoToken = this.avancar();
            documento.declaracaoXml = new DeclaracaoXmlLmht(
                declaracaoToken.linha,
                declaracaoToken.coluna,
                declaracaoToken.lexema
            );
        }

        // Analisar comentários antes do DOCTYPE
        while (this.verificarTipoSimboloAtual(TipoToken.COMENTARIO)) {
            const comentarioToken = this.avancar();
            documento.comentarios.push(
                new ComentarioLmht(
                    comentarioToken.linha,
                    comentarioToken.coluna,
                    comentarioToken.lexema
                )
            );
        }

        // Analisar DOCTYPE (opcional)
        if (this.verificarTipoSimboloAtual(TipoToken.DOCTYPE)) {
            const docTypeToken = this.avancar();
            documento.docType = new DocTypeLmht(
                docTypeToken.linha,
                docTypeToken.coluna,
                docTypeToken.lexema
            );
        }

        // Analisar comentários após DOCTYPE
        while (this.verificarTipoSimboloAtual(TipoToken.COMENTARIO)) {
            const comentarioToken = this.avancar();
            documento.comentarios.push(
                new ComentarioLmht(
                    comentarioToken.linha,
                    comentarioToken.coluna,
                    comentarioToken.lexema
                )
            );
        }

        // Analisar elemento raiz
        if (this.verificarTipoSimboloAtual(TipoToken.MENOR_QUE)) {
            documento.elementoRaiz = this.analisarElemento();
        } else if (!this.estaNoFim()) {
            this.erros.push(
                `Esperado elemento raiz na linha ${this.simboloAtual().linha}, coluna ${this.simboloAtual().coluna}`
            );
        }

        return documento;
    }

    private analisarElemento(): ElementoLmht | null {
        if (!this.consumir(TipoToken.MENOR_QUE, 'Esperado "<" no início da tag')) {
            return null;
        }

        const tokenInicio = this.simboloAnterior();
        
        // Verificar se é tag de fechamento (isso não deveria acontecer aqui)
        if (this.verificarTipoSimboloAtual(TipoToken.BARRA)) {
            this.erros.push(
                `Tag de fechamento inesperada na linha ${tokenInicio.linha}, coluna ${tokenInicio.coluna}`
            );
            return null;
        }

        if (!this.verificarTipoSimboloAtual(TipoToken.IDENTIFICADOR)) {
            this.erros.push(
                `Esperado nome da tag na linha ${this.simboloAtual().linha}, coluna ${this.simboloAtual().coluna}`
            );
            return null;
        }

        const tokenNome = this.avancar();
        const nomeTag = tokenNome.lexema;

        // Analisar atributos
        const atributos = this.analisarAtributos();

        // Verificar se é auto-fechante
        if (this.verificarTipoSimboloAtual(TipoToken.BARRA_MAIOR_QUE)) {
            this.avancar();
            return new ElementoLmht(
                tokenInicio.linha,
                tokenInicio.coluna,
                nomeTag,
                atributos,
                [],
                true
            );
        }

        // Tag normal - consumir '>'
        if (!this.consumir(TipoToken.MAIOR_QUE, 'Esperado ">" após nome da tag ou atributos')) {
            return null;
        }

        // Analisar filhos (elementos, texto, comentários)
        const filhos: (ElementoLmht | TextoLmht)[] = [];

        while (!this.estaNoFim() && !this.verificarTipoSimboloAtual(TipoToken.MENOR_QUE_BARRA)) {
            // Texto
            if (this.verificarTipoSimboloAtual(TipoToken.TEXTO)) {
                const tokenTexto = this.avancar();
                filhos.push(
                    new TextoLmht(tokenTexto.linha, tokenTexto.coluna, tokenTexto.lexema)
                );
            }
            // Comentário
            else if (this.verificarTipoSimboloAtual(TipoToken.COMENTARIO)) {
                // Comentários são ignorados na estrutura de filhos (podem ser tratados separadamente)
                this.avancar();
            }
            // CDATA
            else if (this.verificarTipoSimboloAtual(TipoToken.CDATA)) {
                const tokenCData = this.avancar();
                // CDATA é tratado como texto
                const conteudoCData = this.extrairConteudoCData(tokenCData.lexema);
                filhos.push(
                    new TextoLmht(tokenCData.linha, tokenCData.coluna, conteudoCData)
                );
            }
            // Elemento filho
            else if (this.verificarTipoSimboloAtual(TipoToken.MENOR_QUE)) {
                const filho = this.analisarElemento();
                if (filho) {
                    filhos.push(filho);
                }
            } else {
                break;
            }
        }

        // Consumir tag de fechamento
        if (!this.consumir(TipoToken.MENOR_QUE_BARRA, `Esperado "</" para fechar tag "${nomeTag}"`)) {
            return null;
        }

        if (!this.verificarTipoSimboloAtual(TipoToken.IDENTIFICADOR)) {
            this.erros.push(
                `Esperado nome da tag de fechamento na linha ${this.simboloAtual().linha}`
            );
            return null;
        }

        const tokenFechamento = this.avancar();
        if (tokenFechamento.lexema !== nomeTag) {
            this.erros.push(
                `Tag de fechamento "${tokenFechamento.lexema}" não corresponde à tag de abertura "${nomeTag}" na linha ${tokenFechamento.linha}`
            );
        }

        if (!this.consumir(TipoToken.MAIOR_QUE, 'Esperado ">" no fim da tag de fechamento')) {
            return null;
        }

        return new ElementoLmht(
            tokenInicio.linha,
            tokenInicio.coluna,
            nomeTag,
            atributos,
            filhos,
            false
        );
    }

    private analisarAtributos(): Atributo[] {
        const atributos: Atributo[] = [];

        while (this.verificarTipoSimboloAtual(TipoToken.IDENTIFICADOR)) {
            const tokenNome = this.avancar();
            const nomeAtributo = tokenNome.lexema;

            if (!this.consumir(TipoToken.IGUAL, `Esperado "=" após nome do atributo "${nomeAtributo}"`)) {
                continue;
            }

            if (!this.verificarTipoSimboloAtual(TipoToken.VALOR_ATRIBUTO)) {
                this.erros.push(
                    `Esperado valor para atributo "${nomeAtributo}" na linha ${this.simboloAtual().linha}`
                );
                continue;
            }

            const tokenValor = this.avancar();

            atributos.push({
                nome: nomeAtributo,
                valor: tokenValor.lexema,
                linha: tokenNome.linha,
                coluna: tokenNome.coluna
            });
        }

        return atributos;
    }

    private extrairConteudoCData(lexema: string): string {
        // Extrair conteúdo de <![CDATA[...]]>
        const inicio = lexema.indexOf('[CDATA[') + 7;
        const fim = lexema.lastIndexOf(']]>');
        if (inicio > 6 && fim > inicio) {
            return lexema.substring(inicio, fim);
        }
        return lexema;
    }

    // Métodos auxiliares seguindo o padrão do Delégua

    private simboloAtual(): Token {
        return this.tokens[this.atual];
    }

    private simboloAnterior(): Token {
        return this.tokens[this.atual - 1];
    }

    private avancar(): Token {
        if (!this.estaNoFim()) {
            this.atual++;
        }
        return this.simboloAnterior();
    }

    private estaNoFim(): boolean {
        return this.simboloAtual().tipo === TipoToken.EOF;
    }

    private verificarTipoSimboloAtual(...tipos: TipoToken[]): boolean {
        for (const tipo of tipos) {
            if (this.simboloAtual().tipo === tipo) {
                return true;
            }
        }
        return false;
    }

    private consumir(tipo: TipoToken, mensagemErro: string): boolean {
        if (this.verificarTipoSimboloAtual(tipo)) {
            this.avancar();
            return true;
        }

        this.erros.push(
            `${mensagemErro} na linha ${this.simboloAtual().linha}, coluna ${this.simboloAtual().coluna}`
        );
        return false;
    }
}