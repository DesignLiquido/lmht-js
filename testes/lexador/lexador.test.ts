import { LexadorLmht } from '../../fontes/lexador/lexador-lmht';
import { TipoToken } from '../../fontes/lexador/tipo-token';

describe('Lexador LMHT', () => {
    describe('mapear()', () => {
        let lexador: LexadorLmht;

        beforeEach(() => {
            lexador = new LexadorLmht();
        });

        describe('Tags simples', () => {
            it('Trivial - Tag de abertura simples', () => {
                const resultado = lexador.mapear('<lmht>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(3);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.MENOR_QUE);
                expect(resultado.tokens[1].tipo).toBe(TipoToken.IDENTIFICADOR);
                expect(resultado.tokens[1].lexema).toBe('lmht');
                expect(resultado.tokens[2].tipo).toBe(TipoToken.MAIOR_QUE);
            });

            it('Trivial - Tag de fechamento simples', () => {
                const resultado = lexador.mapear('</lmht>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(3);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.MENOR_QUE_BARRA);
                expect(resultado.tokens[0].lexema).toBe('</');
                expect(resultado.tokens[1].tipo).toBe(TipoToken.IDENTIFICADOR);
                expect(resultado.tokens[1].lexema).toBe('lmht');
                expect(resultado.tokens[2].tipo).toBe(TipoToken.MAIOR_QUE);
            });

            it('Trivial - Tag auto-fechante', () => {
                const resultado = lexador.mapear('<imagem />');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(3);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.MENOR_QUE);
                expect(resultado.tokens[1].tipo).toBe(TipoToken.IDENTIFICADOR);
                expect(resultado.tokens[1].lexema).toBe('imagem');
                expect(resultado.tokens[2].tipo).toBe(TipoToken.BARRA_MAIOR_QUE);
                expect(resultado.tokens[2].lexema).toBe('/>');
            });

            it('Trivial - Tag com hífen no nome', () => {
                const resultado = lexador.mapear('<lista-simples>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[1].tipo).toBe(TipoToken.IDENTIFICADOR);
                expect(resultado.tokens[1].lexema).toBe('lista-simples');
            });

            it('Trivial - Tag com caracteres acentuados', () => {
                const resultado = lexador.mapear('<vídeo>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[1].tipo).toBe(TipoToken.IDENTIFICADOR);
                expect(resultado.tokens[1].lexema).toBe('vídeo');
            });
        });

        describe('Atributos', () => {
            it('Trivial - Atributo com aspas duplas', () => {
                const resultado = lexador.mapear('<p classe="minha-classe">');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(5);
                expect(resultado.tokens[1].tipo).toBe(TipoToken.IDENTIFICADOR);
                expect(resultado.tokens[1].lexema).toBe('p');
                expect(resultado.tokens[2].tipo).toBe(TipoToken.IDENTIFICADOR);
                expect(resultado.tokens[2].lexema).toBe('classe');
                expect(resultado.tokens[3].tipo).toBe(TipoToken.IGUAL);
                expect(resultado.tokens[4].tipo).toBe(TipoToken.VALOR_ATRIBUTO);
                expect(resultado.tokens[4].lexema).toBe('minha-classe');
            });

            it('Trivial - Atributo com aspas simples', () => {
                const resultado = lexador.mapear("<p classe='minha-classe'>");

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[4].tipo).toBe(TipoToken.VALOR_ATRIBUTO);
                expect(resultado.tokens[4].lexema).toBe('minha-classe');
            });

            it('Trivial - Múltiplos atributos', () => {
                const resultado = lexador.mapear('<imagem fonte="logo.png" alt="Logo" largura="100">');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(11);
                
                // Primeiro atributo: fonte="logo.png"
                expect(resultado.tokens[2].lexema).toBe('fonte');
                expect(resultado.tokens[4].lexema).toBe('logo.png');
                
                // Segundo atributo: alt="Logo"
                expect(resultado.tokens[5].lexema).toBe('alt');
                expect(resultado.tokens[7].lexema).toBe('Logo');
                
                // Terceiro atributo: largura="100"
                expect(resultado.tokens[8].lexema).toBe('largura');
                expect(resultado.tokens[10].lexema).toBe('100');
            });

            it('Trivial - Atributo com caracteres especiais no valor', () => {
                const resultado = lexador.mapear('<ligacao destino="https://exemplo.com.br/pagina?param=valor&outro=2">');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[4].lexema).toBe('https://exemplo.com.br/pagina?param=valor&outro=2');
            });
        });

        describe('Comentários', () => {
            it('Trivial - Comentário simples', () => {
                const resultado = lexador.mapear('<!-- Isto é um comentário -->');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(2);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.COMENTARIO);
                expect(resultado.tokens[0].lexema).toBe('<!-- Isto é um comentário -->');
            });

            it('Trivial - Comentário multi-linha', () => {
                const codigo = `<!-- 
                    Comentário
                    em múltiplas linhas
                -->`;
                const resultado = lexador.mapear(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.COMENTARIO);
            });

            it('Trivial - Comentário com caracteres especiais', () => {
                const resultado = lexador.mapear('<!-- Teste @#$%^&*()_+ -->');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.COMENTARIO);
            });
        });

        describe('Declaração XML', () => {
            it('Trivial - Declaração XML padrão', () => {
                const resultado = lexador.mapear('<?xml version="1.0" encoding="UTF-8"?>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(2);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.DECLARACAO_XML);
                expect(resultado.tokens[0].lexema).toContain('<?xml');
                expect(resultado.tokens[0].lexema).toContain('?>');
            });

            it('Trivial - Declaração XML com standalone', () => {
                const resultado = lexador.mapear('<?xml version="1.0" standalone="yes"?>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.DECLARACAO_XML);
            });
        });

        describe('DOCTYPE', () => {
            it('Trivial - DOCTYPE simples', () => {
                const resultado = lexador.mapear('<!DOCTYPE lmht>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(2);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.DOCTYPE);
                expect(resultado.tokens[0].lexema).toBe('<!DOCTYPE lmht>');
            });

            it('Trivial - DOCTYPE com DTD externa', () => {
                const resultado = lexador.mapear('<!DOCTYPE lmht SYSTEM "lmht.dtd">');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.DOCTYPE);
            });
        });

        describe('CDATA', () => {
            it('Trivial - CDATA simples', () => {
                const resultado = lexador.mapear('<![CDATA[Conteúdo não parseado]]>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(2);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.CDATA);
                expect(resultado.tokens[0].lexema).toContain('CDATA');
            });

            it('Trivial - CDATA com caracteres especiais', () => {
                const resultado = lexador.mapear('<![CDATA[<tag> & "texto"]]>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.CDATA);
            });
        });

        describe('Estruturas completas', () => {
            it('Comum - Documento LMHT simples', () => {
                const codigo = `<lmht>
    <cabeca>
        <titulo>Teste</titulo>
    </cabeca>
    <corpo>
        <p>Conteúdo</p>
    </corpo>
</lmht>`;
                const resultado = lexador.mapear(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                // Verificar presença das principais tags
                const identificadores = resultado.tokens
                    .filter(t => t.tipo === TipoToken.IDENTIFICADOR)
                    .map(t => t.lexema);
                
                expect(identificadores).toContain('lmht');
                expect(identificadores).toContain('cabeca');
                expect(identificadores).toContain('titulo');
                expect(identificadores).toContain('corpo');
                expect(identificadores).toContain('p');
            });

            it('Comum - Documento com comentários e atributos', () => {
                const codigo = `<?xml version="1.0"?>
<lmht>
    <!-- Cabeçalho -->
    <cabeca>
        <titulo>Minha Página</titulo>
    </cabeca>
    <!-- Corpo da página -->
    <corpo classe="principal">
        <titulo1>Bem-vindo</titulo1>
        <p id="intro">Texto de introdução</p>
    </corpo>
</lmht>`;
                const resultado = lexador.mapear(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                // Verificar declaração XML
                const declaracaoXml = resultado.tokens.find(t => t.tipo === TipoToken.DECLARACAO_XML);
                expect(declaracaoXml).toBeDefined();
                
                // Verificar comentários
                const comentarios = resultado.tokens.filter(t => t.tipo === TipoToken.COMENTARIO);
                expect(comentarios.length).toBeGreaterThanOrEqual(2);
                
                // Verificar atributos
                const valores = resultado.tokens.filter(t => t.tipo === TipoToken.VALOR_ATRIBUTO);
                expect(valores.some(v => v.lexema === 'principal')).toBe(true);
                expect(valores.some(v => v.lexema === 'intro')).toBe(true);
            });

            it('Comum - Lista com múltiplos itens', () => {
                const codigo = `<lista-simples>
    <item-lista>Primeiro item</item-lista>
    <item-lista>Segundo item</item-lista>
    <item-lista>Terceiro item</item-lista>
</lista-simples>`;
                const resultado = lexador.mapear(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                const listaSimples = resultado.tokens
                    .filter(t => t.tipo === TipoToken.IDENTIFICADOR && t.lexema === 'lista-simples');
                expect(listaSimples).toHaveLength(2); // abertura e fechamento
                
                const itemLista = resultado.tokens
                    .filter(t => t.tipo === TipoToken.IDENTIFICADOR && t.lexema === 'item-lista');
                expect(itemLista).toHaveLength(6); // 3 aberturas e 3 fechamentos
            });

            it('Comum - Tags auto-fechantes com atributos', () => {
                const codigo = `<corpo>
    <imagem fonte="logo.png" alt="Logo" />
    <linha-horizontal />
    <quebra-linha />
</corpo>`;
                const resultado = lexador.mapear(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                const autoFechantes = resultado.tokens.filter(t => t.tipo === TipoToken.BARRA_MAIOR_QUE);
                expect(autoFechantes).toHaveLength(3);
            });
        });

        describe('Rastreamento de posição', () => {
            it('Trivial - Linha e coluna corretas', () => {
                const codigo = `<lmht>
    <corpo>
    </corpo>
</lmht>`;
                const resultado = lexador.mapear(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                // Primeira tag deve estar na linha 1
                expect(resultado.tokens[0].linha).toBe(1);
                
                // Tag 'corpo' deve estar na linha 2
                const corpoToken = resultado.tokens.find(
                    t => t.tipo === TipoToken.IDENTIFICADOR && t.lexema === 'corpo'
                );
                expect(corpoToken).toBeDefined();
                expect(corpoToken!.linha).toBe(2);
            });
        });

        describe('Tratamento de erros', () => {
            it('Erro - String não terminada', () => {
                const resultado = lexador.mapear('<p classe="sem-fechar>');

                expect(resultado.erros.length).toBeGreaterThan(0);
                expect(resultado.erros[0]).toContain('não terminada');
            });

            it('Erro - Caractere inesperado', () => {
                const resultado = lexador.mapear('<p @ classe="teste">');

                expect(resultado.erros.length).toBeGreaterThan(0);
            });
        });

        describe('Casos especiais', () => {
            it('Trivial - Documento vazio', () => {
                const resultado = lexador.mapear('');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(1);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.EOF);
            });

            it('Trivial - Somente espaços em branco', () => {
                const resultado = lexador.mapear('   \n\t  \r\n  ');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.tokens).toHaveLength(1);
                expect(resultado.tokens[0].tipo).toBe(TipoToken.EOF);
            });

            it('Comum - Tags aninhadas profundamente', () => {
                const codigo = `<a><b><c><d><e>conteúdo</e></d></c></b></a>`;
                const resultado = lexador.mapear(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                const identificadores = resultado.tokens
                    .filter(t => t.tipo === TipoToken.IDENTIFICADOR)
                    .map(t => t.lexema);
                
                expect(identificadores).toEqual(['a', 'b', 'c', 'd', 'e', 'e', 'd', 'c', 'b', 'a']);
            });

            it('Comum - Atributos sem espaços', () => {
                const resultado = lexador.mapear('<img fonte="a.png"alt="teste"largura="10"/>');

                expect(resultado.erros).toHaveLength(0);
                
                const atributos = resultado.tokens
                    .filter(t => t.tipo === TipoToken.IDENTIFICADOR)
                    .map(t => t.lexema);
                
                expect(atributos).toContain('fonte');
                expect(atributos).toContain('alt');
                expect(atributos).toContain('largura');
            });
        });

        describe('Compatibilidade LMHT', () => {
            it('Comum - Tags principais do LMHT', () => {
                const tagsLmht = [
                    'lmht', 'cabeca', 'titulo', 'corpo', 'paragrafo',
                    'negrito', 'italico', 'sublinhado', 'lista-simples',
                    'item-lista', 'imagem', 'ligacao', 'tabela', 'linha-tabela',
                    'celula-cabecalho', 'celula-dados', 'formulario', 'entrada-texto'
                ];

                tagsLmht.forEach(tag => {
                    const codigo = `<${tag}></${tag}>`;
                    const resultado = lexador.mapear(codigo);

                    expect(resultado.erros).toHaveLength(0);
                    
                    const tagEncontrada = resultado.tokens.some(
                        t => t.tipo === TipoToken.IDENTIFICADOR && t.lexema === tag
                    );
                    expect(tagEncontrada).toBe(true);
                });
            });

            it('Comum - Atributos comuns do LMHT', () => {
                const atributosLmht = [
                    'classe', 'id', 'estilo', 'fonte', 'alt', 'largura',
                    'altura', 'destino', 'tipo', 'nome', 'valor'
                ];

                atributosLmht.forEach(atributo => {
                    const codigo = `<div ${atributo}="teste">`;
                    const resultado = lexador.mapear(codigo);

                    expect(resultado.erros).toHaveLength(0);
                    
                    const atributoEncontrado = resultado.tokens.some(
                        t => t.tipo === TipoToken.IDENTIFICADOR && t.lexema === atributo
                    );
                    expect(atributoEncontrado).toBe(true);
                });
            });
        });
    });
});
