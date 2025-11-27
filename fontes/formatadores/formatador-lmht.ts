import { Atributo, ComentarioLmht, DeclaracaoXmlLmht, DocTypeLmht, DocumentoLmht, ElementoLmht, TextoLmht } from "../construtos";
import { OpcoesFormatadorLmht } from "./opcoes-formatador-lmht";

export class FormatadorLmht {
    private indentacaoAtual: number = 0;
    private quebraLinha: string;
    private tamanhoIdentacao: number;
    private usarTabulacao: boolean;
    private aspasAtributos: 'simples' | 'duplas';
    private espacoAntesAutoFechante: boolean;
    private quebrarAtributosEmLinhas: boolean;
    private limiteCaracteresPorLinha: number;
    private preservarQuebraLinhaTexto: boolean;
    private ordenarAtributos: boolean;
    private codigoFormatado: string = '';

    constructor(opcoes: OpcoesFormatadorLmht = {}) {
        this.quebraLinha = opcoes.quebraLinha ?? '\n';
        this.tamanhoIdentacao = opcoes.tamanhoIdentacao ?? 4;
        this.usarTabulacao = opcoes.usarTabulacao ?? false;
        this.aspasAtributos = opcoes.aspasAtributos ?? 'duplas';
        this.espacoAntesAutoFechante = opcoes.espacoAntesAutoFechante ?? true;
        this.quebrarAtributosEmLinhas = opcoes.quebrarAtributosEmLinhas ?? false;
        this.limiteCaracteresPorLinha = opcoes.limiteCaracteresPorLinha ?? 100;
        this.preservarQuebraLinhaTexto = opcoes.preservarQuebraLinhaTexto ?? false;
        this.ordenarAtributos = opcoes.ordenarAtributos ?? false;
    }

    formatar(documento: DocumentoLmht): string {
        this.codigoFormatado = '';
        this.indentacaoAtual = 0;

        this.formatarDocumento(documento);

        return this.codigoFormatado;
    }

    private formatarDocumento(documento: DocumentoLmht): void {
        // Declaração XML
        if (documento.declaracaoXml) {
            this.formatarDeclaracaoXml(documento.declaracaoXml);
            this.adicionarQuebraLinha();
        }

        // DOCTYPE
        if (documento.docType) {
            this.formatarDocType(documento.docType);
            this.adicionarQuebraLinha();
        }

        // Comentários antes do elemento raiz
        if (documento.comentarios && documento.comentarios.length > 0) {
            for (const comentario of documento.comentarios) {
                this.formatarComentario(comentario);
                this.adicionarQuebraLinha();
            }
        }

        // Elemento raiz
        if (documento.elementoRaiz) {
            this.formatarElemento(documento.elementoRaiz);
        }
    }

    private formatarElemento(elemento: ElementoLmht): void {
        const atributos = this.ordenarAtributos 
            ? this.ordenarAtributosAlfabeticamente(elemento.atributos)
            : elemento.atributos;

        // Verificar se elemento tem apenas texto como filho
        const temApenasTexto = elemento.filhos.length === 1 && 
                               elemento.filhos[0] instanceof TextoLmht;
        
        // Verificar se elemento está vazio
        const elementoVazio = elemento.filhos.length === 0;

        // Verificar se deve quebrar atributos em múltiplas linhas
        const tagAberturaCompleta = this.construirTagAbertura(elemento.nome, atributos, elemento.autoFechante);
        const deveQuebrarAtributos = (this.quebrarAtributosEmLinhas && atributos.length > 2) ||
                                     tagAberturaCompleta.length > this.limiteCaracteresPorLinha;

        // Tag de abertura com indentação
        this.adicionarIdentacao();

        // Para elementos com apenas texto inline, formatar em uma linha
        if (temApenasTexto && !deveQuebrarAtributos) {
            const tagAbertura = this.construirTagAbertura(elemento.nome, atributos, false);
            this.codigoFormatado += tagAbertura.replace('>', '');
            this.codigoFormatado += '>';
            
            const texto = elemento.filhos[0] as TextoLmht;
            this.codigoFormatado += this.formatarTextoInline(texto.conteudo);
            this.codigoFormatado += '</' + elemento.nome + '>';
            this.adicionarQuebraLinha();
            return;
        }

        // Para elementos vazios sem quebra de atributos, formatar em uma linha
        if (elementoVazio && !deveQuebrarAtributos && !elemento.autoFechante) {
            const tagAbertura = this.construirTagAbertura(elemento.nome, atributos, false);
            this.codigoFormatado += tagAbertura;
            this.codigoFormatado += '</' + elemento.nome + '>';
            this.adicionarQuebraLinha();
            return;
        }

        // Formatar tag com atributos quebrados ou normal
        if (deveQuebrarAtributos && atributos.length > 0) {
            this.formatarTagComAtributosQuebrados(elemento.nome, atributos, elemento.autoFechante);
        } else {
            const tagAbertura = this.construirTagAbertura(elemento.nome, atributos, elemento.autoFechante);
            this.codigoFormatado += tagAbertura;
        }

        this.adicionarQuebraLinha();

        // Se for auto-fechante, termina aqui
        if (elemento.autoFechante) {
            return;
        }

        // Formatar filhos
        if (elemento.filhos.length > 0) {
            this.indentacaoAtual++;

            for (const filho of elemento.filhos) {
                if (filho instanceof ElementoLmht) {
                    this.formatarElemento(filho);
                } else if (filho instanceof TextoLmht) {
                    this.formatarTextoBloco(filho);
                }
            }

            this.indentacaoAtual--;
        }

        // Tag de fechamento
        this.adicionarIdentacao();
        this.codigoFormatado += '</' + elemento.nome + '>';
        this.adicionarQuebraLinha();
    }

    private formatarTagComAtributosQuebrados(
        nomeTag: string, 
        atributos: Atributo[], 
        autoFechante: boolean
    ): void {
        this.codigoFormatado += '<' + nomeTag;

        if (atributos.length > 0) {
            this.indentacaoAtual++;
            for (let i = 0; i < atributos.length; i++) {
                this.adicionarQuebraLinha();
                this.adicionarIdentacao();
                this.codigoFormatado += this.formatarAtributo(atributos[i]);
            }
            this.indentacaoAtual--;
        }

        if (autoFechante) {
            if (this.espacoAntesAutoFechante) {
                this.codigoFormatado += ' />';
            } else {
                this.codigoFormatado += '/>';
            }
        } else {
            this.codigoFormatado += '>';
        }
    }

    private construirTagAbertura(nomeTag: string, atributos: Atributo[], autoFechante: boolean): string {
        let tag = '<' + nomeTag;

        if (atributos.length > 0) {
            tag += this.formatarAtributos(atributos);
        }

        if (autoFechante) {
            tag += this.espacoAntesAutoFechante ? ' />' : '/>';
        } else {
            tag += '>';
        }

        return tag;
    }

    private formatarAtributos(atributos: Atributo[]): string {
        return atributos.map(attr => ' ' + this.formatarAtributo(attr)).join('');
    }

    private formatarAtributo(atributo: Atributo): string {
        const aspas = this.aspasAtributos === 'simples' ? "'" : '"';
        return `${atributo.nome}=${aspas}${atributo.valor}${aspas}`;
    }

    private ordenarAtributosAlfabeticamente(atributos: Atributo[]): Atributo[] {
        return [...atributos].sort((a, b) => a.nome.localeCompare(b.nome));
    }

    private formatarTextoInline(conteudo: string): string {
        // Remove quebras de linha e espaços múltiplos para texto inline
        return conteudo
            .replace(/\s+/g, ' ')
            .trim();
    }

    private formatarTextoBloco(texto: TextoLmht): void {
        let conteudo = texto.conteudo;

        if (!this.preservarQuebraLinhaTexto) {
            conteudo = conteudo.trim();
        }

        if (conteudo.length === 0) {
            return;
        }

        // Se o texto tem múltiplas linhas e queremos preservar
        if (this.preservarQuebraLinhaTexto && conteudo.includes('\n')) {
            const linhas = conteudo.split('\n');
            for (const linha of linhas) {
                if (linha.trim().length > 0) {
                    this.adicionarIdentacao();
                    this.codigoFormatado += linha.trim();
                    this.adicionarQuebraLinha();
                }
            }
        } else {
            this.adicionarIdentacao();
            this.codigoFormatado += conteudo;
            this.adicionarQuebraLinha();
        }
    }

    private formatarComentario(comentario: ComentarioLmht): void {
        this.adicionarIdentacao();
        
        // Verificar se o comentário tem múltiplas linhas
        if (comentario.conteudo.includes('\n')) {
            // Comentário multi-linha - preservar estrutura
            const linhas = comentario.conteudo.split('\n');
            for (let i = 0; i < linhas.length; i++) {
                if (i > 0) {
                    this.adicionarIdentacao();
                }
                this.codigoFormatado += linhas[i];
                if (i < linhas.length - 1) {
                    this.adicionarQuebraLinha();
                }
            }
        } else {
            // Comentário de linha única
            this.codigoFormatado += comentario.conteudo;
        }
    }

    private formatarDeclaracaoXml(declaracao: DeclaracaoXmlLmht): void {
        this.codigoFormatado += declaracao.conteudo;
    }

    private formatarDocType(docType: DocTypeLmht): void {
        this.codigoFormatado += docType.conteudo;
    }

    private adicionarIdentacao(): void {
        if (this.usarTabulacao) {
            this.codigoFormatado += '\t'.repeat(this.indentacaoAtual);
        } else {
            this.codigoFormatado += ' '.repeat(this.indentacaoAtual * this.tamanhoIdentacao);
        }
    }

    private adicionarQuebraLinha(): void {
        this.codigoFormatado += this.quebraLinha;
    }
}