import { RetornoLexador } from "./retorno-lexador";
import { TipoToken } from "./tipo-token";
import { Token } from "./token";

export class LexadorLmht {
    private codigo: string = '';
    private tokens: Token[] = [];
    private erros: string[] = [];
    private posicao: number = 0;
    private linha: number = 1;
    private coluna: number = 1;
    
    mapear(codigo: string): RetornoLexador {
        this.codigo = codigo;
        this.tokens = [];
        this.erros = [];
        this.posicao = 0;
        this.linha = 1;
        this.coluna = 1;
        
        while (!this.estaNoFim()) {
            this.analisarToken();
        }
        
        this.adicionarToken(TipoToken.EOF, '');
        
        return {
            tokens: this.tokens,
            erros: this.erros
        };
    }
    
    private analisarToken(): void {
        const inicio = this.posicao;
        const char = this.avancar();
        
        switch (char) {
            case '<':
                this.analisarMenorQue();
                break;
                
            case '>':
                this.adicionarToken(TipoToken.MAIOR_QUE, '>');
                break;
                
            case '/':
                if (this.verificar('>')) {
                    this.avancar();
                    this.adicionarToken(TipoToken.BARRA_MAIOR_QUE, '/>');
                } else {
                    this.adicionarToken(TipoToken.BARRA, '/');
                }
                break;
                
            case '=':
                this.adicionarToken(TipoToken.IGUAL, '=');
                break;
                
            case '"':
                this.analisarValorAtributo('"');
                break;
                
            case "'":
                this.analisarValorAtributo("'");
                break;
                
            case ' ':
            case '\r':
            case '\t':
                // Ignorar espaços em branco dentro de tags
                break;
                
            case '\n':
                this.linha++;
                this.coluna = 1;
                break;
                
            default:
                if (this.eAlfabetico(char)) {
                    this.analisarIdentificador(inicio);
                } else {
                    this.erros.push(`Caractere inesperado '${char}' na linha ${this.linha}, coluna ${this.coluna}`);
                }
                break;
        }
    }
    
    private analisarMenorQue(): void {
        // Verificar se é comentário: <!--
        if (this.verificar('!') && this.verificarProximo('-') && this.verificarNaPosicao(this.posicao + 2, '-')) {
            this.analisarComentario();
            return;
        }
        
        // Verificar se é CDATA: <![CDATA[
        if (this.verificar('!') && this.verificarProximo('[') && 
            this.verificarSequencia('![CDATA[')) {
            this.analisarCData();
            return;
        }
        
        // Verificar se é DOCTYPE: <!DOCTYPE
        if (this.verificar('!') && this.verificarSequencia('!DOCTYPE')) {
            this.analisarDocType();
            return;
        }
        
        // Verificar se é declaração XML: <?xml
        if (this.verificar('?')) {
            this.analisarDeclaracaoXml();
            return;
        }
        
        // Verificar se é tag de fechamento: </
        if (this.verificar('/')) {
            this.avancar();
            this.adicionarToken(TipoToken.MENOR_QUE_BARRA, '</');
            return;
        }
        
        // Tag de abertura normal: <
        this.adicionarToken(TipoToken.MENOR_QUE, '<');
    }
    
    private analisarComentario(): void {
        const inicio = this.posicao - 1; // Incluir o '<'
        
        // Avançar sobre '!--'
        this.avancar(); // !
        this.avancar(); // -
        this.avancar(); // -
        
        // Ler até encontrar '-->'
        while (!this.estaNoFim()) {
            if (this.verificar('-') && this.verificarProximo('-') && this.verificarNaPosicao(this.posicao + 2, '>')) {
                this.avancar(); // -
                this.avancar(); // -
                this.avancar(); // >
                break;
            }
            
            if (this.avancar() === '\n') {
                this.linha++;
                this.coluna = 1;
            }
        }
        
        const lexema = this.codigo.substring(inicio, this.posicao);
        this.adicionarToken(TipoToken.COMENTARIO, lexema);
    }
    
    private analisarCData(): void {
        const inicio = this.posicao - 1; // Incluir o '<'
        
        // Avançar sobre '![CDATA['
        while (this.atual() !== '[' || !this.verificarSequencia('[CDATA[')) {
            this.avancar();
        }
        
        // Pular '![CDATA['
        for (let i = 0; i < 8; i++) {
            this.avancar();
        }
        
        // Ler até encontrar ']]>'
        while (!this.estaNoFim()) {
            if (this.verificar(']') && this.verificarProximo(']') && this.verificarNaPosicao(this.posicao + 2, '>')) {
                this.avancar(); // ]
                this.avancar(); // ]
                this.avancar(); // >
                break;
            }
            
            if (this.avancar() === '\n') {
                this.linha++;
                this.coluna = 1;
            }
        }
        
        const lexema = this.codigo.substring(inicio, this.posicao);
        this.adicionarToken(TipoToken.CDATA, lexema);
    }
    
    private analisarDocType(): void {
        const inicio = this.posicao - 1;
        
        // Ler até encontrar '>'
        let nivelParenteses = 0;
        
        while (!this.estaNoFim()) {
            const char = this.atual();
            
            if (char === '[') {
                nivelParenteses++;
            } else if (char === ']') {
                nivelParenteses--;
            } else if (char === '>' && nivelParenteses === 0) {
                this.avancar();
                break;
            }
            
            if (this.avancar() === '\n') {
                this.linha++;
                this.coluna = 1;
            }
        }
        
        const lexema = this.codigo.substring(inicio, this.posicao);
        this.adicionarToken(TipoToken.DOCTYPE, lexema);
    }
    
    private analisarDeclaracaoXml(): void {
        const inicio = this.posicao - 1;
        
        // Avançar sobre '?'
        this.avancar();
        
        // Ler até encontrar '?>'
        while (!this.estaNoFim()) {
            if (this.verificar('?') && this.verificarProximo('>')) {
                this.avancar(); // ?
                this.avancar(); // >
                break;
            }
            
            if (this.avancar() === '\n') {
                this.linha++;
                this.coluna = 1;
            }
        }
        
        const lexema = this.codigo.substring(inicio, this.posicao);
        this.adicionarToken(TipoToken.DECLARACAO_XML, lexema);
    }
    
    private analisarIdentificador(inicio: number): void {
        while (this.eAlfanumerico(this.atual()) || this.atual() === '-' || this.atual() === '_') {
            this.avancar();
        }
        
        const lexema = this.codigo.substring(inicio, this.posicao);
        this.adicionarToken(TipoToken.IDENTIFICADOR, lexema);
    }
    
    private analisarValorAtributo(delimitador: string): void {
        const inicio = this.posicao - 1; // Incluir a aspa inicial
        
        while (!this.estaNoFim() && this.atual() !== delimitador) {
            if (this.avancar() === '\n') {
                this.linha++;
                this.coluna = 1;
            }
        }
        
        if (this.estaNoFim()) {
            this.erros.push(`String não terminada na linha ${this.linha}`);
            return;
        }
        
        // Capturar a aspa final
        this.avancar();
        
        const lexema = this.codigo.substring(inicio, this.posicao);
        // Remover aspas do lexema para obter apenas o valor
        const valor = lexema.substring(1, lexema.length - 1);
        this.adicionarToken(TipoToken.VALOR_ATRIBUTO, valor);
    }
    
    private eAlfabetico(char: string): boolean {
        return (char >= 'a' && char <= 'z') ||
               (char >= 'A' && char <= 'Z') ||
               char === '_' ||
               char === ':' ||
               // Suporte a caracteres acentuados portugueses
               'áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ'.indexOf(char) !== -1;
    }
    
    private eAlfanumerico(char: string): boolean {
        return this.eAlfabetico(char) || this.eDigito(char);
    }
    
    private eDigito(char: string): boolean {
        return char >= '0' && char <= '9';
    }
    
    private verificar(esperado: string): boolean {
        if (this.estaNoFim()) return false;
        return this.codigo.charAt(this.posicao) === esperado;
    }
    
    private verificarProximo(esperado: string): boolean {
        if (this.posicao + 1 >= this.codigo.length) return false;
        return this.codigo.charAt(this.posicao + 1) === esperado;
    }
    
    private verificarNaPosicao(posicao: number, esperado: string): boolean {
        if (posicao >= this.codigo.length) return false;
        return this.codigo.charAt(posicao) === esperado;
    }
    
    private verificarSequencia(sequencia: string): boolean {
        const fim = this.posicao + sequencia.length;
        if (fim > this.codigo.length) return false;
        
        return this.codigo.substring(this.posicao, fim) === sequencia;
    }
    
    private atual(): string {
        if (this.estaNoFim()) return '\0';
        return this.codigo.charAt(this.posicao);
    }
    
    private avancar(): string {
        const char = this.codigo.charAt(this.posicao);
        this.posicao++;
        this.coluna++;
        return char;
    }
    
    private estaNoFim(): boolean {
        return this.posicao >= this.codigo.length;
    }
    
    private adicionarToken(tipo: TipoToken, lexema: string): void {
        this.tokens.push({
            tipo,
            lexema,
            linha: this.linha,
            coluna: this.coluna - lexema.length
        });
    }
}